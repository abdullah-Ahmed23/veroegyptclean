import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, useUIStore } from '@/lib/store';

export const useProduct = (handle: string | undefined) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { language } = useUIStore();

    useEffect(() => {
        if (!handle) return;

        const fetchProduct = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          categories (handle, title_en, title_ar),
          collections (handle, title_en, title_ar),
          product_variants (*)
        `)
                .eq('handle', handle)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
                return;
            }

            if (data) {
                const mappedProduct: Product = {
                    id: data.id,
                    handle: data.handle,
                    title: language === 'ar' ? data.title_ar : data.title_en,
                    title_en: data.title_en,
                    title_ar: data.title_ar,
                    description: language === 'ar' ? data.description_ar : data.description_en,
                    description_en: data.description_en,
                    description_ar: data.description_ar,
                    category: data.categories?.handle || '',
                    collection: data.collections?.handle || '',
                    images: data.images || [],
                    tags: data.tags || [],
                    isNew: data.is_new,
                    variants: data.product_variants.map((v: any) => ({
                        id: v.id,
                        sku: v.sku,
                        size: v.size,
                        color: language === 'ar' ? v.color_ar : v.color_en,
                        colorHex: v.color_hex,
                        price: v.price / 100,
                        compareAtPrice: v.compare_at_price ? v.compare_at_price / 100 : undefined,
                        available: v.stock_quantity > 0,
                        stock: v.stock_quantity,
                        image_url: v.image_url,
                    })),
                };
                setProduct(mappedProduct);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [handle, language]);

    return { product, loading };
};
