import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/authStore';

export type ActivityType =
    | 'ORDER_PLACED'
    | 'DESIGN_SUBMITTED'
    | 'STATUS_UPDATED'
    | 'ORDER_DELETED'
    | 'PRODUCT_CREATED'
    | 'PRODUCT_UPDATED'
    | 'PRODUCT_DELETED'
    | 'FEEDBACK_SUBMITTED'
    | 'PAYMENT_PROOF_UPLOADED';

interface LogParams {
    type: ActivityType;
    description_en: string;
    description_ar: string;
    metadata?: any;
}

export const useActivityLog = () => {
    const { user } = useAuthStore();

    const logActivity = async ({ type, description_en, description_ar, metadata = {} }: LogParams) => {
        try {
            const { error } = await supabase
                .from('system_activities')
                .insert({
                    type,
                    description_en,
                    description_ar,
                    metadata,
                    admin_id: user?.id || null,
                    admin_email: user?.email || null
                });

            if (error) {
                console.error('Error logging activity:', error);
            }
        } catch (err) {
            console.error('Failed to log activity:', err);
        }
    };

    return { logActivity };
};
