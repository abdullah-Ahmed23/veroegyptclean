import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlitchCardProps {
    image: string;
    title: string;
    subtitle: string;
    link: string;
    className?: string;
    tag?: string;
}

export function GlitchCard({ image, title, subtitle, link, className, tag }: GlitchCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse Position Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Calculate normalized position (-0.5 to 0.5)
        const xPos = (e.clientX - rect.left) / width - 0.5;
        const yPos = (e.clientY - rect.top) / height - 0.5;

        x.set(xPos);
        y.set(yPos);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    // 3D Tilt Transforms
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Parallax for Image (Moves opposite to tilt)
    const imageX = useTransform(mouseXSpring, [-0.5, 0.5], ["-3%", "3%"]);
    const imageY = useTransform(mouseYSpring, [-0.5, 0.5], ["-3%", "3%"]);

    // Dynamic Glitch Offsets (Reacts to mouse position)
    const glitchX = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);
    const glitchY = useTransform(mouseYSpring, [-0.5, 0.5], [-5, 5]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
            }}
            className={cn(
                "group relative overflow-hidden rounded-sm cursor-pointer perspective-1000 bg-black",
                className
            )}
        >
            <Link to={link} className="block w-full h-full relative transform-style-3d">

                {/* Glitch Layer - Red (Background) */}
                <motion.div
                    style={{ x: glitchX, y: glitchY }}
                    animate={{
                        opacity: isHovered ? [0, 0.4, 0, 0.2, 0] : 0,
                        x: isHovered ? [-2, 2, -1, 0] : 0,
                    }}
                    transition={{
                        opacity: { repeat: Infinity, duration: 0.2, repeatDelay: 0.1 },
                        x: { repeat: Infinity, duration: 0.1 }
                    }}
                    className="absolute inset-0 z-0 mix-blend-screen opacity-0 pointer-events-none"
                >
                    <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover filter sepia-100 hue-rotate-[-50deg] saturate-200 contrast-150 scale-110"
                    />
                </motion.div>

                {/* Glitch Layer - Cyan (Background) */}
                <motion.div
                    style={{ x: useTransform(glitchX, v => -v), y: useTransform(glitchY, v => -v) }}
                    animate={{
                        opacity: isHovered ? [0, 0.4, 0, 0.2, 0] : 0,
                        x: isHovered ? [2, -2, 1, 0] : 0,
                    }}
                    transition={{
                        opacity: { repeat: Infinity, duration: 0.25, delay: 0.05, repeatDelay: 0.1 },
                        x: { repeat: Infinity, duration: 0.1, delay: 0.05 }
                    }}
                    className="absolute inset-0 z-0 mix-blend-screen opacity-0 pointer-events-none"
                >
                    <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover filter sepia-100 hue-rotate-[130deg] saturate-200 contrast-150 scale-110"
                    />
                </motion.div>

                {/* Main Image with Parallax */}
                <motion.div
                    style={{ x: imageX, y: imageY, scale: 1.1 }}
                    className="relative z-10 w-full h-full"
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700"
                    />
                </motion.div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-20" />

                {/* Content Content (Floating above) */}
                <div
                    className="absolute inset-0 p-8 flex flex-col justify-end z-30 transform-style-3d"
                    style={{ transform: "translateZ(30px)" }} // Push content forward
                >
                    <motion.div
                        animate={{ y: isHovered ? 0 : 10, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-white"
                    >
                        {tag && (
                            <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3 block text-[#4ade80] glow-text">
                                {tag}
                            </span>
                        )}
                        <h3 className="heading-3 md:text-3xl text-white mb-2 tracking-tight">{title}</h3>
                        <p className="text-white/70 text-sm max-w-xs line-clamp-2 font-medium">
                            {subtitle}
                        </p>
                    </motion.div>
                </div>

                {/* Border / Frame Effect */}
                <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors z-40 pointer-events-none" />
            </Link>
        </motion.div>
    );
}
