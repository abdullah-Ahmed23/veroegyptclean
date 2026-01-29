import { useState, useEffect } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends HTMLMotionProps<"img"> {
    containerClassName?: string;
    lowResSrc?: string;
}

export const OptimizedImage = ({
    src,
    alt,
    className,
    containerClassName,
    lowResSrc,
    ...props
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    // Use lowResSrc as initial if provided, or empty if not
    const [currentSrc, setCurrentSrc] = useState(lowResSrc || '');

    useEffect(() => {
        if (isLoaded) return;

        const img = new Image();
        img.src = src || '';
        img.onload = () => {
            setCurrentSrc(src || '');
            setIsLoaded(true);
        };
    }, [src]);

    return (
        <div
            className={cn(
                "relative overflow-hidden bg-muted/20 w-full h-full",
                containerClassName
            )}
        >
            <AnimatePresence mode="wait">
                {!isLoaded && lowResSrc && (
                    <motion.img
                        key="placeholder"
                        src={lowResSrc}
                        alt={alt}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover blur-lg scale-110",
                            className
                        )}
                    />
                )}
            </AnimatePresence>

            <motion.img
                src={currentSrc || src}
                alt={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "w-full h-full object-cover",
                    !isLoaded && "scale-105",
                    className
                )}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
                {...props}
            />
        </div>
    );
};
