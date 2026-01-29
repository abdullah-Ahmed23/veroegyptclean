import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackForm } from './FeedbackForm';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export const FeedbackSection = () => {
    const { t } = useTranslation();
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [hasEntered, setHasEntered] = useState(false);
    const [isSettled, setIsSettled] = useState(false);

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
            className="pt-32 pb-48 bg-background relative overflow-hidden transition-colors duration-500"
            onMouseEnter={() => setTriggerAutoHover(false)} // Disable auto-hover once user interacts
        >
            <motion.div
                onViewportEnter={handleViewportEnter}
                viewport={{ once: true, amount: 0.3 }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)] opacity-50 dark:opacity-100" />
            </motion.div>

            <div className="container-vero relative z-20 mb-32">
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
                            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 group/title cursor-default"
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

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-8 pb-4"
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
                </div>
            </div>

            {/* Carousel Container */}
            <motion.div
                onViewportEnter={handleViewportEnter}
                viewport={{ once: true, margin: "-100px" }}
                className="relative flex flex-col gap-16 md:gap-32 mask-fade-edges py-20 pointer-events-none sm:pointer-events-auto z-10"
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes feedback-entrance {
                        0% { 
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        100% { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .entrance-active {
                        animation: feedback-entrance 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    }
                `}} />

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
            </motion.div>

            {/* Submission Form Section */}
            <FeedbackForm />
        </section>
    );
};
