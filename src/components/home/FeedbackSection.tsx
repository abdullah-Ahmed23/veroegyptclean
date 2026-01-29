import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackForm } from './FeedbackForm';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export const FeedbackSection = () => {
    const { t } = useTranslation();
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [hasEntered, setHasEntered] = useState(false);
    const [isSettled, setIsSettled] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchApprovedFeedbacks = async () => {
            const { data, error } = await supabase
                .from('feedbacks')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setFeedbacks(data);
            }
            setLoading(false);
        };

        fetchApprovedFeedbacks();
    }, []);

    const [triggerAutoHover, setTriggerAutoHover] = useState(false);

    const handleViewportEnter = () => {
        setHasEntered(true);
        // Sequential auto-hover triggers
        setTimeout(() => setTriggerAutoHover(true), 600);
        // Instant settle for performance
        setTimeout(() => setIsSettled(true), 100);
    };

    if (loading || feedbacks.length === 0) return null;

    const row1 = feedbacks.slice(0, Math.ceil(feedbacks.length / 2));
    const row2 = feedbacks.slice(Math.ceil(feedbacks.length / 2));

    const displayRow1 = [...row1, ...row1, ...row1, ...row1];
    const displayRow2 = [...row2, ...row2, ...row2, ...row2];

    return (
        <section
            className="py-16 md:pt-32 md:pb-48 bg-background relative overflow-hidden transition-colors duration-500"
            onMouseEnter={() => setTriggerAutoHover(false)} // Disable auto-hover once user interacts
        >
            <motion.div
                onViewportEnter={handleViewportEnter}
                viewport={{ once: true, amount: 0.3 }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)] opacity-50 dark:opacity-100" />
            </motion.div>

            <div className="container-vero relative z-20 mb-16 md:mb-32">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                    <div className="max-w-2xl group/intro">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={cn(
                                "inline-block text-black dark:text-white text-[10px] font-black uppercase tracking-[0.5em] mb-6 transition-colors duration-500 cursor-default",
                                (triggerAutoHover || false) ? "text-[#49d77e]" : "group-hover/intro:text-[#49d77e]"
                            )}
                        >
                            {t('home.feedback.reflections')}
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 group/title cursor-default"
                        >
                            <span className="block relative overflow-hidden text-black dark:text-white">
                                <span className={cn(
                                    "block transition-transform duration-700 ease-[0.33,1,0.68,1]",
                                    triggerAutoHover ? "-translate-y-full" : "group-hover/title:-translate-y-full"
                                )}>
                                    {t('home.feedback.titlePart1')}
                                </span>
                                <span className={cn(
                                    "absolute inset-0 block text-[#49d77e] transition-transform duration-700 ease-[0.33,1,0.68,1] translate-y-full",
                                    triggerAutoHover ? "translate-y-0" : "group-hover/title:translate-y-0"
                                )}>
                                    {t('home.feedback.titlePart1')}
                                </span>
                            </span>
                            <span className="block text-black dark:text-white mt-2">
                                {t('home.feedback.titlePart2')}
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-muted-foreground text-lg md:text-xl font-light italic leading-relaxed max-w-xl"
                        >
                            {t('home.feedback.subtitle')}
                        </motion.p>
                    </div>

                    <div className="flex flex-col items-end gap-6 pb-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-8"
                        >
                            <div className="text-right">
                                <div className="text-3xl font-black text-foreground leading-none mb-1">4.9<span className="text-vero-gold text-lg">/5</span></div>
                                <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{t('home.feedback.averageRating')}</div>
                            </div>
                            <div className="h-10 w-[1px] bg-border" />
                            <div className="flex gap-1 text-vero-gold">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>
                        </motion.div>

                        {/* Slider Controls for Mobile/Tablet */}
                        <div className="flex md:hidden items-center gap-4">
                            <button
                                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                                disabled={currentSlide === 0}
                                className={cn(
                                    "p-4 rounded-full border border-border transition-all duration-300 active:scale-95",
                                    currentSlide === 0 ? "opacity-30 cursor-not-allowed" : "hover:border-[#49d77e] hover:text-[#49d77e]"
                                )}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                onClick={() => setCurrentSlide(prev => Math.min(feedbacks.length - 1, prev + 1))}
                                disabled={currentSlide === feedbacks.length - 1}
                                className={cn(
                                    "p-4 rounded-full border border-border transition-all duration-300 active:scale-95",
                                    currentSlide === feedbacks.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:border-[#49d77e] hover:text-[#49d77e]"
                                )}
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Marquee Layout */}
            <div className="hidden md:flex flex-col gap-16 md:gap-32 mask-fade-edges py-20 pointer-events-none sm:pointer-events-auto z-10">
                {/* Row 1 */}
                <div className="flex overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={hasEntered ? {
                            opacity: 1,
                            x: isSettled ? ["-50%", "0%"] : "-50%"
                        } : {}}
                        transition={{
                            opacity: { duration: 1.5 },
                            x: isSettled
                                ? { duration: 80, repeat: Infinity, ease: "linear" }
                                : { duration: 2, ease: [0.19, 1, 0.22, 1] }
                        }}
                        className={cn(
                            "flex gap-8 pr-8 w-max transition-all",
                            hasEntered && !isSettled && "entrance-active"
                        )}
                    >
                        {displayRow1.map((item, i) => (
                            <FeedbackCard
                                key={`${item.id}-r1-${i}`}
                                name={item.customer_name}
                                title={item.customer_title}
                                rating={item.rating}
                                comment={item.comment}
                                className="reflect-subtle"
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2 */}
                <div className="flex overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={hasEntered ? {
                            opacity: 1,
                            x: isSettled ? ["0%", "-50%"] : "0%"
                        } : {}}
                        transition={{
                            opacity: { duration: 1.8 },
                            x: isSettled
                                ? { duration: 100, repeat: Infinity, ease: "linear" }
                                : { duration: 2.5, ease: [0.19, 1, 0.22, 1] }
                        }}
                        className={cn(
                            "flex gap-8 pr-8 w-max transition-all",
                            hasEntered && !isSettled && "entrance-active"
                        )}
                    >
                        {displayRow2.map((item, i) => (
                            <FeedbackCard
                                key={`${item.id}-r2-${i}`}
                                name={item.customer_name}
                                title={item.customer_title}
                                rating={item.rating}
                                comment={item.comment}
                                className="reflect-subtle"
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Mobile/Tablet Slider Layout */}
            <div className="md:hidden relative z-10">
                <div className="px-6 overflow-hidden">
                    <motion.div
                        animate={{ x: `-${currentSlide * 100}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="flex"
                    >
                        {feedbacks.map((item) => (
                            <div key={item.id} className="w-full px-4 flex-shrink-0">
                                <FeedbackCard
                                    name={item.customer_name}
                                    title={item.customer_title}
                                    rating={item.rating}
                                    comment={item.comment}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Mobile Indicators & Add Feedback Button */}
                <div className="flex items-center justify-between mt-8 px-6">
                    <div className="flex gap-2">
                        {feedbacks.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1 rounded-full transition-all duration-300",
                                    currentSlide === i ? "w-8 bg-[#49d77e]" : "w-2 bg-border"
                                )}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            const formElement = document.getElementById('feedback-form');
                            formElement?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-[#49d77e] border-b border-[#49d77e] pb-0.5"
                    >
                        {t('common.leaveFeedback')}
                    </button>
                </div>
            </div>

            {/* Submission Form Section */}
            <FeedbackForm />
        </section >
    );
};
