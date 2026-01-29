import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackCardProps {
    name: string;
    title: string;
    rating: number;
    comment: string;
    className?: string;
}

export const FeedbackCard = ({ name, title, rating, comment, className }: FeedbackCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className={cn(
                "relative p-6 md:p-8 rounded-[1.5rem] border border-border bg-card transition-all duration-300",
                "hover:border-[#49d77e]/40 hover:bg-foreground/5",
                "w-[280px] sm:w-[350px] md:w-[450px] flex-shrink-0 group overflow-hidden",
                className
            )}
        >
            <div className="absolute top-8 right-10 text-vero-gold/10 group-hover:text-[#49d77e]/20 transition-all duration-500">
                <Quote size={48} fill="currentColor" />
            </div>

            <div className="space-y-8 relative z-10">
                <div className="flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={cn(
                                "transition-colors duration-300",
                                i < rating ? "text-vero-gold fill-current" : "text-border"
                            )}
                        />
                    ))}
                </div>

                <div className="relative">
                    {/* Theme-aware Text */}
                    <p className="text-muted-foreground font-light italic leading-relaxed text-base md:text-lg group-hover:text-foreground transition-colors duration-300">
                        "{comment}"
                    </p>
                </div>

                <div className="pt-6 border-t border-border flex items-center justify-between">
                    <div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground group-hover:text-[#49d77e] transition-colors duration-300">
                            {name}
                        </h4>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1 font-bold">
                            {title}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
