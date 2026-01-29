import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Layers, Users, DollarSign, Activity, Clock, Filter, ShoppingCart, Settings, Trash2, PlusCircle, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/hooks/useProducts';
import { useCollections } from '@/hooks/useCollections';
import { useActiveUserCount } from '@/hooks/usePresence';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useActivityLog } from '@/hooks/useActivityLog';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-sm">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-sm bg-${color}-500/10 text-${color}-500`}>
                <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live</span>
        </div>
        <h3 className="text-2xl font-black text-white mb-1">{value}</h3>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">{title}</p>
    </div>
);

const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'ORDER_PLACED': return <ShoppingCart className="h-4 w-4 text-vero-gold" />;
        case 'STATUS_UPDATED': return <Activity className="h-4 w-4 text-blue-500" />;
        case 'PRODUCT_CREATED': return <PlusCircle className="h-4 w-4 text-green-500" />;
        case 'PRODUCT_UPDATED': return <Settings className="h-4 w-4 text-purple-500" />;
        case 'PRODUCT_DELETED':
        case 'ORDER_DELETED': return <Trash2 className="h-4 w-4 text-red-500" />;
        case 'FEEDBACK_SUBMITTED': return <MessageSquare className="h-4 w-4 text-yellow-500" />;
        default: return <Clock className="h-4 w-4 text-zinc-500" />;
    }
};

export default function AdminDashboard() {
    const { products } = useProducts();
    const { collections } = useCollections();
    const activeUsers = useActiveUserCount();
    const { language } = useUIStore();

    const [activities, setActivities] = useState<any[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [timeRange, setTimeRange] = useState<'24h' | '10d' | '30d'>('24h');
    const { logActivity } = useActivityLog();
    const { t } = useTranslation();

    const fetchActivities = async () => {
        setLoadingActivities(true);
        const now = new Date();
        let startDate = new Date();

        if (timeRange === '24h') startDate.setHours(now.getHours() - 24);
        else if (timeRange === '10d') startDate.setDate(now.getDate() - 10);
        else if (timeRange === '30d') startDate.setDate(now.getDate() - 30);

        const { data, error } = await supabase
            .from('system_activities')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: false })
            .limit(50);

        if (!error) setActivities(data || []);
        setLoadingActivities(false);
    };

    useEffect(() => {
        fetchActivities();

        // Subscription for real-time updates
        const channel = supabase
            .channel('system_activities_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_activities' }, (payload) => {
                setActivities(prev => [payload.new, ...prev].slice(0, 50));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [timeRange]);

    const handleClearAll = async () => {
        if (!confirm('Are you sure you want to delete ALL activity history? This cannot be undone.')) return;

        try {
            // Delete all records from system_activities
            const { error } = await supabase
                .from('system_activities')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

            if (error) throw error;

            setActivities([]);
            toast.success('Activity history cleared successfully');

            // Log this action (optional but recommended for accountability)
            await logActivity({
                type: 'ORDER_DELETED', // Or add a generic 'SYSTEM_CLEARED'
                description_en: 'Admin cleared all activity history',
                description_ar: 'قام المشرف بمسح جميع سجلات النشاط',
                metadata: { action: 'clear_all' }
            });

        } catch (error: any) {
            console.error('Clear error:', error);
            toast.error(error.message || 'Failed to clear activity history');
        }
    };

    const margins = products.flatMap(p => p.variants)
        .filter(v => v.costPrice && v.price > 0)
        .map(v => ((v.price - v.costPrice!) / v.price) * 100);

    const avgMargin = margins.length > 0
        ? (margins.reduce((a, b) => a + b, 0) / margins.length).toFixed(1) + '%'
        : '0%';

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="heading-2 uppercase tracking-tight text-white mb-2">{t('admin.dashboard')}</h1>
                    <p className="text-zinc-500 text-sm">Welcome back to the Vero control center.</p>
                </div>
                <div className="flex bg-zinc-900 border border-white/5 rounded-sm p-1">
                    {(['24h', '10d', '30d'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                timeRange === range ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title={t('admin.totalProducts')} value={products.length} icon={Package} color="blue" />
                <StatCard title={t('admin.collections')} value={collections.length} icon={Layers} color="purple" />
                <StatCard title={t('admin.activeUsers')} value={activeUsers} icon={Users} color="green" />
                <StatCard title={t('admin.grossMargin')} value={avgMargin} icon={DollarSign} color="vero-gold" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-sm flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <Activity className="h-4 w-4 text-vero-gold" />
                            {t('admin.recentActivity')}
                        </h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleClearAll}
                                className="text-[10px] text-zinc-500 hover:text-red-500 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                                title={t('admin.clearAll')}
                            >
                                <Trash2 className="h-3 w-3" />
                                {t('admin.clearAll')}
                            </button>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest border-l border-white/10 pl-4">
                                {t('admin.last')} {timeRange}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto pr-2 max-h-[500px] scrollbar-hide">
                        {loadingActivities ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
                                <Activity className="h-8 w-8 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t('admin.fetchingLogs')}</span>
                            </div>
                        ) : activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.map((activity, idx) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-sm hover:border-white/10 transition-all group"
                                    >
                                        <div className="mt-1 p-2 rounded-sm bg-zinc-950 border border-white/10">
                                            <ActivityIcon type={activity.type} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-white font-medium mb-1 truncate">
                                                {language === 'ar' ? activity.description_ar : activity.description_en}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDistanceToNow(new Date(activity.created_at), {
                                                        addSuffix: true,
                                                        locale: language === 'ar' ? ar : enUS
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest bg-zinc-950 px-1.5 py-0.5 rounded border border-white/5">
                                                        {activity.type.replace('_', ' ')}
                                                    </span>
                                                    {activity.admin_email && (
                                                        <span className="text-[9px] text-vero-gold/70 font-bold lowercase tracking-wider bg-vero-gold/5 px-1.5 py-0.5 rounded border border-vero-gold/10">
                                                            {activity.admin_email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
                                <Filter className="h-8 w-8" />
                                <span className="text-[10px] font-bold uppercase tracking-widest italic">{t('admin.noActivity')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-500" />
                        {t('admin.systemStatus')}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/[0.01] transition-colors rounded-sm px-2">
                            <span className="text-xs text-zinc-400">Database Connection</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-green-500 font-bold uppercase">Healthy</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/[0.01] transition-colors rounded-sm px-2">
                            <span className="text-xs text-zinc-400">Storage Bucket (CDN)</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-green-500 font-bold uppercase">Active</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/[0.01] transition-colors rounded-sm px-2">
                            <span className="text-xs text-zinc-400">Auth Service</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-green-500 font-bold uppercase">Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
