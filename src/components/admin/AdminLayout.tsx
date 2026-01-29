import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LineChart,
    Package,
    Layers,
    Settings,
    LogOut,
    Plus,
    Menu,
    X,
    Home,
    ShoppingBag,
    Palette,
    MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAutoLogout } from '@/hooks/useAutoLogout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Track inactivity and auto-logout
    useAutoLogout();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                navigate('/admin/login');
            } else {
                // Check for admin role
                const isAdmin = user.app_metadata?.role === 'admin';
                if (!isAdmin) {
                    signOut();
                    navigate('/admin/login');
                    console.warn('Unauthorized access attempt to admin panel');
                }
            }
        }
    }, [user, isLoading, navigate, signOut]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-vero-gold" />
            </div>
        );
    }

    if (!user) return null;

    const menuItems = [
        { title: 'Overview', icon: LineChart, path: '/admin' },
        { title: 'Products', icon: Package, path: '/admin/products' },
        { title: 'Categories', icon: Layers, path: '/admin/categories' },
        { title: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
        { title: 'Custom Designs', icon: Palette, path: '/admin/custom-designs' },
        { title: 'Feedbacks', icon: MessageSquare, path: '/admin/feedbacks' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-zinc-900/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between">
                        <h1 className={cn("font-black tracking-tighter transition-all", isSidebarOpen ? "text-2xl" : "text-0 opacity-0")}>
                            VERO <span className="text-vero-gold text-xs font-bold uppercase tracking-widest block">ADMIN</span>
                        </h1>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-sm">
                            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-8 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all group",
                                    location.pathname === item.path
                                        ? "bg-white text-black"
                                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {isSidebarOpen && <span>{item.title}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/5 space-y-2">
                        <Link
                            to="/"
                            className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Home className="h-5 w-5" />
                            {isSidebarOpen && <span>Main Site</span>}
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-4 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all text-left"
                        >
                            <LogOut className="h-5 w-5" />
                            {isSidebarOpen && <span>Log Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            <main
                className={cn(
                    "flex-1 transition-all duration-300",
                    isSidebarOpen ? "pl-64" : "pl-20"
                )}
            >
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
