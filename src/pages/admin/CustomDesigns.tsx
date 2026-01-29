import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Palette, ExternalLink, User, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CustomHoodieThumbnail } from '@/components/product/CustomHoodieThumbnail';

export default function AdminCustomDesigns() {
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDesigns = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('custom_designs')
                .select(`
          *,
          orders (id, customer_name, customer_email, status)
        `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching designs:', error);
            } else {
                setDesigns(data || []);
            }
            setLoading(false);
        };

        fetchDesigns();
    }, []);

    const deleteDesign = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Are you sure you want to PERMANENTLY delete this custom design?')) return;

        const { error } = await supabase
            .from('custom_designs')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Failed to delete design');
        } else {
            setDesigns(designs.filter(d => d.id !== id));
            toast.success('Design deleted successfully');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">Custom Requests</h1>
                    <p className="text-zinc-500 text-sm mt-2 font-medium">Manage and review production-ready designs in a separate window.</p>
                </div>
                <div className="p-3 bg-vero-gold/10 rounded-full">
                    <Palette className="w-8 h-8 text-vero-gold" />
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-vero-gold mx-auto" />
                </div>
            ) : designs.length === 0 ? (
                <div className="py-20 text-center bg-zinc-900/20 border border-white/5 rounded-2xl">
                    <p className="text-zinc-500 italic font-medium">No custom requests yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {designs.map((design: any) => (
                        <Link
                            key={design.id}
                            to={`/admin/custom-designs/${design.id}`}
                            target="_blank"
                            className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-vero-gold/50 hover:bg-zinc-900/60 transition-all cursor-pointer group flex flex-col shadow-2xl"
                        >
                            {/* Visual Preview */}
                            <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center border-b border-white/5">
                                <CustomHoodieThumbnail
                                    colorHex={design.base_color}
                                    designState={design.design_state}
                                    className="scale-90 group-hover:scale-95 transition-transform duration-700"
                                />

                                <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ backgroundColor: design.base_color }} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{design.base_color}</span>
                                </div>

                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => deleteDesign(e, design.id)}
                                        className="bg-red-500 p-2.5 rounded-xl shadow-2xl hover:bg-red-600 transition-colors"
                                        title="Delete Design"
                                    >
                                        <Trash2 className="w-4 h-4 text-white" />
                                    </button>
                                    <div className="bg-vero-gold p-2.5 rounded-xl shadow-2xl">
                                        <ExternalLink className="w-4 h-4 text-black" />
                                    </div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-8 pt-24">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-vero-gold">Production Layer</span>
                                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                            <span className="text-[9px] font-black uppercase text-white/40">Layers:</span>
                                            <span className="text-[9px] font-black uppercase text-white">{design.design_state?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 tracking-widest">
                                        <ShoppingBag className="w-3.5 h-3.5" /> Order #{design.orders?.id?.slice(0, 8) || 'DRAFT'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase text-vero-gold bg-vero-gold/10 px-3 py-1 rounded-full border border-vero-gold/20">
                                            Size {design.size}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-vero-gold/10 group-hover:border-vero-gold/20 transition-all">
                                            <User className="w-5 h-5 text-zinc-500 group-hover:text-vero-gold" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase italic tracking-tighter truncate max-w-[140px]">{design.orders?.customer_name || 'Generic Sample'}</p>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                                                {new Date(design.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:translate-x-1 transition-all">
                                        <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-vero-gold" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
