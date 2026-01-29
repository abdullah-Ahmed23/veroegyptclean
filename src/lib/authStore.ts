import { create } from 'zustand';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session, user: session?.user ?? null }),
    signOut: async () => {
        await supabase.auth.signOut();
        // Clear cart on logout for security
        const { useCartStore } = await import('./store');
        useCartStore.getState().clearCart();
        set({ user: null, session: null });
    },
    initialize: async () => {
        set({ isLoading: true });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            set({ session, user: session?.user ?? null });

            supabase.auth.onAuthStateChange((_event, session) => {
                set({ session, user: session?.user ?? null });
            });
        } catch (error) {
            console.error('Error initializing auth:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
