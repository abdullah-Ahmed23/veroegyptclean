import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface CarouselItem {
    id: string;
    image: string;
    name: string;
    price: number;
    handle: string;
}

interface ScrollingCarouselProps {
    items: CarouselItem[];
    title?: string;
    subtitle?: string;
}

const ProductCard = ({ item }: { item: CarouselItem }) => {
    const { t } = useTranslation();
    return (
        <Link
            to={`/product/${item.handle}`}
            className="relative flex-shrink-0 w-[280px] md:w-[350px] aspect-[3/4] group overflow-hidden bg-secondary rounded-sm border border-border/10"
        >
            <OptimizedImage
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <h3 className="text-white font-display font-bold uppercase tracking-wider mb-1">{item.name}</h3>
                <p className="text-white/70 text-sm">{item.price.toLocaleString()} {t('common.currency')}</p>
            </div>
        </Link>
    );
};

export function ScrollingCarousel({ items, title, subtitle }: ScrollingCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Split items into two rows
    const row1 = items.slice(0, Math.ceil(items.length / 2));
    const row2 = items.slice(Math.ceil(items.length / 2));

    // Duplicating for infinite effect
    const duplicatedRow1 = [...row1, ...row1, ...row1];
    const duplicatedRow2 = [...row2, ...row2, ...row2];

    return (
        <section className="py-24 bg-background overflow-hidden relative">
            <div className="container-vero mb-16">
                <div className="max-w-xl mx-auto text-center">
                    {title && (
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="heading-2 uppercase tracking-tight mb-4"
                        >
                            {title}
                        </motion.h2>
                    )}
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
            </div>

            <div ref={containerRef} className="space-y-8 relative">
                {/* Row 1: Left */}
                <div className="flex overflow-hidden">
                    <motion.div
                        animate={{ x: [0, -100 * row1.length + "%"] }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="flex gap-6 whitespace-nowrap"
                    >
                        {duplicatedRow1.map((item, i) => (
                            <ProductCard key={`${item.id}-r1-${i}`} item={item} />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2: Right */}
                <div className="flex overflow-hidden">
                    <motion.div
                        initial={{ x: -100 * row2.length + "%" }}
                        animate={{ x: 0 }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="flex gap-6 whitespace-nowrap"
                    >
                        {duplicatedRow2.map((item, i) => (
                            <ProductCard key={`${item.id}-r2-${i}`} item={item} />
                        ))}
                    </motion.div>
                </div>

                {/* Custom Fade Effects (Fadeback) */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
}
