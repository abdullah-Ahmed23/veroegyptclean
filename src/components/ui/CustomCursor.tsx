import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isPointer, setIsPointer] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics for the cursor movement
    const springConfig = { damping: 25, stiffness: 400 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Hide default cursor globally
        document.body.style.cursor = 'none';

        // Track mouse
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            setIsVisible(true);

            // Check for interactive elements
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer');

            setIsPointer(!!isInteractive);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            style={{
                x: cursorX,
                y: cursorY,
                opacity: isVisible ? 1 : 0,
            }}
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        >
            <AnimatePresence mode="wait">
                {isPointer ? (
                    /* Pointer State (Hovering) - Large Ring */
                    <motion.div
                        key="pointer"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                            scale: isClicking ? 0.8 : 1, // Shrink slightly on click
                            opacity: 1,
                            borderRadius: '50%'
                        }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-full bg-transparent"
                    />
                ) : (
                    /* Default State - Small Dot */
                    <motion.div
                        key="default"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1
                        }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
