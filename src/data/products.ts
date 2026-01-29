import { Product } from '@/lib/store';

const COLORS_PALETTE = [
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'darkTeal', name: 'Dark Teal', hex: '#045D5D' },
  { id: 'offWhite', name: 'Off-White', hex: '#FAF9F6' },
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'lightRose', name: 'Light Rose', hex: '#F4D4D6' },
];

const SIZES_PALETTE = ['1X', '2X', '3X'];

// Placeholder product data - will be replaced with Shopify data
export const products: Product[] = [
  {
    id: 'prod-1',
    handle: 'essential-oversized-hoodie',
    title: 'Essential Oversized Hoodie',
    title_en: 'Essential Oversized Hoodie',
    title_ar: 'هوديز أوفرسايز أساسي',
    description: 'Our signature oversized hoodie crafted from premium 400GSM cotton fleece. Features a relaxed drop shoulder, kangaroo pocket, and ribbed cuffs. The perfect foundation for any wardrobe.',
    description_en: 'Our signature oversized hoodie crafted from premium 400GSM cotton fleece. Features a relaxed drop shoulder, kangaroo pocket, and ribbed cuffs. The perfect foundation for any wardrobe.',
    description_ar: 'هوديز أوفرسايز المميز لدينا مصنوع من صوف قطني فاخر بوزن 400 جرام لكل متر مربع. يتميز بأكتاف منسدلة مريحة وجيب كنغر وأساور مضلعة. الأساس المثالي لأي خزانة ملابس.',
    category: 'hoodies',
    collection: 'essentials',
    images: ['/placeholder.svg', '/placeholder.svg'],
    variants: COLORS_PALETTE.flatMap(color =>
      SIZES_PALETTE.map(size => ({
        id: `v1-${color.id}-${size}`,
        size,
        color: color.name,
        colorHex: color.hex,
        price: 2499,
        available: true,
        stock: 10,
        sku: `ESS-HOD-${color.id.toUpperCase()}-${size}`
      }))
    ),
    tags: ['oversized', 'hoodie', 'essentials', 'cotton'],
    isNew: false,
  },
  {
    id: 'prod-2',
    handle: 'cloud-heavyweight-hoodie',
    title: 'Cloud Heavyweight Hoodie',
    title_en: 'Cloud Heavyweight Hoodie',
    title_ar: 'كلوود هوديز ثقيل',
    description: 'Experience unparalleled comfort with our Cloud Heavyweight Hoodie. 450GSM triple-brushed fleece interior, double-stitched seams, and an exaggerated oversized fit that drapes perfectly.',
    description_en: 'Experience unparalleled comfort with our Cloud Heavyweight Hoodie. 450GSM triple-brushed fleece interior, double-stitched seams, and an exaggerated oversized fit that drapes perfectly.',
    description_ar: 'استمتع براحة لا مثيل لها مع كلوود هوديز الثقيل. جزء داخلي من الصوف الممشط ثلاثياً بوزن 450 جرام لكل متر مربع، وطبقات بخياطة مزدوجة، وقصة أوفرسايز مبالغ فيها تنسدل بشكل مثالي.',
    category: 'hoodies',
    collection: 'new-arrivals',
    images: ['/placeholder.svg', '/placeholder.svg'],
    variants: COLORS_PALETTE.slice(0, 3).flatMap(color =>
      SIZES_PALETTE.map(size => ({
        id: `v2-${color.id}-${size}`,
        size,
        color: color.name,
        colorHex: color.hex,
        price: 2999,
        available: true,
        stock: 5,
        sku: `CLD-HOD-${color.id.toUpperCase()}-${size}`
      }))
    ),
    tags: ['oversized', 'hoodie', 'heavyweight', 'premium'],
    isNew: true,
  },
  {
    id: 'prod-3',
    handle: 'relaxed-sweatpants',
    title: 'Relaxed Sweatpants',
    title_en: 'Relaxed Sweatpants',
    title_ar: 'بنطال رياضي مريح',
    description: 'The ultimate in relaxed luxury. These baggy sweatpants feature a high-rise waist with adjustable drawcord, deep pockets, and tapered ankle cuffs. Made from our signature soft-touch fleece.',
    description_en: 'The ultimate in relaxed luxury. These baggy sweatpants feature a high-rise waist with adjustable drawcord, deep pockets, and tapered ankle cuffs. Made from our signature soft-touch fleece.',
    description_ar: 'قمة الراحة والاسترخاء. يتميز هذا البنطال الرياضي الواسع بخصر مرتفع مع رباط قابل للتعديل وجيوب عميقة وأساور كاحل مدببة. مصنوع من الصوف الناعم المميز لدينا.',
    category: 'sweatpants',
    collection: 'essentials',
    images: ['/placeholder.svg', '/placeholder.svg'],
    variants: [COLORS_PALETTE[0], COLORS_PALETTE[2]].flatMap(color =>
      SIZES_PALETTE.map(size => ({
        id: `v3-${color.id}-${size}`,
        size,
        color: color.name,
        colorHex: color.hex,
        price: 1999,
        available: true,
        stock: 15,
        sku: `RLX-SWP-${color.id.toUpperCase()}-${size}`
      }))
    ),
    tags: ['sweatpants', 'relaxed', 'essentials', 'baggy'],
    isNew: false,
  }
];

