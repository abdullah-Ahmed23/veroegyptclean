import { motion } from 'framer-motion';
import { useUIStore } from '@/lib/store';
import LogoWhite from '@/assets/main logo white.png';
import LogoBlack from '@/assets/logo.png';

export function GlitchTransition() {
    const { isDarkMode } = useUIStore();
    const logoSrc = isDarkMode ? LogoWhite : LogoBlack;

    return (
        <motion.div
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Glitch Slices */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-full h-[10vh] bg-foreground/5 mix-blend-exclusion"
                    style={{ top: `${i * 20}%` }}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                        duration: 0.4,
                        ease: 'easeInOut',
                        delay: i * 0.05,
                        repeat: Infinity,
                        repeatDelay: 0.5
                    }}
                />
            ))}

            {/* Central Glitch Logo */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: [0.8, 1.2, 0.9, 1.1, 1],
                    opacity: 1
                }}
                transition={{ duration: 0.4, times: [0, 0.2, 0.4, 0.6, 1] }}
                className="relative z-10 w-64 md:w-96"
            >
                <img
                    src={logoSrc}
                    alt="Loading..."
                    className="w-full h-auto object-contain relative z-10"
                />

                {/* Red Glitch Ghost */}
                <motion.img
                    src={logoSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain -z-10 opacity-70"
                    style={{ filter: 'drop-shadow(4px 0px 0px rgba(255, 0, 60, 0.7))' }}
                    animate={{ x: [-2, 2, -1, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                />

                {/* Cyan Glitch Ghost */}
                <motion.img
                    src={logoSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain -z-10 opacity-70"
                    style={{ filter: 'drop-shadow(-4px 0px 0px rgba(0, 240, 255, 0.7))' }}
                    animate={{ x: [2, -2, 1, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.15 }}
                />
            </motion.div>
        </motion.div>
    );
}
