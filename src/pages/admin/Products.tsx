import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit2,
    Search,
    Image as ImageIcon,
    Upload,
    Loader2,
    X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/store';
import { useActivityLog } from '@/hooks/useActivityLog';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/lib/store';

interface Variant {
    id?: string;
    sku: string;
    size: string;
    color_en: string;
    color_ar: string;
    color_hex: string;
    price: number;
    cost_price: number;
    stock_quantity: number;
    image_url?: string;
    product_id?: string;
}

interface Product {
    id: string;
    handle: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    category_id: string;
    collection_id: string;
    images: string[];
    tags: string[];
    is_new: boolean;
    is_published: boolean;
    product_variants: Variant[];
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const { logActivity } = useActivityLog();
    const { language } = useUIStore();
    const { t } = useTranslation();

    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .replace(/[\s_]+/g, '-')     // Replace spaces/underscores with -
            .replace(/^-+|-+$/g, '');    // Trim - from ends
    };

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes, colRes] = await Promise.all([
                supabase.from('products').select('*, product_variants(*)').order('created_at', { ascending: false }),
                supabase.from('categories').select('*'),
                supabase.from('collections').select('*')
            ]);

            if (prodRes.error) throw prodRes.error;
            setProducts(prodRes.data || []);
            setCategories(catRes.data || []);
            setCollections(colRes.data || []);
        } catch (error: any) {
            toast.error('Failed to load data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Auto-generate handle from Title EN if empty
    useEffect(() => {
        if (isFormOpen && !editingProduct?.id && editingProduct?.title_en && !editingProduct?.handle) {
            setEditingProduct(prev => ({
                ...prev,
                handle: slugify(editingProduct.title_en || '')
            }));
        }
    }, [editingProduct?.title_en]);

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        toast.loading('Uploading photo...');
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            toast.dismiss();
            toast.error('Upload failed: ' + uploadError.message);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        setEditingProduct(prev => ({
            ...prev,
            images: [...(prev?.images || []), publicUrl]
        }));
        toast.dismiss();
        toast.success('Photo uploaded');
    };

    const handleUploadVariantImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `variants/${fileName}`;

        toast.loading('Uploading variant photo...');
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            toast.dismiss();
            toast.error('Upload failed: ' + uploadError.message);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        updateVariant(index, 'image_url', publicUrl);
        toast.dismiss();
        toast.success('Variant photo uploaded');
    };

    const handleDelete = async (id: string) => {
        const product = products.find(p => p.id === id);
        if (!confirm('This product and its variants will be permanently deleted. Continue?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) toast.error(error.message);
        else {
            logActivity({
                type: 'PRODUCT_DELETED',
                description_en: `Product "${product?.title_en || id}" was deleted`,
                description_ar: `تم حذف المنتج "${product?.title_ar || id}"`,
                metadata: { product_id: id }
            });
            toast.success('Product removed');
            fetchInitialData();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);

        try {
            const productData = {
                handle: slugify(editingProduct?.handle || ''),
                title_en: editingProduct?.title_en?.trim(),
                title_ar: editingProduct?.title_ar?.trim(),
                description_en: editingProduct?.description_en?.trim(),
                description_ar: editingProduct?.description_ar?.trim() || '',
                category_id: editingProduct?.category_id || null,
                collection_id: editingProduct?.collection_id || null,
                images: editingProduct?.images || [],
                tags: editingProduct?.tags || [],
                is_new: editingProduct?.is_new || false,
                is_published: editingProduct?.is_published ?? true,
            };

            console.log('Saving product data:', productData);

            let prodId = editingProduct?.id;
            let productRes;

            if (prodId) {
                productRes = await supabase.from('products').update(productData).eq('id', prodId).select();
            } else {
                productRes = await supabase.from('products').insert([productData]).select();
            }

            if (productRes.error) throw productRes.error;
            if (!prodId && productRes.data?.[0]) prodId = productRes.data[0].id;

            if (!prodId) throw new Error("Failed to retrieve product ID after save");

            // Handle Variants Sync
            if (editingProduct?.product_variants) {
                // 1. Get current variants from DB to identify deletions
                const { data: existingVariants } = await supabase
                    .from('product_variants')
                    .select('id')
                    .eq('product_id', prodId);

                const existingIds = existingVariants?.map(v => v.id) || [];
                const updatedIds = editingProduct.product_variants.map(v => v.id).filter(Boolean);
                const idsToDelete = existingIds.filter(id => !updatedIds.includes(id));

                // 2. Delete removed variants
                if (idsToDelete.length > 0) {
                    await supabase.from('product_variants').delete().in('id', idsToDelete);
                }

                // 3. Upsert current variants
                const variantsToSave = editingProduct.product_variants.map(v => {
                    const variantData: any = {
                        product_id: prodId,
                        sku: v.sku,
                        size: v.size,
                        color_en: v.color_en,
                        color_ar: v.color_ar,
                        color_hex: v.color_hex,
                        price: Math.round(Number(v.price) * 100),
                        cost_price: Math.round(Number(v.cost_price || 0) * 100),
                        stock_quantity: Number(v.stock_quantity),
                        image_url: v.image_url
                    };
                    if (v.id) variantData.id = v.id;
                    return variantData;
                });

                // 3. Save variants: Split between Update (Upsert) and Create (Insert)
                const variantsToUpdate = variantsToSave.filter(v => v.id);
                const variantsToInsert = variantsToSave.filter(v => !v.id);

                if (variantsToUpdate.length > 0) {
                    const { error: updateError } = await supabase.from('product_variants').upsert(variantsToUpdate);
                    if (updateError) throw updateError;
                }

                if (variantsToInsert.length > 0) {
                    const { error: insertError } = await supabase.from('product_variants').insert(variantsToInsert);
                    if (insertError) throw insertError;
                }
            }

            const isNewProduct = !editingProduct.id;
            logActivity({
                type: isNewProduct ? 'PRODUCT_CREATED' : 'PRODUCT_UPDATED',
                description_en: isNewProduct
                    ? `New product "${editingProduct.title_en}" created`
                    : `Product "${editingProduct.title_en}" was updated`,
                description_ar: isNewProduct
                    ? `تم إنشاء منتج جديد "${editingProduct.title_ar}"`
                    : `تم تحديث المنتج "${editingProduct.title_ar}"`,
                metadata: { product_handle: editingProduct.handle }
            });

            toast.success('Product saved successfully');
            setIsFormOpen(false);
            fetchInitialData();
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error.message || 'Failed to save product');
        } finally {
            setSaveLoading(false);
        }
    };

    const addVariant = () => {
        const newVariant: Variant = {
            sku: `${editingProduct?.handle?.toUpperCase() || 'SKU'}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            size: 'M',
            color_en: 'Black',
            color_ar: 'أسود',
            color_hex: '#000000',
            price: 0,
            cost_price: 0,
            stock_quantity: 0,
            image_url: ''
        };
        setEditingProduct(prev => ({
            ...prev,
            product_variants: [...(prev?.product_variants || []), newVariant]
        }));
    };

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        setEditingProduct(prev => {
            const newVariants = [...(prev?.product_variants || [])];
            newVariants[index] = { ...newVariants[index], [field]: value };
            return { ...prev, product_variants: newVariants };
        });
    };

    const removeVariant = (index: number) => {
        setEditingProduct(prev => ({
            ...prev,
            product_variants: prev?.product_variants?.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-2 uppercase tracking-tight text-white mb-2">{t('admin.inventory')}</h1>
                    <p className="text-zinc-500 text-sm">{t('admin.inventoryNote') || 'Control stocks, prices, and visual assets.'}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProduct({ images: [], tags: [], is_new: true, is_published: true, product_variants: [] });
                        setIsFormOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                    <Plus className="h-4 w-4" />
                    {t('admin.addProduct')}
                </button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                        placeholder={t('admin.searchPlaceholderProducts') || 'Search SKUs, titles, or categories...'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
                    />
                </div>
            </div>

            {loading && products.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-vero-gold" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                                <th className="py-4 px-4">{t('admin.product')}</th>
                                <th className="py-4 px-4">{t('admin.stock')}</th>
                                <th className="py-4 px-4">{t('admin.price')}</th>
                                <th className="py-4 px-4">{t('admin.margin')}</th>
                                <th className="py-4 px-4">{t('admin.category')}</th>
                                <th className="py-4 px-4">{t('admin.status')}</th>
                                <th className="py-4 px-4 text-right">{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.filter(p => p.title_en.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-zinc-800 rounded-sm overflow-hidden flex-shrink-0">
                                                {product.images[0] ? (
                                                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-full h-full p-3 text-zinc-700" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{language === 'ar' ? (product.title_ar || product.title_en) : (product.title_en || product.title_ar)}</h4>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">/{product.handle}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={cn(
                                            "text-xs font-medium",
                                            product.product_variants.reduce((acc, v) => acc + v.stock_quantity, 0) > 0 ? "text-white" : "text-red-500"
                                        )}>
                                            {product.product_variants.reduce((acc, v) => acc + v.stock_quantity, 0)} {t('admin.units')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-xs text-zinc-400">
                                            {formatPrice(product.product_variants[0]?.price / 100 || 0, language)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {product.product_variants[0]?.cost_price > 0 ? (
                                            <span className="text-[10px] font-bold text-green-500">
                                                {(((product.product_variants[0].price - product.product_variants[0].cost_price) / product.product_variants[0].price) * 100).toFixed(0)}%
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-zinc-600">--</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded-sm text-zinc-400 border border-white/10 uppercase tracking-widest">
                                            {categories.find(c => c.id === product.category_id)?.handle || 'Standard'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col gap-1">
                                            {product.is_published ? (
                                                <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t('admin.published')}</span>
                                            ) : (
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{t('admin.draft')}</span>
                                            )}
                                            {product.is_new && (
                                                <span className="text-[10px] text-vero-gold font-bold uppercase tracking-widest">{t('product.newArrival')}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingProduct({
                                                    ...product,
                                                    product_variants: product.product_variants.map(v => ({
                                                        ...v,
                                                        price: v.price / 100,
                                                        cost_price: (v.cost_price || 0) / 100
                                                    }))
                                                });
                                                setIsFormOpen(true);
                                            }}
                                            className="p-2 text-zinc-500 hover:text-white transition-colors"
                                            title={t('admin.editProduct')}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <a
                                            href={`/product/${product.handle}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block p-2 text-zinc-500 hover:text-vero-gold transition-colors"
                                            title={t('admin.viewOnStore')}
                                        >
                                            <Search className="h-4 w-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                            title={t('admin.delete')}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-tight">
                                    {editingProduct?.id ? t('admin.editProduct') : t('admin.addProduct')}
                                </h2>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.visualAssets')}</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {editingProduct?.images?.map((img, i) => (
                                                    <div key={i} className="aspect-[3/4] bg-zinc-800 relative group">
                                                        <img src={img} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingProduct(prev => ({
                                                                ...prev,
                                                                images: prev?.images?.filter((_, idx) => idx !== i)
                                                            }))}
                                                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className="aspect-[3/4] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all">
                                                    <Upload className="h-6 w-6 text-zinc-500" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.uploadPhoto')}</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.configuration')}</label>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4 py-4 px-4 bg-zinc-800/50 border border-white/5">
                                                    <input
                                                        type="checkbox"
                                                        id="is_published"
                                                        checked={editingProduct?.is_published ?? true}
                                                        onChange={e => setEditingProduct({ ...editingProduct, is_published: e.target.checked })}
                                                        className="w-5 h-5 rounded-none accent-vero-gold bg-black border-white/10"
                                                    />
                                                    <label htmlFor="is_published" className="text-sm font-medium">{t('admin.publishToStore')}</label>
                                                </div>
                                                <div className="flex items-center gap-4 py-4 px-4 bg-zinc-800/50 border border-white/5">
                                                    <input
                                                        type="checkbox"
                                                        id="is_new"
                                                        checked={editingProduct?.is_new}
                                                        onChange={e => setEditingProduct({ ...editingProduct, is_new: e.target.checked })}
                                                        className="w-5 h-5 rounded-none accent-vero-gold bg-black border-white/10"
                                                    />
                                                    <label htmlFor="is_new" className="text-sm font-medium">{t('admin.markAsNew')}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.handle')}</label>
                                            <input
                                                required
                                                placeholder="e.g. cloud-heavyweight-hoodie"
                                                value={editingProduct?.handle}
                                                onChange={e => setEditingProduct({ ...editingProduct, handle: slugify(e.target.value) })}
                                                className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-vero-gold transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.titleEn')}</label>
                                                <input
                                                    required
                                                    value={editingProduct?.title_en}
                                                    onChange={e => setEditingProduct({ ...editingProduct, title_en: e.target.value })}
                                                    className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.titleAr')}</label>
                                                <input
                                                    required
                                                    value={editingProduct?.title_ar}
                                                    onChange={e => setEditingProduct({ ...editingProduct, title_ar: e.target.value })}
                                                    className="w-full bg-black border border-white/10 p-3 text-sm text-right font-ar focus:outline-none focus:border-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.descriptionEn')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={editingProduct?.description_en}
                                                    onChange={e => setEditingProduct({ ...editingProduct, description_en: e.target.value })}
                                                    className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white resize-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.descriptionAr')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={editingProduct?.description_ar}
                                                    onChange={e => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                                                    className="w-full bg-black border border-white/10 p-3 text-sm text-right font-ar focus:outline-none focus:border-white resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.category')}</label>
                                                <select
                                                    required
                                                    value={editingProduct?.category_id}
                                                    onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                                                    className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white appearance-none"
                                                >
                                                    <option value="">{t('admin.selectCategory')}</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{language === 'ar' ? (c.title_ar || c.title_en) : (c.title_en || c.title_ar)}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t('admin.collection')}</label>
                                                <select
                                                    required
                                                    value={editingProduct?.collection_id}
                                                    onChange={e => setEditingProduct({ ...editingProduct, collection_id: e.target.value })}
                                                    className="w-full bg-black border border-white/10 p-3 text-sm focus:outline-none focus:border-white appearance-none"
                                                >
                                                    <option value="">{t('admin.selectCollection')}</option>
                                                    {collections.map(c => <option key={c.id} value={c.id}>{language === 'ar' ? (c.title_ar || c.title_en) : (c.title_en || c.title_ar)}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-16 space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">{t('admin.inventoryVariants')}</h3>
                                        <button
                                            type="button"
                                            onClick={addVariant}
                                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-vero-gold hover:text-white transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                            {t('admin.addVariant')}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {editingProduct?.product_variants?.length === 0 && (
                                            <p className="text-zinc-500 text-xs italic text-center py-8 bg-black/20 border border-white/5">{t('admin.noVariants')}</p>
                                        )}
                                        {editingProduct?.product_variants?.map((variant, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={index}
                                                className="bg-black/40 border border-white/5 p-6 relative group/variant"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-600 uppercase">SKU</label>
                                                        <input
                                                            value={variant.sku}
                                                            onChange={e => updateVariant(index, 'sku', e.target.value)}
                                                            className="w-full bg-transparent border-b border-white/10 py-1 text-xs focus:outline-none focus:border-vero-gold"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-600 uppercase">Size</label>
                                                        <input
                                                            value={variant.size}
                                                            onChange={e => updateVariant(index, 'size', e.target.value)}
                                                            className="w-full bg-transparent border-b border-white/10 py-1 text-xs focus:outline-none focus:border-white"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-600 uppercase">Color (EN)</label>
                                                        <input
                                                            value={variant.color_en}
                                                            onChange={e => updateVariant(index, 'color_en', e.target.value)}
                                                            className="w-full bg-transparent border-b border-white/10 py-1 text-xs focus:outline-none focus:border-white"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-600 uppercase">Hex</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={variant.color_hex} onChange={e => updateVariant(index, 'color_hex', e.target.value)} className="w-4 h-4 rounded-full bg-transparent border-none cursor-pointer" />
                                                            <input
                                                                value={variant.color_hex}
                                                                onChange={e => updateVariant(index, 'color_hex', e.target.value)}
                                                                className="w-full bg-transparent border-b border-white/10 py-1 text-xs font-mono uppercase focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-600 uppercase">Price (EGP)</label>
                                                        <input
                                                            type="number"
                                                            value={variant.price}
                                                            onChange={e => updateVariant(index, 'price', parseFloat(e.target.value))}
                                                            className="w-full bg-transparent border-b border-white/10 py-1 text-xs text-vero-gold font-bold focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-600 uppercase">Cost (EGP)</label>
                                                        <input
                                                            type="number"
                                                            value={variant.cost_price}
                                                            onChange={e => updateVariant(index, 'cost_price', parseFloat(e.target.value))}
                                                            className="w-full bg-transparent border-b border-white/10 py-1 text-xs text-zinc-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-zinc-600 uppercase">Quantity</label>
                                                        <input
                                                            type="number"
                                                            value={variant.stock_quantity}
                                                            onChange={e => updateVariant(index, 'stock_quantity', parseInt(e.target.value))}
                                                            className="w-full bg-transparent border-b border-white/10 py-1 text-xs focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-bold text-zinc-600 uppercase">Image</label>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-16 bg-zinc-800 border border-white/5 rounded-sm overflow-hidden flex-shrink-0 relative group">
                                                                {variant.image_url ? (
                                                                    <>
                                                                        <img src={variant.image_url} alt="" className="w-full h-full object-cover" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => updateVariant(index, 'image_url', '')}
                                                                            className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <Trash2 className="h-3 w-3 text-white" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <ImageIcon className="w-full h-full p-3 text-zinc-700" />
                                                                )}
                                                            </div>
                                                            {!variant.image_url && (
                                                                <label className="flex-1 px-4 py-2 bg-white/5 border border-dashed border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-white/10 hover:border-white/20 transition-all text-center cursor-pointer">
                                                                    {t('admin.uploadPhoto')}
                                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUploadVariantImage(index, e)} />
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover/variant:opacity-100 transition-all rounded-sm"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-16 pt-8 border-t border-white/5 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                                    >
                                        {t('admin.discard')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saveLoading}
                                        className="bg-white text-black px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-vero-gold transition-all"
                                    >
                                        {saveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('admin.globalUpdate')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
