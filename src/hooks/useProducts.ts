import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, useUIStore } from '@/lib/store';

export const useProducts = (collectionHandle?: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { language } = useUIStore();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            let query = supabase
                .from('products')
                .select(`
          *,
          categories (handle, title_en, title_ar),
          collections (handle, title_en, title_ar),
          product_variants (*)
        `)
                .eq('is_published', true);

            if (collectionHandle && collectionHandle !== 'all') {
                // This is a bit tricky since products can be in a collection OR a category
                // In the static data, it filters by both.
                // We'll need to fetch and then filter or do a more complex query.
                // For now, let's fetch all and filter client-side to keep it simple and consistent with current logic.
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
                return;
            }

            if (data) {
                const mappedProducts: Product[] = data.map((p: any) => ({
                    id: p.id,
                    handle: p.handle,
                    title: language === 'ar' ? p.title_ar : p.title_en,
                    title_en: p.title_en,
                    title_ar: p.title_ar,
                    description: language === 'ar' ? p.description_ar : p.description_en,
                    description_en: p.description_en,
                    description_ar: p.description_ar,
                    category: p.categories?.handle || '',
                    collection: p.collections?.handle || '',
                    images: p.images || [],
                    tags: p.tags || [],
                    isNew: p.is_new,
                    variants: p.product_variants.map((v: any) => ({
                        id: v.id,
                        sku: v.sku,
                        size: v.size,
                        color: language === 'ar' ? v.color_ar : v.color_en,
                        colorHex: v.color_hex,
                        price: v.price / 100, // Assuming cents to EGP unit conversion if stored as cents
                        costPrice: v.cost_price ? v.cost_price / 100 : undefined,
                        compareAtPrice: v.compare_at_price ? v.compare_at_price / 100 : undefined,
                        available: v.stock_quantity > 0,
                        stock: v.stock_quantity,
                        image_url: v.image_url,
                    })),
                }));

                if (collectionHandle === 'new-arrivals') {
                    setProducts(mappedProducts.filter(p => p.isNew || p.collection === 'new-arrivals'));
                } else if (collectionHandle && collectionHandle !== 'all') {
                    setProducts(mappedProducts.filter(p => p.collection === collectionHandle || p.category === collectionHandle));
                } else {
                    setProducts(mappedProducts);
                }
            }
            setLoading(false);
        };

        fetchProducts();
    }, [language, collectionHandle]);

    return { products, loading };
};
