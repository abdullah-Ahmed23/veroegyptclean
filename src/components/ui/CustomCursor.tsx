import { useEffect, useState } from 'react';
import { motion, useMotionValue, Variants } from 'framer-motion';

export function CustomCursor() {
    const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click'>('default');

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        // Default cursor is hidden via index.css for desktop only

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setCursorVariant('click');

        // On mouse up, check if we are still hovering an interactive element to decide next state
        const handleMouseUp = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]') ||
                target.classList.contains('cursor-hover') ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA';

            setCursorVariant(isInteractive ? 'hover' : 'default');
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // robust check for interactive elements
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]') ||
                target.classList.contains('cursor-hover') ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA';

            if (isInteractive) {
                setCursorVariant('hover');
            } else {
                setCursorVariant('default');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        // Use mouseover for event delegation to detect hover on elements
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    const variants: Variants = {
        default: {
            width: 16,
            height: 16,
            backgroundColor: '#ffffff',
            border: '0px solid transparent',
            mixBlendMode: 'difference',
        },
        hover: {
            width: 64,
            height: 64,
            backgroundColor: 'transparent',
            border: '1px solid #ffffff',
            mixBlendMode: 'difference',
        },
        click: {
            width: 12,
            height: 12,
            backgroundColor: '#ffffff',
            border: '0px solid transparent',
            mixBlendMode: 'difference',
            scale: 0.8,
        },
    };

    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block" // Hidden on mobile
            style={{
                x: mouseX,
                y: mouseY,
                translateX: '-50%',
                translateY: '-50%',
                position: 'fixed',
            }}
            variants={variants}
            animate={cursorVariant}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 28,
            }}
        />
    );
}
