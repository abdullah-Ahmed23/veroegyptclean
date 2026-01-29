import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const FeedbackForm = () => {
    const { t } = useTranslation();
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !name.trim()) {
            toast.error(t('home.feedback.form.errorEmpty'));
            return;
        }

        setIsSubmitting(true);
        const { error } = await supabase
            .from('feedbacks')
            .insert([{
                customer_name: name,
                customer_title: 'Customer',
                rating: rating,
                comment: comment,
                is_approved: false
            }]);

        if (error) {
            toast.error(t('home.feedback.form.errorFailed'));
        } else {
            setIsSuccess(true);
            setComment('');
            setName('');
            toast.success(t('home.feedback.form.successToast'));
        }
        setIsSubmitting(false);
    };

    return (
        <div id="feedback-form" className="py-16 md:py-32 bg-accent/5 border-t border-border relative overflow-hidden transition-colors duration-500">
            <div className="container-vero max-w-2xl mx-auto px-6 text-center relative z-10">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <span className="inline-block text-vero-gold text-[10px] font-black uppercase tracking-[0.5em] mb-6">
                                {t('home.feedback.form.subtitle')}
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-8 md:mb-16 leading-none">
                                {t('home.feedback.form.title')}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2 text-left group">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block group-focus-within:text-foreground transition-colors">
                                        {t('home.feedback.form.namePlaceholder')}
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent border-b border-border p-4 text-foreground text-lg focus:border-vero-gold focus:outline-none transition-all placeholder:text-muted-foreground/30 font-light italic"
                                    />
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                                            {t('product.selectRating')}
                                        </label>
                                        <div className="flex justify-center gap-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={cn(
                                                        "p-4 transition-colors duration-200 -m-2",
                                                        rating >= star ? 'text-vero-gold' : 'text-muted/20'
                                                    )}
                                                >
                                                    <Star
                                                        size={24}
                                                        fill={rating >= star ? "currentColor" : "none"}
                                                        className={cn(
                                                            "transition-transform",
                                                            rating >= star && "scale-110"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-left group">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block group-focus-within:text-foreground transition-colors">
                                            {t('home.feedback.form.feedbackPlaceholder')}
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full bg-muted/10 border border-border p-6 text-foreground text-sm focus:border-vero-gold focus:outline-none transition-all h-48 resize-none font-light italic leading-relaxed"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group/btn relative w-full md:w-auto px-16 py-5 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-vero-gold hover:text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {isSubmitting ? (
                                            <span className="animate-pulse">{t('home.feedback.form.submitting')}</span>
                                        ) : (
                                            <>
                                                {t('home.feedback.form.submit')}
                                                <div className="w-4 h-[1px] bg-background group-hover/btn:w-8 group-hover/btn:bg-white transition-all" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card p-16 rounded-[2rem] border border-border transition-colors duration-500"
                        >
                            <div className="w-20 h-20 bg-vero-gold/10 text-vero-gold rounded-full flex items-center justify-center mx-auto mb-8">
                                <Star size={40} fill="currentColor" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-6">
                                {t('home.feedback.form.successTitle')}
                            </h3>
                            <p className="text-muted-foreground font-light italic mb-12 max-w-sm mx-auto">
                                {t('home.feedback.form.successSubtitle')}
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground border-b-2 border-vero-gold pb-1 hover:text-vero-gold transition-colors"
                            >
                                {t('home.feedback.form.submitAnother')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