// Collection data
export const collections = [
  {
    handle: 'new-arrivals',
    title: 'New Arrivals',
    titleAr: 'وصل حديثاً',
    description: 'The latest additions to our collection. Fresh styles, premium quality.',
    descriptionAr: 'أحدث الإضافات لمجموعتنا. أساليب جديدة، جودة عالية.',
  },
  {
    handle: 'essentials',
    title: 'Essentials',
    titleAr: 'الأساسيات',
    description: 'Timeless pieces that form the foundation of your wardrobe.',
    descriptionAr: 'قطع خالدة تشكل أساس خزانة ملابسك.',
  },
  {
    handle: 'hoodies',
    title: 'Oversized Hoodies',
    titleAr: 'هوديز أوفرسايز',
    description: 'Our signature oversized hoodies. Comfort meets luxury.',
    descriptionAr: 'هوديز أوفرسايز المميزة لدينا. الراحة تلتقي بالفخامة.',
  },
  {
    handle: 'sweatpants',
    title: 'Sweatpants',
    titleAr: 'بناطيل رياضية',
    description: 'Relaxed fits and premium materials for everyday luxury.',
    descriptionAr: 'قصات مريحة وخامات فاخرة للفخامة اليومية.',
  },
  {
    handle: 'footwear',
    title: 'Footwear',
    titleAr: 'أحذية',
    description: 'Coming soon. Premium footwear to complete your look.',
    descriptionAr: 'قريباً. أحذية فاخرة لإكمال إطلالتك.',
    comingSoon: true,
  },
  {
    handle: 'accessories',
    title: 'Accessories',
    titleAr: 'إكسسوارات',
    description: 'Coming soon. The finishing touches for the discerning.',
    descriptionAr: 'قريباً. اللمسات الأخيرة للمميزين.',
    comingSoon: true,
  },
];

// Helper functions
export const getProductByHandle = (handle: string): Product | undefined => {
  return products.find(p => p.handle === handle);
};

export const getProductsByCollection = (collectionHandle: string): Product[] => {
  if (collectionHandle === 'all') return products;
  return products.filter(p => p.collection === collectionHandle || p.category === collectionHandle);
};

export const getUniqueColors = (): string[] => {
  const colors = new Set<string>();
  products.forEach(p => {
    p.variants.forEach(v => colors.add(v.color));
  });
  return Array.from(colors);
};

export const getUniqueSizes = (): string[] => {
  return SIZES_PALETTE;
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.title_en.toLowerCase().includes(lowerQuery) ||
    p.title_ar.includes(lowerQuery) ||
    p.description_en.toLowerCase().includes(lowerQuery) ||
    p.description_ar.includes(lowerQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
};
