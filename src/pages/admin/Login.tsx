import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/authStore';
import { toast } from 'sonner';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (user) {
            navigate('/admin');
        }
    }, [user, navigate]);

    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

    useEffect(() => {
        if (lockoutUntil && Date.now() > lockoutUntil) {
            setLockoutUntil(null);
            setAttempts(0);
        }
    }, [lockoutUntil]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (lockoutUntil && Date.now() < lockoutUntil) {
            const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
            toast.error(`Account temporarily locked. Please try again in ${remaining} minutes.`);
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 5) {
                const lockoutTime = Date.now() + (5 * 60 * 1000); // 5 minutes
                setLockoutUntil(lockoutTime);
                toast.error('Too many failed attempts. Access locked for 5 minutes.');
            } else {
                toast.error(`${error.message} (${5 - newAttempts} attempts remaining)`);
            }
            setLoading(false);
        } else {
            // Get user again to ensure metadata is fresh
            const { data: { user: freshUser } } = await supabase.auth.getUser();
            const isAdmin = freshUser?.app_metadata?.role === 'admin';

            if (isAdmin) {
                toast.success('Welcome back, Admin');
                setAttempts(0);
                navigate('/admin');
            } else {
                await supabase.auth.signOut();
                toast.error('Unauthorized: Admin access only');
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background aesthetics */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vero-gold/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="heading-display text-4xl mb-2 text-white">VERO</h1>
                        <p className="text-xs font-bold uppercase tracking-[0.4em] text-vero-gold">Admin Terminal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 px-12 py-4 text-sm text-white focus:outline-none focus:border-white transition-all"
                                    placeholder="admin@veroegypt.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 px-12 py-4 text-sm text-white focus:outline-none focus:border-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative bg-white text-black py-5 uppercase tracking-widest font-black text-xs overflow-hidden hover:bg-vero-gold transition-colors duration-300 disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                    <>
                                        Access Dashboard
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[10px] text-zinc-600 uppercase tracking-widest">
                        Vero Egypt &Elegance &copy; 2026
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
