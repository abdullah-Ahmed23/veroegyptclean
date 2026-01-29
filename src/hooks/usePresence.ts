import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook to track user presence on the site for the Admin Dashboard.
 * This joins an 'online-users' channel and pings Supabase.
 */
export function usePresenceTracking() {
    useEffect(() => {
        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: 'user-' + Math.random().toString(36).substring(7),
                },
            },
        });

        channel
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, []);
}

/**
 * Hook to get the count of active users on the site.
 * Used in the Admin Dashboard.
 */
export function useActiveUserCount() {
    const [activeUsers, setActiveUsers] = useState(0);

    useEffect(() => {
        const channel = supabase.channel('online-users');

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const count = Object.keys(state).length;
                setActiveUsers(count);
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return activeUsers;
}
