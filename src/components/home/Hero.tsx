import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import lookbook1 from '@/assets/lookbook-1.jpg';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.png';
import { useUIStore } from '@/lib/store';
import LogoWhite from '@/assets/main logo white.png';
import LogoBlack from '@/assets/logo.png';

const HERO_SLIDES = [
    { src: hero1, theme: 'dark' },      // Dark image -> White Text
    { src: hero2, theme: 'light' },     // Light image -> Black Text (Check actual image, assuming light for demo)
    { src: lookbook1, theme: 'dark' },  // Dark image -> White Text
] as const;

export function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const { isDarkMode, setHeroTheme } = useUIStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Update global theme when slide changes
    useEffect(() => {
        setHeroTheme(HERO_SLIDES[currentIndex].theme);
        // Optional: Reset to dark on unmount to avoid state leak to other pages
        return () => setHeroTheme('dark');
    }, [currentIndex, setHeroTheme]);

    // Manual image cycle on click
    const cycleImage = () => {
        setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    };

    // Auto-cycle images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!logoRef.current) return;
        const rect = logoRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    };

    return (
        <div
            ref={ref}
            className="relative h-screen w-full overflow-hidden bg-background flex flex-col justify-center items-center cursor-pointer group"
            onClick={cycleImage}
            onMouseMove={handleMouseMove}
        >
            {/* Full Screen Background with Glitch Transition */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        clipPath: [
                            "inset(0 0 0 0)",
                            "inset(20% 0 80% 0)",
                            "inset(40% 0 10% 0)",
                            "inset(0 0 0 0)"
                        ],
                        x: [0, -10, 10, -5, 5, 0],
                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full z-0"
                >
                    <div className="absolute inset-0 bg-black/40 z-10" /> {/* Dark Overlay for Text Contrast */}
                    <img
                        src={HERO_SLIDES[currentIndex].src}
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />

                    {/* Glitch Overlay Effect Layers */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0.5, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-red-500/20 mix-blend-color-dodge z-20 pointer-events-none"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0.5, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-blue-500/20 mix-blend-color-dodge z-20 pointer-events-none"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Background Grain/Noise */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-20"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Main Typography - Centered & Fixed */}
            <div className="relative z-30 text-center px-4 mix-blend-screen pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <p className="text-sm md:text-base font-medium tracking-[0.5em] text-white/60 mb-6 uppercase drop-shadow-md">
                        Est. Cairo 2024
                    </p>

                    {/* Vintage Flashlight Reveal Container */}
                    <div
                        ref={logoRef}
                        className="flashlight-container w-[70vw] md:w-[50vw] max-w-2xl mx-auto relative transition-all duration-500"
                        style={{
                            // Mask reveals the logo only at mouse position on desktop
                            // On mobile/tablet, we use a very large circle or disable mask to show it fully
                            maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
                            WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
                        }}
                    >
                        {/* Mobile Override: Show fully if screen is small or touch is detected via CSS */}
                        <style>{`
                            @media (max-width: 1024px), (pointer: coarse) {
                                .flashlight-container {
                                    mask-image: none !important;
                                    -webkit-mask-image: none !important;
                                }
                            }
                        `}</style>
                        <div className="w-full h-full relative">
                            {/* Ghost/Guide Logo (Very faint usage hint) */}
                            <img
                                src={LogoWhite}
                                alt=""
                                className="absolute top-0 left-0 w-full h-auto object-contain opacity-[0.05]"
                            />

                            {/* Mobile Glitch Effect (Red & Purple) */}
                            <motion.img
                                src={LogoWhite}
                                alt=""
                                className="absolute inset-0 w-full h-full object-contain -z-10 md:hidden mix-blend-screen"
                                style={{ filter: 'drop-shadow(3px 0px 0px rgba(255, 0, 0, 0.8))' }} // Red
                                initial={{ opacity: 0 }}
                                animate={{
                                    x: [-3, 3, -1, 0],
                                    opacity: [0, 0.8, 0.8, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                    duration: 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.img
                                src={LogoWhite}
                                alt=""
                                className="absolute inset-0 w-full h-full object-contain -z-10 md:hidden mix-blend-screen"
                                style={{ filter: 'drop-shadow(-3px 0px 0px rgba(138, 43, 226, 0.8))' }} // Purple/Violet
                                initial={{ opacity: 0 }}
                                animate={{
                                    x: [3, -3, 1, 0],
                                    opacity: [0, 0.8, 0.8, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                    duration: 0.25,
                                    delay: 0.05, // Slight sync offset
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Revealed Logo */}
                            <img
                                src={LogoWhite} // Always white on dark immersive background
                                alt="VERO"
                                className="w-full h-auto object-contain drop-shadow-xl relative z-10"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer / CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute bottom-8 md:bottom-12 left-0 right-0 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center md:items-center gap-6 md:gap-8 z-30"
            >
                {/* Spacer/Balance */}
                <div className="hidden md:block w-32" />

                <div className="flex flex-col items-center gap-6">
                    <p className="text-white/90 max-w-xs text-center text-sm leading-relaxed hidden md:block drop-shadow-md">
                        Redefining Egyptian luxury with contemporary streetwear aesthetics.
                    </p>
                    <Link
                        to="/shop"
                        className="group relative px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs overflow-hidden shadow-lg hover:bg-white/90 transition-colors pointer-events-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent hero cycle when clicking CTA
                    >
                        <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all">
                            Shop Collection <ArrowRight className="w-4 h-4" />
                        </span>
                    </Link>
                </div>

                {/* Modern Scroll Indicator */}
                <div className="w-32 flex justify-end">
                    <div
                        className="group/scroll flex flex-col items-center gap-2 cursor-pointer"
                        onClick={() => document.getElementById('fresh-drops')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 group-hover/scroll:text-white transition-colors">
                            Scroll
                        </span>
                        <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md group-hover/scroll:bg-white group-hover/scroll:border-white transition-all duration-300">
                            <ArrowDown className="w-5 h-5 text-white group-hover/scroll:text-black group-hover/scroll:translate-y-1 transition-all duration-300 animate-bounce-slight" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
