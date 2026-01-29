import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ExternalLink, CheckCircle, Clock, XCircle, Eye, X, User, Phone, Mail, MapPin, Package, ShoppingBag, Palette, Image, SearchX, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Order, formatPrice } from '@/lib/store';
import { cn } from '@/lib/utils';
import { CustomHoodieThumbnail } from '@/components/product/CustomHoodieThumbnail';
import { toast } from 'sonner';
import { useActivityLog } from '@/hooks/useActivityLog';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/lib/store';

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [orderDetails, setOrderDetails] = useState<any | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [uploadingProofId, setUploadingProofId] = useState<string | null>(null);
    const { logActivity } = useActivityLog();
    const { language } = useUIStore();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                setOrders((data || []).map((o: any) => ({
                    id: o.id,
                    createdAt: o.created_at,
                    customerName: o.customer_name,
                    customerEmail: o.customer_email,
                    customerPhone: o.customer_phone,
                    shippingAddress: o.shipping_address,
                    totalAmount: o.total_amount / 100,
                    paymentMethod: o.payment_method,
                    paymentProofUrl: o.payment_proof_url,
                    status: o.status,
                })));
            }
            setLoading(false);
        };

        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            toast.error('Failed to update status');
        } else {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
            if (orderDetails && orderDetails.id === orderId) {
                setOrderDetails({ ...orderDetails, status: newStatus });
            }
            logActivity({
                type: 'STATUS_UPDATED',
                description_en: `Order #${orderId.slice(0, 8)} status updated to ${newStatus}`,
                description_ar: `تم تحديث حالة الطلب #${orderId.slice(0, 8)} إلى ${newStatus}`,
                metadata: { order_id: orderId, status: newStatus }
            });
            toast.success('Status updated');
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this order? This will also delete related items and custom designs.')) return;

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) {
            toast.error('Failed to delete order');
            console.error('Delete error:', error);
        } else {
            setOrders(orders.filter(o => o.id !== orderId));
            if (selectedOrderId === orderId) {
                setSelectedOrderId(null);
            }
            logActivity({
                type: 'ORDER_DELETED',
                description_en: `Order #${orderId.slice(0, 8)} was deleted`,
                description_ar: `تم حذف الطلب #${orderId.slice(0, 8)}`,
                metadata: { order_id: orderId }
            });
            toast.success('Order deleted successfully');
        }
    };

    const handleUploadProof = async (orderId: string, file: File) => {
        setUploadingProofId(orderId);
        try {
            const allowedTypes: Record<string, string> = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp'
            };

            const ext = allowedTypes[file.type];
            if (!ext) {
                toast.error('File type not supported');
                return;
            }

            const fileName = `${self.crypto.randomUUID()}.${ext}`;
            const filePath = `proofs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('payment-proofs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('payment-proofs')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('orders')
                .update({ payment_proof_url: publicUrl })
                .eq('id', orderId);

            if (updateError) throw updateError;

            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, paymentProofUrl: publicUrl } : o));
            if (orderDetails && orderDetails.id === orderId) {
                setOrderDetails({ ...orderDetails, payment_proof_url: publicUrl });
            }

            logActivity({
                type: 'PAYMENT_PROOF_UPLOADED',
                description_en: `Payment proof uploaded for order #${orderId.slice(0, 8)}`,
                description_ar: `تم رفع إثبات الدفع للطلب #${orderId.slice(0, 8)}`,
                metadata: { order_id: orderId, proof_url: publicUrl }
            });

            toast.success('Payment proof uploaded successfully');
        } catch (err: any) {
            console.error('Upload error:', err);
            toast.error(`Upload failed: ${err.message}`);
        } finally {
            setUploadingProofId(null);
        }
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!selectedOrderId) {
                setOrderDetails(null);
                return;
            }

            setLoadingDetails(true);
            try {
                // Fetch basic order info
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', selectedOrderId)
                    .single();

                if (orderError) throw orderError;

                // Fetch order items with product details
                const { data: items, error: itemsError } = await supabase
                    .from('order_items')
                    .select(`
                        *,
                        products (title_en, title_ar, handle, images),
                        product_variants (size, color_en, color_ar, color_hex, sku)
                    `)
                    .eq('order_id', selectedOrderId);

                if (itemsError) throw itemsError;

                // Fetch custom design if it exists (0 or 1 rows expected)
                const { data: customDesign, error: designError } = await supabase
                    .from('custom_designs')
                    .select('*')
                    .eq('order_id', selectedOrderId)
                    .maybeSingle();

                if (designError && designError.code !== 'PGRST116') {
                    console.warn('Non-critical error fetching custom design:', designError);
                }

                setOrderDetails({
                    ...order,
                    items: items || [],
                    customDesign: customDesign || null
                });
            } catch (err: any) {
                console.error('[AdminOrders] Detailed error:', err);
                toast.error(`Failed to load order details: ${err.message || 'Unknown error'}`);
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchOrderDetails();
    }, [selectedOrderId]);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">{t('admin.orders')}</h1>
                <p className="text-zinc-500 text-sm mt-2">{t('admin.manageOrdersNote') || 'View and manage customer orders and payments.'}</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder={t('admin.searchPlaceholder') || 'Search by name or email...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-lg pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:border-white/20"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <SearchX className="w-4 h-4 text-zinc-500" />
                        </button>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                statusFilter === status ? "bg-white text-black" : "bg-zinc-900 text-zinc-500 hover:text-white"
                            )}
                        >
                            {t(`admin.status_${status}`) || status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-zinc-900/50">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-500">{t('admin.orderId')}</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-500">{t('admin.customer')}</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-500">{t('admin.amount')}</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-500">{t('admin.method')}</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-500">{t('admin.status')}</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-500">{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-vero-gold mx-auto" />
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 italic text-sm">
                                    No orders found matching your filters.
                                </td>
                            </tr>
                        ) : filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-zinc-500">#{order.id.slice(0, 8)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">{order.customerName}</p>
                                        <p className="text-[10px] text-zinc-500">{order.customerEmail}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {order.totalAmount === 0 ? (
                                        <span className="px-2 py-1 rounded bg-vero-gold text-black text-[8px] font-black uppercase tracking-widest animate-pulse">{t('admin.quoteRequired')}</span>
                                    ) : (
                                        <span className="text-sm font-black">{formatPrice(order.totalAmount, language)}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase text-zinc-400">{order.paymentMethod}</span>
                                        {order.paymentProofUrl && (
                                            <a
                                                href={order.paymentProofUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1 hover:bg-white/10 rounded flex items-center gap-1 group/proof"
                                                title="View Screenshot"
                                            >
                                                <Image className="w-3 h-3 text-vero-gold group-hover/proof:scale-110 transition-transform" />
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-tighter",
                                        order.status === 'pending' && "bg-amber-500/10 text-amber-500",
                                        order.status === 'confirmed' && "bg-blue-500/10 text-blue-500",
                                        order.status === 'shipped' && "bg-purple-500/10 text-purple-500",
                                        order.status === 'delivered' && "bg-green-500/10 text-green-500",
                                        order.status === 'cancelled' && "bg-red-500/10 text-red-500",
                                        order.status === 'returned' && "bg-zinc-500/10 text-zinc-500"
                                    )}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 whitespace-nowrap">
                                        <button
                                            onClick={() => setSelectedOrderId(order.id)}
                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg text-vero-gold flex items-center gap-2 transition-all active:scale-95 group/view"
                                        >
                                            <Eye className="w-3.5 h-3.5 group-hover/view:scale-110 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('admin.viewDetails')}</span>
                                        </button>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className="bg-zinc-900 border border-white/5 rounded-lg px-2 py-1.5 text-[8px] font-black uppercase tracking-widest focus:outline-none focus:border-vero-gold transition-colors cursor-pointer hover:bg-zinc-800 text-white"
                                        >
                                            <option value="pending" className="text-black">Pending</option>
                                            <option value="confirmed" className="text-black">Confirmed</option>
                                            <option value="shipped" className="text-black">Shipped</option>
                                            <option value="delivered" className="text-black">Delivered</option>
                                            <option value="cancelled" className="text-black">Cancelled</option>
                                            <option value="returned" className="text-black">Returned</option>
                                        </select>
                                        <button
                                            onClick={() => deleteOrder(order.id)}
                                            className="p-1.5 hover:bg-red-500/10 rounded text-zinc-500 hover:text-red-500 transition-colors"
                                            title="Delete Order"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal for Order Details */}
            <AnimatePresence>
                {selectedOrderId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrderId(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                                <div>
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">{t('admin.orderDetails')}</h2>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Ref: #{selectedOrderId.slice(0, 8)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrderId(null)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                {loadingDetails ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-vero-gold" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Loading Order Data...</p>
                                    </div>
                                ) : orderDetails ? (
                                    <>
                                        {/* Customer Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{t('admin.customerProfile')}</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-zinc-400" />
                                                        </div>
                                                        <span className="text-sm font-bold text-white">{orderDetails.customer_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-zinc-400">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <Mail className="w-4 h-4 text-zinc-500" />
                                                        </div>
                                                        <span className="text-xs">{orderDetails.customer_email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-zinc-400">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <Phone className="w-4 h-4 text-zinc-500" />
                                                        </div>
                                                        <span className="text-xs">{orderDetails.customer_phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{t('admin.shippingLogistics')}</h3>
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                        <MapPin className="w-4 h-4 text-zinc-400" />
                                                    </div>
                                                    <span className="text-xs text-zinc-400 leading-relaxed">{orderDetails.shipping_address}</span>
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                        <ShoppingBag className="w-4 h-4 text-zinc-400" />
                                                    </div>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                        orderDetails.status === 'pending' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                                        orderDetails.status === 'confirmed' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                                        orderDetails.status === 'shipped' && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                                                        orderDetails.status === 'delivered' && "bg-green-500/10 text-green-500 border-green-500/20",
                                                        orderDetails.status === 'cancelled' && "bg-red-500/10 text-red-500 border-red-500/20",
                                                        orderDetails.status === 'returned' && "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                                    )}>
                                                        {orderDetails.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="space-y-4 pt-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5 pb-4">{t('admin.orderItems')}</h3>
                                            <div className="space-y-3">
                                                {(orderDetails.items || []).map((item: any) => (
                                                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-16 bg-black border border-white/10 flex items-center justify-center text-zinc-800 group-hover:text-vero-gold transition-colors overflow-hidden rounded-lg">
                                                                {item.products?.handle === 'custom-hoodie' && orderDetails.customDesign ? (
                                                                    <div className="p-1 scale-[2] transform origin-center">
                                                                        <CustomHoodieThumbnail
                                                                            colorHex={orderDetails.customDesign.base_color}
                                                                            designState={orderDetails.customDesign.design_state}
                                                                            className="w-full h-full"
                                                                        />
                                                                    </div>
                                                                ) : item.products?.images?.[0] ? (
                                                                    <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Package className="w-6 h-6" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black uppercase tracking-tight text-white mb-1">{language === 'ar' ? (item.products?.title_ar || item.products?.title_en) : (item.products?.title_en || item.products?.title_ar) || 'Unknown Product'}</p>
                                                                <div className="flex flex-col gap-1.5">
                                                                    <div className="flex items-center gap-2">
                                                                        {item.product_variants ? (
                                                                            <>
                                                                                <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                                                                    {item.product_variants.size} / {language === 'ar' ? item.product_variants.color_ar : item.product_variants.color_en}
                                                                                </span>
                                                                                {item.product_variants.sku && (
                                                                                    <span className="text-[8px] text-zinc-600 font-mono tracking-tighter">
                                                                                        {item.product_variants.sku}
                                                                                    </span>
                                                                                )}
                                                                            </>
                                                                        ) : item.products?.handle === 'custom-hoodie' && orderDetails.customDesign && (
                                                                            <div className="flex items-center gap-2 bg-vero-gold/5 px-1.5 py-0.5 rounded border border-vero-gold/10">
                                                                                <span className="text-[8px] text-vero-gold font-black uppercase tracking-widest">Base Color:</span>
                                                                                <div
                                                                                    className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
                                                                                    style={{ backgroundColor: orderDetails.customDesign.base_color }}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Qty: {item.quantity}</p>
                                                                    </div>
                                                                    <p className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">Unit: {formatPrice(item.price_at_purchase / 100, language)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-black text-white">{formatPrice((item.price_at_purchase * item.quantity) / 100, language)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment & Action Footer within Modal */}
                                        <div className="p-6 bg-vero-gold/5 border border-vero-gold/10 rounded-[1.5rem] flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-vero-gold/10 rounded-xl">
                                                    <Palette className="w-6 h-6 text-vero-gold" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-vero-gold/60 tracking-widest">{t('admin.interactiveSpec')}</p>
                                                    <p className="text-xs text-white font-bold opacity-80">{t('admin.specReady') || 'Design specifications are ready'}</p>
                                                </div>
                                            </div>
                                            {orderDetails.customDesign ? (
                                                <a
                                                    href={`/admin/custom-designs/${orderDetails.customDesign.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-6 py-3 bg-vero-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all flex items-center gap-2"
                                                >
                                                    {t('admin.openBlueprint')} <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            ) : (
                                                <span className="text-[9px] font-bold uppercase text-zinc-600 tracking-widest italic">Standard Product</span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-20 text-center text-zinc-500 italic">Could not load data.</div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            {orderDetails && (
                                <div className="p-8 border-t border-white/5 bg-zinc-900/30 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">{t('admin.totalAmount')}</p>
                                        {orderDetails.total_amount === 0 ? (
                                            <span className="inline-block px-3 py-1 bg-vero-gold text-black text-[9px] font-black uppercase tracking-widest rounded-full">{t('admin.quotationPending')}</span>
                                        ) : (
                                            <p className="text-2xl font-black text-white italic">{formatPrice(orderDetails.total_amount / 100, language)}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        {orderDetails.status === 'confirmed' && !orderDetails.payment_proof_url && (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="proof-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleUploadProof(orderDetails.id, file);
                                                    }}
                                                />
                                                <label
                                                    htmlFor="proof-upload"
                                                    className={cn(
                                                        "px-4 py-2 bg-vero-gold/10 hover:bg-vero-gold text-vero-gold hover:text-black border border-vero-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2",
                                                        uploadingProofId === orderDetails.id && "opacity-50 pointer-events-none"
                                                    )}
                                                >
                                                    {uploadingProofId === orderDetails.id ? (
                                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Upload className="w-3 h-3" />
                                                    )}
                                                    {t('admin.uploadProof')}
                                                </label>
                                            </div>
                                        )}
                                        {orderDetails.payment_proof_url && (
                                            <a
                                                href={orderDetails.payment_proof_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2.5 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/20 rounded-full text-blue-500 hover:text-white transition-all group/proof"
                                                title="View Proof"
                                            >
                                                <Image className="w-5 h-5 group-hover/proof:scale-110 transition-transform" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => deleteOrder(orderDetails.id)}
                                            className="p-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full text-red-500 hover:text-white transition-all group/delete"
                                            title="Delete Order"
                                        >
                                            <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
                                        </button>
                                        <select
                                            value={orderDetails.status}
                                            onChange={(e) => updateOrderStatus(orderDetails.id, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vero-gold transition-colors text-white"
                                        >
                                            <option value="pending" className="text-black">Pending</option>
                                            <option value="confirmed" className="text-black">Confirmed</option>
                                            <option value="shipped" className="text-black">Shipped</option>
                                            <option value="delivered" className="text-black">Delivered</option>
                                            <option value="cancelled" className="text-black">Cancelled</option>
                                            <option value="returned" className="text-black">Returned</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
