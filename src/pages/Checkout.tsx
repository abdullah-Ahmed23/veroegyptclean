import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, Wallet, Smartphone, Upload, CheckCircle2, ChevronRight, ArrowLeft, Info } from 'lucide-react';
import { useCartStore, useUIStore, formatPrice } from '@/lib/store';
import { useAuthStore } from '@/lib/authStore';
import { cn } from '@/lib/utils';
import { CustomHoodieThumbnail } from '@/components/product/CustomHoodieThumbnail';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useActivityLog } from '@/hooks/useActivityLog';
import { useTranslation } from 'react-i18next';

type PaymentMethod = 'cod' | 'wallet' | 'instapay';

export default function Checkout() {
    const navigate = useNavigate();
    const { language, isDarkMode } = useUIStore();
    const { user } = useAuthStore();
    const { items, getSubtotal, clearCart } = useCartStore();
    const subtotal = getSubtotal();
    const hasCustomItems = items.some(i => i.price === 0);
    const shippingFee = (subtotal > 0 && subtotal < 2000) ? 75 : 0;
    const total = subtotal + shippingFee;

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { logActivity } = useActivityLog();
    const { t } = useTranslation();

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        area: '',
        notes: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
            return;
        }


        setIsSubmitting(true);

        try {

            const orderItemsPayload = items.map(item => ({
                product_id: item.productId === 'custom-hoodie' ? null : item.productId,
                variant_id: item.variantId.startsWith('custom-') ? null : item.variantId,
                quantity: item.quantity
            }));

            // 3. Create Order Securely (Server-Side)
            const { data: rpcData, error: orderError } = await supabase.rpc('create_order_secure', {
                customer_data: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    address: `${formData.address}, ${formData.area}, ${formData.city}`
                },
                items: orderItemsPayload,
                payment_method: hasCustomItems ? 'cod' : paymentMethod,
                proof_url: null
            });

            if (orderError) throw orderError;

            // rpcData is { id: string, total: number }
            const orderId = rpcData.id;
            const finalTotal = rpcData.total / 100; // DB returns atomic units

            // 4. Log Order Activity - HANDLED BY DB TRIGGER
            // await logActivity({...});

            // 5. Save Custom Designs (if any) - Handled separately as it's complex data
            const uploadBase64 = async (base64: string, prefix: string) => {
                if (!base64 || !base64.startsWith('data:')) return base64;

                const response = await fetch(base64);
                const blob = await response.blob();
                const ext = blob.type.split('/')[1] || 'png';
                const fileName = `${prefix}-${self.crypto.randomUUID()}.${ext}`;
                const filePath = `designs/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('custom-designs')
                    .upload(filePath, blob);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('custom-designs')
                    .getPublicUrl(filePath);

                return publicUrl;
            };

            for (const item of items) {
                if (item.productId === 'custom-hoodie') {
                    // 5a. Upload preview images
                    const frontUrl = await uploadBase64(item.image, 'front');
                    const backUrl = item.backImage ? await uploadBase64(item.backImage, 'back') : null;

                    // 5b. Upload individual design elements if they are images
                    const sanitizedDesignState = await Promise.all((item.customDesigns || []).map(async (design: any) => {
                        if (design.type === 'image' && design.content.startsWith('data:')) {
                            const uploadedUrl = await uploadBase64(design.content, 'element');
                            return { ...design, content: uploadedUrl };
                        }
                        return design;
                    }));

                    // Save custom design details
                    await supabase.from('custom_designs').insert({
                        order_id: orderId,
                        front_image_url: frontUrl,
                        back_image_url: backUrl,
                        base_color: item.colorHex || item.color,
                        size: item.size,
                        notes: formData.notes,
                        design_state: sanitizedDesignState
                    });

                    // Log Design Activity - HANDLED BY DB TRIGGER
                    // await logActivity({...});
                }
            }

            toast.success(t('checkout.orderPlaced'));
            setIsSuccess(true);
            clearCart();

        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Payment failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="pt-32 min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">{t('checkout.orderPlaced')}</h1>
                        <p className="text-zinc-500 leading-relaxed">
                            {t('checkout.successMessage')}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/shop')}
                        className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-vero-gold transition-colors"
                    >
                        {t('checkout.backToShop')}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={cn(
            "pt-32 pb-20 min-h-screen px-4 md:px-8 transition-colors duration-300",
            isDarkMode ? "bg-black text-white" : "bg-white text-black"
        )}>
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Checkout Area */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Breadcrumbs */}
                        <div className={cn(
                            "flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]",
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        )}>
                            <span className={cn(step >= 1 ? (isDarkMode ? "text-white" : "text-black") : "")}>01 {t('checkout.information')}</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={cn(step >= 2 ? (isDarkMode ? "text-white" : "text-black") : "")}>02 {t('checkout.shipping')}</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={cn(step >= 3 ? (isDarkMode ? "text-white" : "text-black") : "")}>03 {t('checkout.payment')}</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-8"
                                    >
                                        <h2 className="text-2xl font-black uppercase italic">{t('checkout.contactInfo')}</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                required
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder={t('checkout.firstName')}
                                                className={cn(
                                                    "border rounded-lg p-4 focus:outline-none focus:border-vero-gold transition-all",
                                                    isDarkMode ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-black/5 text-black"
                                                )}
                                            />
                                            <input
                                                required
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder={t('checkout.lastName')}
                                                className={cn(
                                                    "border rounded-lg p-4 focus:outline-none focus:border-vero-gold transition-all",
                                                    isDarkMode ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-black/5 text-black"
                                                )}
                                            />
                                        </div>
                                        <input
                                            required
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder={t('checkout.email')}
                                            className={cn(
                                                "w-full border rounded-lg p-4 focus:outline-none focus:border-vero-gold transition-all",
                                                isDarkMode ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-black/5 text-black"
                                            )}
                                        />
                                        <input
                                            required
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder={t('checkout.phone')}
                                            className={cn(
                                                "w-full border rounded-lg p-4 focus:outline-none focus:border-vero-gold transition-all",
                                                isDarkMode ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-black/5 text-black"
                                            )}
                                        />
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-8"
                                    >
                                        <h2 className="text-2xl font-black uppercase italic">{t('checkout.shippingAddress')}</h2>
                                        <input
                                            required
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder={t('checkout.address')}
                                            className={cn(
                                                "w-full border rounded-lg p-4 focus:outline-none focus:border-vero-gold transition-all",
                                                isDarkMode ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-black/5 text-black"
                                            )}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select
                                                name="city"
                                                value={formData.city}
                                                onChange={(e: any) => setFormData({ ...formData, city: e.target.value })}
                                                className={cn(
                                                    "border rounded-lg p-4 focus:outline-none focus:border-vero-gold transition-all",
                                                    isDarkMode ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-black/5 text-black",
                                                    !formData.city && (isDarkMode ? "text-zinc-500" : "text-zinc-400")
                                                )}
                                            >
                                                <option value="">{t('checkout.selectCity')}</option>
                                                <option value="Cairo">Cairo</option>
                                                <option value="Giza">Giza</option>
                                                <option value="Alexandria">Alexandria</option>
                                                <option value="Other">Other Governorates</option>
                                            </select>
                                            <input
                                                required
                                                name="area"
                                                value={formData.area}
                                                onChange={handleInputChange}
                                                placeholder={t('checkout.area')}
                                                className={cn(
                                                    "border rounded-lg p-4 focus:outline-none focus:border-vero-gold transition-all",
                                                    isDarkMode ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-black/5 text-black"
                                                )}
                                            />
                                        </div>
                                        <input
                                            name="postalCode"
                                            placeholder={t('checkout.postalCode')}
                                            className={cn(
                                                "w-full border rounded-lg p-4 focus:outline-none focus:border-vero-gold transition-all",
                                                isDarkMode ? "bg-zinc-900 border-white/5 text-white" : "bg-zinc-50 border-black/5 text-black"
                                            )}
                                        />
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-8"
                                    >
                                        {hasCustomItems ? (
                                            <div className="space-y-8">
                                                <div className={cn(
                                                    "p-8 rounded-2xl border space-y-4",
                                                    isDarkMode ? "bg-vero-gold/5 border-vero-gold/20" : "bg-vero-gold/10 border-vero-gold/30"
                                                )}>
                                                    <div className="flex items-center gap-3 text-vero-gold">
                                                        <Info className="w-6 h-6" />
                                                        <h3 className="text-lg font-black uppercase italic">{t('checkout.customOrderReview')}</h3>
                                                    </div>
                                                    <p className={cn(
                                                        "text-sm leading-relaxed",
                                                        isDarkMode ? "text-zinc-300" : "text-zinc-700"
                                                    )}>
                                                        {t('checkout.customOrderNote')}
                                                    </p>
                                                </div>
                                                <div className={cn(
                                                    "p-8 border rounded-2xl space-y-4",
                                                    isDarkMode ? "bg-zinc-900 border-white/5" : "bg-zinc-50 border-black/5"
                                                )}>
                                                    <h4 className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest",
                                                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                                                    )}>{t('checkout.contactMethod')}</h4>
                                                    <p className={cn("text-xs", isDarkMode ? "text-white" : "text-black")}>
                                                        {t('checkout.contactMethodNote', { phone: formData.phone, email: formData.email })}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                <h2 className="text-2xl font-black uppercase italic">{t('checkout.paymentMethod')}</h2>

                                                <div className="space-y-4">
                                                    <label className={cn(
                                                        "flex items-center justify-between p-6 rounded-xl border transition-all cursor-pointer",
                                                        paymentMethod === 'cod'
                                                            ? (isDarkMode ? "bg-white/5 border-white" : "bg-black/5 border-black")
                                                            : (isDarkMode ? "border-white/10 hover:border-white/20" : "border-black/10 hover:border-black/20")
                                                    )}>
                                                        <div className="flex items-center gap-4">
                                                            <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className={isDarkMode ? "accent-white" : "accent-black"} />
                                                            <div className="space-y-1">
                                                                <span className="font-bold uppercase tracking-widest text-sm">{t('checkout.cod')}</span>
                                                                <p className={cn("text-xs", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>{t('checkout.codNote')}</p>
                                                            </div>
                                                        </div>
                                                        <Truck className={cn("w-5 h-5", isDarkMode ? "text-zinc-500" : "text-zinc-400")} />
                                                    </label>

                                                    <label className={cn(
                                                        "flex items-center justify-between p-6 rounded-xl border transition-all cursor-pointer",
                                                        paymentMethod === 'wallet'
                                                            ? (isDarkMode ? "bg-white/5 border-white" : "bg-black/5 border-black")
                                                            : (isDarkMode ? "border-white/10 hover:border-white/20" : "border-black/10 hover:border-black/20")
                                                    )}>
                                                        <div className="flex items-center gap-4">
                                                            <input type="radio" name="payment" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className={isDarkMode ? "accent-white" : "accent-black"} />
                                                            <div className="space-y-1">
                                                                <span className="font-bold uppercase tracking-widest text-sm">{t('checkout.wallet')}</span>
                                                                <p className={cn("text-xs", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>{t('checkout.walletNote')}</p>
                                                            </div>
                                                        </div>
                                                        <Wallet className={cn("w-5 h-5", isDarkMode ? "text-zinc-500" : "text-zinc-400")} />
                                                    </label>

                                                    <label className={cn(
                                                        "flex items-center justify-between p-6 rounded-xl border transition-all cursor-pointer",
                                                        paymentMethod === 'instapay'
                                                            ? (isDarkMode ? "bg-white/5 border-white" : "bg-black/5 border-black")
                                                            : (isDarkMode ? "border-white/10 hover:border-white/20" : "border-black/10 hover:border-black/20")
                                                    )}>
                                                        <div className="flex items-center gap-4">
                                                            <input type="radio" name="payment" checked={paymentMethod === 'instapay'} onChange={() => setPaymentMethod('instapay')} className={isDarkMode ? "accent-white" : "accent-black"} />
                                                            <div className="space-y-1">
                                                                <span className="font-bold uppercase tracking-widest text-sm">{t('checkout.instapay')}</span>
                                                                <p className={cn("text-xs", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>{t('checkout.instapayNote')}</p>
                                                            </div>
                                                        </div>
                                                        <Smartphone className={cn("w-5 h-5", isDarkMode ? "text-zinc-500" : "text-zinc-400")} />
                                                    </label>
                                                </div>

                                                {/* Contact Notice instead of Proof Upload */}
                                                {(paymentMethod === 'wallet' || paymentMethod === 'instapay') && (
                                                    <div className={cn(
                                                        "p-8 rounded-2xl border border-dashed space-y-4",
                                                        isDarkMode ? "bg-zinc-900 border-white/20" : "bg-zinc-50 border-black/20"
                                                    )}>
                                                        <div className="flex items-center gap-3 text-vero-gold">
                                                            <Info className="w-5 h-5" />
                                                            <h3 className="text-sm font-bold uppercase">{t('checkout.proofRequired')}</h3>
                                                        </div>
                                                        <p className={cn("text-xs leading-relaxed", isDarkMode ? "text-zinc-400" : "text-zinc-500")}>
                                                            {t('checkout.proofInstructions')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center gap-4 pt-8">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className={cn(
                                            "flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest",
                                            isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-black"
                                        )}
                                    >
                                        <ArrowLeft className="w-4 h-4" /> {t('common.back')}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "flex-1 h-14 font-black uppercase tracking-widest text-sm rounded-full transition-colors disabled:opacity-50",
                                        isDarkMode ? "bg-white text-black hover:bg-vero-gold" : "bg-black text-white hover:bg-vero-gold"
                                    )}
                                >
                                    {isSubmitting ? t('checkout.processing') : (step === 3 ? (hasCustomItems ? t('checkout.submitRequest') : t('checkout.placeOrder')) : t('checkout.continue'))}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Checkout Sidebar (Summary) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-6">
                            <div className={cn(
                                "p-8 rounded-2xl border space-y-6 backdrop-blur-xl",
                                isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white/50 border-black/5"
                            )}>
                                <h3 className="text-sm font-bold uppercase tracking-widest">{t('checkout.orderSummary')}</h3>

                                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className={cn(
                                                "w-16 h-20 rounded overflow-hidden shrink-0 border",
                                                isDarkMode ? "bg-zinc-800 border-white/5" : "bg-zinc-100 border-black/5"
                                            )}>
                                                {item.productId === 'custom-hoodie' ? (
                                                    <CustomHoodieThumbnail
                                                        colorHex={item.colorHex || '#000000'}
                                                        frontImage={item.image}
                                                        backImage={item.backImage}
                                                        designState={item.customDesigns}
                                                        className="h-full w-full"
                                                    />
                                                ) : (
                                                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-xs font-bold uppercase line-clamp-1">{item.title}</h4>
                                                <p className={cn("text-[10px] uppercase", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>{item.size} / {item.color}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className={cn("text-[10px]", isDarkMode ? "text-white" : "text-black")}>Qty: {item.quantity}</span>
                                                    <span className="text-xs font-bold">{formatPrice(item.price * item.quantity, language)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={cn("space-y-4 pt-6 border-t", isDarkMode ? "border-white/5" : "border-black/5")}>
                                    <div className="flex justify-between text-xs">
                                        <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>{t('cart.subtotal')}</span>
                                        <span>{formatPrice(subtotal, language)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>{t('cart.shipping')}</span>
                                        <span className={cn("font-bold", shippingFee === 0 ? "text-vero-gold" : "")}>
                                            {shippingFee === 0 ? t('shipping.standardTitle') : formatPrice(shippingFee, language)}
                                        </span>
                                    </div>
                                    <div className={cn("flex justify-between pt-4 border-t", isDarkMode ? "border-white/10" : "border-black/10")}>
                                        <span className="font-black uppercase italic tracking-widest">{t('cart.total')}</span>
                                        <span className="text-2xl font-black">
                                            {hasCustomItems ? '+' : ''}{formatPrice(total, language)}
                                        </span>
                                    </div>
                                    {hasCustomItems && (
                                        <p className="text-[10px] text-vero-gold font-black uppercase text-right tracking-[0.2em] mt-1">
                                            {t('checkout.customDesignQuotes')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-xl border transition-colors",
                                isDarkMode ? "border-white/5 bg-white/[0.02]" : "border-black/5 bg-black/[0.02]"
                            )}>
                                <ShieldCheck className="w-5 h-5 text-vero-gold" />
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest">{t('checkout.secureCheckout')}</p>
                                    <p className={cn("text-[9px] uppercase", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>{t('checkout.sslEncrypted')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
