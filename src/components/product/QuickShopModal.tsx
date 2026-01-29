import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore, useUIStore, formatPrice } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface QuickShopModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

export function QuickShopModal({ product, isOpen, onClose }: QuickShopModalProps) {
    const { t } = useTranslation();
    const { language } = useUIStore();
    const { addItem, setIsOpen: openCart } = useCartStore();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Auto-select first available variant
    useEffect(() => {
        if (isOpen && product?.variants?.length > 0) {
            // Find first available variant, or just the first one if all out of stock
            const defaultVariant = product.variants.find((v: any) => v.available) || product.variants[0];
            if (defaultVariant) {
                setSelectedSize(defaultVariant.size);
                setSelectedColor(defaultVariant.color);
            }
        } else if (!isOpen) {
            // Reset quantity when closed
            setQuantity(1);
        }
    }, [isOpen, product, language]); // Added language to re-select translated strings

    const uniqueColors = useMemo(() => {
        if (!product) return [];
        const colors = new Set(product.variants.map((v: any) => v.color));
        return Array.from(colors);
    }, [product]);

    const uniqueSizes = useMemo(() => {
        if (!product) return [];
        const sizes = new Set(product.variants.map((v: any) => v.size));
        return Array.from(sizes);
    }, [product]);

    const selectedVariant = useMemo(() => {
        if (!product || !selectedSize || !selectedColor) return null;
        return product.variants.find((v: any) => v.size === selectedSize && v.color === selectedColor);
    }, [product, selectedSize, selectedColor]);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error(language === 'ar' ? 'يرجى اختيار اللون والمقاس' : 'Please select color and size');
            return;
        }

        if (!selectedVariant) {
            toast.error(language === 'ar' ? 'هذا المزيج غير متوفر' : 'This combination is unavailable');
            return;
        }

        // Check if cart has custom items
        const hasCustomItems = useCartStore.getState().items.some(i => i.price === 0);
        if (hasCustomItems) {
            toast.error(t('cart.clearCustomFirst'));
            return;
        }

        addItem({
            productId: product.id,
            variantId: selectedVariant.id,
            title: language === 'ar' ? (product.title_ar || product.title_en) : (product.title_en || product.title_ar),
            image: selectedVariant.image_url || product.images[0] || '/placeholder.svg',
            size: selectedVariant.size,
            color: selectedVariant.color,
            price: selectedVariant.price,
            quantity,
            colorHex: selectedVariant.colorHex,
            stock: selectedVariant.stock
        });

        onClose();
        openCart(true);
    };

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[210] pointer-events-none">
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-zinc-950 border-t sm:border border-white/10 rounded-t-[2rem] sm:rounded-2xl overflow-hidden shadow-2xl pointer-events-auto relative max-h-[90vh] sm:max-h-[85vh] flex flex-col"
                        >
                            {/* Draggable Handle for Mobile */}
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-3 sm:hidden" />

                            <div className="flex flex-col md:flex-row overflow-y-auto">
                                {/* Product Image */}
                                <div className="w-full md:w-2/5 aspect-[4/5] bg-zinc-900">
                                    <img
                                        src={selectedVariant?.image_url || product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 p-5 sm:p-8 space-y-5 sm:space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{t('common.quickAdd')}</h3>
                                            <h2 className="text-xl sm:text-2xl font-black uppercase italic text-white leading-tight">{language === 'ar' ? (product.title_ar || product.title_en) : (product.title_en || product.title_ar)}</h2>
                                            <p className="text-lg font-black text-[#49d77e] mt-1">
                                                {formatPrice(selectedVariant?.price || product.variants[0].price, language)}
                                            </p>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClose();
                                            }}
                                            className="p-2 hover:bg-white/10 rounded-full transition-colors bg-white/5"
                                        >
                                            <X className="w-5 h-5 text-white" />
                                        </button>
                                    </div>

                                    {/* Color selection */}
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">
                                            {t('product.selectColor')}: <span className="text-white">{selectedColor || '—'}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {uniqueColors.map((color: any) => {
                                                const variant = product.variants.find((v: any) => v.color === color);
                                                return (
                                                    <button
                                                        key={color}
                                                        onClick={() => {
                                                            setSelectedColor(color);
                                                            // Auto-switch to an available size if current size doesn't exist for this color
                                                            const hasCurrentSize = product.variants.some((v: any) => v.color === color && v.size === selectedSize && v.available);
                                                            if (!hasCurrentSize) {
                                                                const firstAvailableForColor = product.variants.find((v: any) => v.color === color && v.available);
                                                                if (firstAvailableForColor) {
                                                                    setSelectedSize(firstAvailableForColor.size);
                                                                }
                                                            }
                                                        }}
                                                        className={cn(
                                                            "w-8 h-8 rounded-full border-2 transition-all p-0.5",
                                                            selectedColor === color ? "border-white scale-110" : "border-transparent hover:border-white/30"
                                                        )}
                                                    >
                                                        <div
                                                            className="w-full h-full rounded-full"
                                                            style={{ backgroundColor: variant?.colorHex }}
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Size selection */}
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">
                                            {t('product.selectSize')}: <span className="text-white">{selectedSize || '—'}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {uniqueSizes.map((size: any) => {
                                                const variant = product.variants.find(
                                                    (v: any) => v.size === size && (selectedColor ? v.color === selectedColor : true)
                                                );
                                                // Size is available only if variant exists AND is available
                                                const isAvailable = !!variant && variant.available;

                                                return (
                                                    <button
                                                        key={size}
                                                        onClick={() => isAvailable && setSelectedSize(size)}
                                                        disabled={!isAvailable}
                                                        className={cn(
                                                            "min-w-[44px] h-10 border text-xs font-bold transition-all uppercase px-2",
                                                            selectedSize === size
                                                                ? "bg-white text-black border-white"
                                                                : isAvailable
                                                                    ? "bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20"
                                                                    : "opacity-20 cursor-not-allowed line-through border-transparent flex items-center justify-center"
                                                        )}
                                                    >
                                                        {size}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Quantity and Add to Cart */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center bg-zinc-900 border border-white/5 rounded-lg">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="p-2 hover:text-white transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-4 text-xs font-black min-w-[40px] text-center">{quantity}</span>
                                                <button
                                                    onClick={() => {
                                                        if (selectedVariant && quantity < selectedVariant.stock) {
                                                            setQuantity(q => q + 1);
                                                        } else if (selectedVariant) {
                                                            toast.error(language === 'ar' ? `الكمية القصوى هي ${selectedVariant.stock}` : `Max quantity is ${selectedVariant.stock}`);
                                                        }
                                                    }}
                                                    disabled={selectedVariant && quantity >= selectedVariant.stock}
                                                    className={cn(
                                                        "p-2 hover:text-white transition-colors",
                                                        selectedVariant && quantity >= selectedVariant.stock && "opacity-20 cursor-not-allowed"
                                                    )}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
                                            <p className="text-[10px] text-vero-gold font-bold uppercase text-right">
                                                {language === 'ar' ? `بقي قطعتين فقط!` : `Only ${selectedVariant.stock} left!`}
                                            </p>
                                        )}

                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full bg-white text-black py-4 sm:py-5 rounded-xl font-black uppercase text-xs sm:text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-[#49d77e] hover:text-white transition-all active:scale-95 duration-200"
                                        >
                                            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                            {t('product.addToCart')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
