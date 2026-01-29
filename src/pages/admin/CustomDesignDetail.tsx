import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Download, ExternalLink, Calendar, User, ShoppingBag, ArrowLeft, Printer, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CustomHoodieThumbnail } from '@/components/product/CustomHoodieThumbnail';

export default function CustomDesignDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [design, setDesign] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [detailSide, setDetailSide] = useState<'front' | 'back'>('front');

    useEffect(() => {
        const fetchDesign = async () => {
            if (!id) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('custom_designs')
                .select(`
                    *,
                    orders (id, customer_name, customer_email, status, created_at)
                `)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching design:', error);
                toast.error('Could not load design details');
                navigate('/admin/custom-designs');
            } else {
                setDesign(data);
            }
            setLoading(false);
        };

        fetchDesign();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        if (!confirm('Are you sure you want to PERMANENTLY delete this custom design? This cannot be undone.')) return;

        const { error } = await supabase
            .from('custom_designs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting design:', error);
            toast.error('Failed to delete design');
        } else {
            toast.success('Design deleted successfully');
            navigate('/admin/custom-designs');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-vero-gold" />
            </div>
        );
    }

    if (!design) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/custom-designs')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Design Specification</h1>
                        <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">
                            Ref: {design.id.slice(0, 8)} • Order #{design.orders?.id?.slice(0, 8) || 'DRAFT'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-white/5"
                    >
                        <Printer className="w-4 h-4" /> Print Specs
                    </button>
                    <div className="p-3 bg-vero-gold/10 rounded-full">
                        <Palette className="w-8 h-8 text-vero-gold" />
                    </div>
                </div>
            </div>

            {/* Desktop/Tablet View (Hidden on Print) */}
            <div className="print:hidden space-y-8">
                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[70vh]">
                    {/* Visual Preview Section (8 cols) */}
                    <div className="lg:col-span-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] relative flex items-center justify-center p-8 md:p-12 overflow-hidden">
                        {/* Side Toggles */}
                        <div className="absolute top-8 left-8 flex gap-2 bg-zinc-950/50 backdrop-blur-xl p-1.5 rounded-full border border-white/10 z-10">
                            {['front', 'back'].map((side) => (
                                <button
                                    key={side}
                                    onClick={() => setDetailSide(side as any)}
                                    className={cn(
                                        "px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                        detailSide === side ? "bg-white text-black" : "text-white/40 hover:text-white"
                                    )}
                                >
                                    {side}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
                            <CustomHoodieThumbnail
                                colorHex={design.base_color}
                                designState={design.design_state}
                                showBack={detailSide === 'back'}
                                className="w-full h-full shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-3xl"
                            />
                        </div>

                        <div className="absolute bottom-8 right-8 text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-1">Interactive Technical Layer</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Vero Egypt QC Approved</p>
                        </div>
                    </div>

                    {/* Technical Specs Panel (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Customer & Order Card */}
                        <div className="p-8 bg-zinc-900/40 border border-white/10 rounded-[2rem] space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="w-12 h-12 rounded-2xl bg-vero-gold/10 flex items-center justify-center">
                                    <User className="w-6 h-6 text-vero-gold" />
                                </div>
                                <div>
                                    <p className="text-lg font-black uppercase">{design.orders?.customer_name || 'Generic Sample'}</p>
                                    <p className="text-xs text-zinc-500 font-medium">{design.orders?.customer_email || 'No email attached'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Base Color</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: design.base_color }} />
                                        <span className="text-[10px] font-black uppercase">{design.base_color}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Size</p>
                                    <span className="text-lg font-black text-vero-gold uppercase leading-none">{design.size}</span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown List */}
                        <div className="p-8 bg-black border border-white/5 rounded-[2rem] space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 border-b border-white/5 pb-4 flex items-center justify-between">
                                Design Elements
                                <span className="bg-white/5 px-2 py-0.5 rounded text-[8px]">{design.design_state?.length || 0} Layers</span>
                            </h3>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {(design.design_state || []).map((el: any, i: number) => (
                                    <div key={el.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black rounded-xl p-1.5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                {el.type === 'image' ? (
                                                    <img src={el.content} className="w-full h-full object-contain" alt="" />
                                                ) : (
                                                    <div className="text-base font-black text-vero-gold">T</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase">{el.type} Layer</p>
                                                <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">{el.side}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-zinc-400 uppercase">Scale: {el.scale.toFixed(2)}x</p>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase">Rot: {el.rotate}°</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Notes */}
                        {design.notes && (
                            <div className="p-8 bg-vero-gold/5 border border-vero-gold/10 rounded-[2rem] space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-vero-gold/60 border-b border-vero-gold/10 pb-3">Special Instructions</p>
                                <p className="text-sm italic text-zinc-300 font-medium leading-relaxed">"{design.notes}"</p>
                            </div>
                        )}

                        {/* Delete Action */}
                        <button
                            onClick={handleDelete}
                            className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                        >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Delete Design Specification
                        </button>
                    </div>
                </div>
            </div>

            {/* High-Fidelity Print Layout (Visible only on Print) */}
            <div className="hidden print:block space-y-12 text-black p-12 bg-white min-h-screen">
                <div className="border-b-4 border-black pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter line-height-none">Production Blueprint</h1>
                        <p className="text-sm font-bold mt-2 uppercase tracking-widest">Design ID: {design.id}</p>
                        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Order Ref: #{design.orders?.id || 'DRAFT'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4">{design.orders?.customer_name || 'N/A'}</p>
                        <p className="text-[10px] font-bold mt-1">{design.orders?.customer_email || 'N/A'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b-2 border-black pb-3">
                            <h2 className="text-xl font-black uppercase italic">01. Front View</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded">Primary</span>
                        </div>
                        <div className="aspect-square border-4 border-black rounded-3xl overflow-hidden bg-zinc-50 flex items-center justify-center p-12 shadow-[10px_10px_0px_rgba(0,0,0,1)]">
                            <CustomHoodieThumbnail
                                colorHex={design.base_color}
                                designState={design.design_state}
                                showBack={false}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b-2 border-black pb-3">
                            <h2 className="text-xl font-black uppercase italic">02. Back View</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest border-2 border-black px-3 py-1 rounded">Reverse</span>
                        </div>
                        <div className="aspect-square border-4 border-black rounded-3xl overflow-hidden bg-zinc-50 flex items-center justify-center p-12 shadow-[10px_10px_0px_rgba(0,0,0,1)]">
                            <CustomHoodieThumbnail
                                colorHex={design.base_color}
                                designState={design.design_state}
                                showBack={true}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-12 border-t-4 border-black pt-10">
                    <div>
                        <h3 className="text-xs font-black uppercase mb-6 tracking-widest flex items-center gap-2">
                            Base Specifications
                        </h3>
                        <div className="space-y-3 bg-zinc-50 p-6 border-2 border-black rounded-2xl">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-zinc-500 font-black uppercase">Color HEX:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border border-black" style={{ backgroundColor: design.base_color }} />
                                    <span className="font-black uppercase">{design.base_color}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-zinc-500 font-black uppercase">Size:</span>
                                <span className="font-black text-lg">{design.size}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <h3 className="text-xs font-black uppercase mb-6 tracking-widest">
                            Special Instructions / Notes
                        </h3>
                        <p className="text-sm italic border-2 border-black p-6 rounded-2xl bg-zinc-50 min-h-[100px] font-medium leading-relaxed">
                            {design.notes || "No special instructions provided for this request."}
                        </p>
                    </div>
                </div>

                <div className="border-t-2 border-zinc-200 pt-10">
                    <h3 className="text-xs font-black uppercase mb-8 tracking-[0.3em] text-zinc-400">
                        Technical Layer Analysis ({design.design_state?.length || 0} Components)
                    </h3>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        {(design.design_state || []).map((el: any, i: number) => (
                            <div key={el.id} className="flex items-center gap-6 p-4 border-2 border-zinc-100 rounded-2xl">
                                <div className="w-20 h-20 border-2 border-black rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                                    {el.type === 'image' ? (
                                        <img src={el.content} className="max-w-full max-h-full object-contain" alt="" />
                                    ) : (
                                        <div className="text-3xl font-black">T</div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase italic">Layer #{i + 1}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">{el.side}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-1 text-[9px] font-bold uppercase tracking-tight">
                                        <div className="flex justify-between pr-4 border-r border-zinc-100">
                                            <span className="text-zinc-400">Type:</span>
                                            <span>{el.type}</span>
                                        </div>
                                        <div className="flex justify-between pl-4">
                                            <span className="text-zinc-400">Scale:</span>
                                            <span>{el.scale.toFixed(2)}x</span>
                                        </div>
                                        <div className="flex justify-between pr-4 border-r border-zinc-100">
                                            <span className="text-zinc-400">Position:</span>
                                            <span>{Math.round(el.x)}%, {Math.round(el.y)}%</span>
                                        </div>
                                        <div className="flex justify-between pl-4">
                                            <span className="text-zinc-400">Rotation:</span>
                                            <span>{el.rotate}°</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t-2 border-black flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border-2 border-black rounded flex items-center justify-center font-black">QC</div>
                        <p className="text-[10px] font-black uppercase leading-tight">
                            Vero Egypt Production Unit<br />
                            <span className="text-zinc-500 font-bold tracking-widest italic">Quality Control: Verified</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.5em] mb-1">Authentic Internal Document</p>
                        <p className="text-[10px] font-bold uppercase">Generated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
