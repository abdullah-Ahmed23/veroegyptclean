import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Layers, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useActivityLog } from '@/hooks/useActivityLog';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/lib/store';

interface Category {
    id: string;
    handle: string;
    title_en: string;
    title_ar: string;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({ handle: '', title_en: '', title_ar: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const { logActivity } = useActivityLog();
    const { language } = useUIStore();
    const { t } = useTranslation();

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('title_en');

        if (error) toast.error(error.message);
        else setCategories(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('categories').insert([newCategory]);
        if (error) {
            toast.error(error.message);
        } else {
            logActivity({
                type: 'PRODUCT_UPDATED', // Reuse update for categories or add CATEGORY_CREATED
                description_en: `New category "${newCategory.title_en}" created`,
                description_ar: `تم إنشاء قسم جديد "${newCategory.title_ar}"`,
                metadata: { category_handle: newCategory.handle }
            });
            toast.success('Category added');
            setIsAdding(false);
            setNewCategory({ handle: '', title_en: '', title_ar: '' });
            fetchCategories();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This might affect products in this category.')) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) toast.error(error.message);
        else {
            const cat = categories.find(c => c.id === id);
            logActivity({
                type: 'PRODUCT_DELETED',
                description_en: `Category "${cat?.title_en || id}" was deleted`,
                description_ar: `تم حذف القسم "${cat?.title_ar || id}"`,
                metadata: { category_id: id }
            });
            toast.success('Category deleted');
            fetchCategories();
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-2 uppercase tracking-tight text-white mb-2">{t('admin.categories')}</h1>
                    <p className="text-zinc-500 text-sm">{t('admin.categoriesNote') || 'Manage product categories and groupings.'}</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                    <Plus className="h-4 w-4" />
                    {t('admin.addCategory')}
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-vero-gold" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {isAdding && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-zinc-900 border border-vero-gold/30 p-6 space-y-4"
                            >
                                <h3 className="text-xs font-bold uppercase tracking-widest text-vero-gold">{t('admin.newCategory')}</h3>
                                <form onSubmit={handleAdd} className="space-y-4">
                                    <input
                                        placeholder={t('admin.handlePlaceholder') || 'Handle (e.g. hoodies)'}
                                        required
                                        value={newCategory.handle}
                                        onChange={e => setNewCategory({ ...newCategory, handle: e.target.value })}
                                        className="w-full bg-black border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-white"
                                    />
                                    <input
                                        placeholder={t('admin.titleEn') || 'Title (English)'}
                                        required
                                        value={newCategory.title_en}
                                        onChange={e => setNewCategory({ ...newCategory, title_en: e.target.value })}
                                        className="w-full bg-black border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-white"
                                    />
                                    <input
                                        placeholder={t('admin.titleAr') || 'Title (Arabic)'}
                                        required
                                        value={newCategory.title_ar}
                                        onChange={e => setNewCategory({ ...newCategory, title_ar: e.target.value })}
                                        className="w-full bg-black border border-white/10 px-4 py-2 text-sm text-white text-right focus:outline-none focus:border-white"
                                    />
                                    <div className="flex gap-2 pt-2">
                                        <button type="submit" className="flex-1 bg-white text-black py-2 text-xs font-bold uppercase tracking-widest hover:bg-vero-gold transition-colors">
                                            {t('admin.save')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsAdding(false)}
                                            className="px-4 py-2 border border-white/10 text-white hover:bg-white/5 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {categories.map((cat) => (
                        <motion.div
                            layout
                            key={cat.id}
                            className="bg-zinc-900/50 border border-white/5 p-6 group hover:border-white/20 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-white/5 rounded-sm">
                                    <Layers className="h-5 w-5 text-zinc-400" />
                                </div>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{language === 'ar' ? (cat.title_ar || cat.title_en) : (cat.title_en || cat.title_ar)}</h3>
                            <p className="text-sm text-zinc-500 mb-4 font-ar text-right">{language === 'ar' ? cat.title_en : cat.title_ar}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-[10px] font-mono text-zinc-600 uppercase">/{cat.handle}</span>
                                <span className="text-[10px] font-bold text-vero-gold uppercase tracking-widest">{t('admin.active')}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
