import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/lib/store';

export interface Collection {
    handle: string;
    title: string;
    description: string;
    comingSoon?: boolean;
}

export const useCollections = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const { language } = useUIStore();

    useEffect(() => {
        const fetchCollections = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching collections:', error);
                setLoading(false);
                return;
            }

            if (data) {
                const mappedCollections: Collection[] = data.map((c: any) => ({
                    handle: c.handle,
                    title: language === 'ar' ? c.title_ar : c.title_en,
                    description: (language === 'ar' ? c.description_ar : c.description_en) || '',
                    comingSoon: c.coming_soon,
                }));
                setCollections(mappedCollections);
            }
            setLoading(false);
        };

        fetchCollections();
    }, [language]);

    return { collections, loading };
};
