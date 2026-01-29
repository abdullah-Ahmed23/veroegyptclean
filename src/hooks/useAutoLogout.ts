import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/authStore';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const ACTIVITY_KEY = 'admin_last_activity';

export function useAutoLogout() {
    const { signOut, user } = useAuthStore();
    const checkIntervalRef = useRef<any>(null);

    const updateActivity = () => {
        localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
    };

    useEffect(() => {
        if (!user) return;

        // Initialize activity
        updateActivity();

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        const handleActivity = () => updateActivity();

        events.forEach(event => window.addEventListener(event, handleActivity));

        // Periodically check if we've been inactive for too long
        checkIntervalRef.current = setInterval(() => {
            const lastActivity = parseInt(localStorage.getItem(ACTIVITY_KEY) || '0');
            const now = Date.now();

            if (now - lastActivity > INACTIVITY_TIMEOUT) {
                signOut();
            }
        }, 10000); // Check every 10 seconds

        return () => {
            if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [user, signOut]);
}
