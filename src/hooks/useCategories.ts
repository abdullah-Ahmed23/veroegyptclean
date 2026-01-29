import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/lib/store';

export interface Category {
    id: string;
    handle: string;
    title: string;
    description: string;
}

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { language } = useUIStore();

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('title_en', { ascending: true });

            if (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
                return;
            }

            if (data) {
                const mappedCategories: Category[] = data.map((c: any) => ({
                    id: c.id,
                    handle: c.handle,
                    title: language === 'ar' ? c.title_ar : c.title_en,
                    description: (language === 'ar' ? c.description_ar : c.description_en) || '',
                }));
                setCategories(mappedCategories);
            }
            setLoading(false);
        };

        fetchCategories();
    }, [language]);

    return { categories, loading };
};
