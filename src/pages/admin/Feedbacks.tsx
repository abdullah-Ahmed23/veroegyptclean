import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Check, X, Trash2, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Feedback {
    id: string;
    customer_name: string;
    customer_title: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
}

export default function AdminFeedbacks() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newFeedback, setNewFeedback] = useState({
        customer_name: '',
        customer_title: 'Verified Buyer',
        rating: 5,
        comment: '',
        is_approved: true
    });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('feedbacks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error('Failed to fetch feedbacks');
        } else {
            setFeedbacks(data || []);
        }
        setLoading(false);
    };

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('feedbacks')
            .update({ is_approved: !currentStatus })
            .eq('id', id);

        if (error) {
            toast.error('Failed to update status');
        } else {
            setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, is_approved: !currentStatus } : f));
            toast.success('Status updated');
        }
    };

    const deleteFeedback = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;

        const { error } = await supabase
            .from('feedbacks')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Failed to delete feedback');
        } else {
            setFeedbacks(feedbacks.filter(f => f.id !== id));
            toast.success('Feedback deleted');
        }
    };

    const handleAddFeedback = async () => {
        if (!newFeedback.customer_name || !newFeedback.comment) {
            toast.error('Please fill in all required fields');
            return;
        }

        const { data, error } = await supabase
            .from('feedbacks')
            .insert([newFeedback])
            .select();

        if (error) {
            toast.error('Failed to add feedback');
        } else {
            toast.success('Feedback added successfully');
            setFeedbacks([data[0], ...feedbacks]);
            setIsAdding(false);
            setNewFeedback({
                customer_name: '',
                customer_title: 'Verified Buyer',
                rating: 5,
                comment: '',
                is_approved: true
            });
        }
    };

    return (
        <div className="space-y-8 text-white">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="heading-2 uppercase tracking-tight mb-2">Feedbacks</h1>
                    <p className="text-zinc-500 text-sm">Manage customer testimonials and approvals.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-sm hover:bg-vero-gold transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Feedback
                </button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/50 border border-white/5 p-8 rounded-sm space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customer Name</label>
                            <input
                                type="text"
                                value={newFeedback.customer_name}
                                onChange={e => setNewFeedback({ ...newFeedback, customer_name: e.target.value })}
                                className="w-full bg-black border border-white/10 p-3 text-sm focus:border-vero-gold outline-none"
                                placeholder="e.g. Abdullah A."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Title</label>
                            <input
                                type="text"
                                value={newFeedback.customer_title}
                                onChange={e => setNewFeedback({ ...newFeedback, customer_title: e.target.value })}
                                className="w-full bg-black border border-white/10 p-3 text-sm focus:border-vero-gold outline-none"
                                placeholder="e.g. Verified Buyer"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Rating (1-5)</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                                        className={`p-2 rounded-sm transition-colors ${newFeedback.rating >= star ? 'text-vero-gold' : 'text-zinc-700'}`}
                                    >
                                        <Star className="h-5 w-5 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Comment</label>
                        <textarea
                            value={newFeedback.comment}
                            onChange={e => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                            className="w-full bg-black border border-white/10 p-3 text-sm focus:border-vero-gold outline-none h-32 resize-none"
                            placeholder="Customer testimonial..."
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddFeedback}
                            className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-sm hover:bg-vero-gold"
                        >
                            Save Feedback
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="bg-zinc-900/30 border border-white/5 rounded-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <tr>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Comment</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center animate-pulse text-zinc-500">Loading feedbacks...</td></tr>
                        ) : feedbacks.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-zinc-500 italic">No feedbacks found.</td></tr>
                        ) : (
                            feedbacks.map((feedback) => (
                                <tr key={feedback.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-sm">{feedback.customer_name}</div>
                                        <div className="text-[10px] text-zinc-500 uppercase">{feedback.customer_title}</div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-xs text-zinc-400 max-w-md line-clamp-2">{feedback.comment}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < feedback.rating ? 'text-vero-gold fill-current' : 'text-zinc-800'}`} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleApproval(feedback.id, feedback.is_approved)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${feedback.is_approved
                                                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                                                }`}
                                        >
                                            {feedback.is_approved ? 'Approved' : 'Pending'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => deleteFeedback(feedback.id)}
                                            className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
