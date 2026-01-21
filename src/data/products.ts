import { Product } from '@/lib/store';

// Placeholder product data - will be replaced with Shopify data
export const products: Product[] = [
  {
    id: 'prod-1',
    handle: 'essential-oversized-hoodie-charcoal',
    title: 'Essential Oversized Hoodie',
    description: 'Our signature oversized hoodie crafted from premium 400GSM cotton fleece. Features a relaxed drop shoulder, kangaroo pocket, and ribbed cuffs. The perfect foundation for any wardrobe.',
    category: 'hoodies',
    collection: 'essentials',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v1-1', size: 'S', color: 'Charcoal', colorHex: '#36454F', price: 2499, available: true, sku: 'ESS-HOD-CHR-S' },
      { id: 'v1-2', size: 'M', color: 'Charcoal', colorHex: '#36454F', price: 2499, available: true, sku: 'ESS-HOD-CHR-M' },
      { id: 'v1-3', size: 'L', color: 'Charcoal', colorHex: '#36454F', price: 2499, available: true, sku: 'ESS-HOD-CHR-L' },
      { id: 'v1-4', size: 'XL', color: 'Charcoal', colorHex: '#36454F', price: 2499, available: false, sku: 'ESS-HOD-CHR-XL' },
      { id: 'v1-5', size: 'S', color: 'Off-White', colorHex: '#F5F5F0', price: 2499, available: true, sku: 'ESS-HOD-OFW-S' },
      { id: 'v1-6', size: 'M', color: 'Off-White', colorHex: '#F5F5F0', price: 2499, available: true, sku: 'ESS-HOD-OFW-M' },
      { id: 'v1-7', size: 'L', color: 'Off-White', colorHex: '#F5F5F0', price: 2499, available: true, sku: 'ESS-HOD-OFW-L' },
      { id: 'v1-8', size: 'XL', color: 'Off-White', colorHex: '#F5F5F0', price: 2499, available: true, sku: 'ESS-HOD-OFW-XL' },
    ],
    tags: ['oversized', 'hoodie', 'essentials', 'cotton'],
    isNew: false,
  },
  {
    id: 'prod-2',
    handle: 'cloud-heavyweight-hoodie-midnight',
    title: 'Cloud Heavyweight Hoodie',
    description: 'Experience unparalleled comfort with our Cloud Heavyweight Hoodie. 450GSM triple-brushed fleece interior, double-stitched seams, and an exaggerated oversized fit that drapes perfectly.',
    category: 'hoodies',
    collection: 'new-arrivals',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v2-1', size: 'S', color: 'Midnight', colorHex: '#191970', price: 2999, available: true, sku: 'CLD-HOD-MID-S' },
      { id: 'v2-2', size: 'M', color: 'Midnight', colorHex: '#191970', price: 2999, available: true, sku: 'CLD-HOD-MID-M' },
      { id: 'v2-3', size: 'L', color: 'Midnight', colorHex: '#191970', price: 2999, available: true, sku: 'CLD-HOD-MID-L' },
      { id: 'v2-4', size: 'XL', color: 'Midnight', colorHex: '#191970', price: 2999, available: true, sku: 'CLD-HOD-MID-XL' },
      { id: 'v2-5', size: 'S', color: 'Fog', colorHex: '#C4C4C4', price: 2999, available: true, sku: 'CLD-HOD-FOG-S' },
      { id: 'v2-6', size: 'M', color: 'Fog', colorHex: '#C4C4C4', price: 2999, available: true, sku: 'CLD-HOD-FOG-M' },
      { id: 'v2-7', size: 'L', color: 'Fog', colorHex: '#C4C4C4', price: 2999, available: false, sku: 'CLD-HOD-FOG-L' },
      { id: 'v2-8', size: 'XL', color: 'Fog', colorHex: '#C4C4C4', price: 2999, available: true, sku: 'CLD-HOD-FOG-XL' },
    ],
    tags: ['oversized', 'hoodie', 'heavyweight', 'premium'],
    isNew: true,
  },
  {
    id: 'prod-3',
    handle: 'relaxed-sweatpants-slate',
    title: 'Relaxed Sweatpants',
    description: 'The ultimate in relaxed luxury. These baggy sweatpants feature a high-rise waist with adjustable drawcord, deep pockets, and tapered ankle cuffs. Made from our signature soft-touch fleece.',
    category: 'sweatpants',
    collection: 'essentials',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v3-1', size: 'S', color: 'Slate', colorHex: '#708090', price: 1999, available: true, sku: 'RLX-SWP-SLT-S' },
      { id: 'v3-2', size: 'M', color: 'Slate', colorHex: '#708090', price: 1999, available: true, sku: 'RLX-SWP-SLT-M' },
      { id: 'v3-3', size: 'L', color: 'Slate', colorHex: '#708090', price: 1999, available: true, sku: 'RLX-SWP-SLT-L' },
      { id: 'v3-4', size: 'XL', color: 'Slate', colorHex: '#708090', price: 1999, available: true, sku: 'RLX-SWP-SLT-XL' },
      { id: 'v3-5', size: 'S', color: 'Obsidian', colorHex: '#0A0A0A', price: 1999, available: true, sku: 'RLX-SWP-OBS-S' },
      { id: 'v3-6', size: 'M', color: 'Obsidian', colorHex: '#0A0A0A', price: 1999, available: true, sku: 'RLX-SWP-OBS-M' },
      { id: 'v3-7', size: 'L', color: 'Obsidian', colorHex: '#0A0A0A', price: 1999, available: true, sku: 'RLX-SWP-OBS-L' },
      { id: 'v3-8', size: 'XL', color: 'Obsidian', colorHex: '#0A0A0A', price: 1999, available: false, sku: 'RLX-SWP-OBS-XL' },
    ],
    tags: ['sweatpants', 'relaxed', 'essentials', 'baggy'],
    isNew: false,
  },
  {
    id: 'prod-4',
    handle: 'wide-leg-cargo-sweatpants',
    title: 'Wide Leg Cargo Sweatpants',
    description: 'Utility meets comfort. Our Wide Leg Cargo Sweatpants feature oversized cargo pockets, an elastic waistband, and extra-wide leg opening. A statement piece for the bold.',
    category: 'sweatpants',
    collection: 'new-arrivals',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v4-1', size: 'S', color: 'Washed Black', colorHex: '#1A1A1A', price: 2499, available: true, sku: 'WLC-SWP-WBK-S' },
      { id: 'v4-2', size: 'M', color: 'Washed Black', colorHex: '#1A1A1A', price: 2499, available: true, sku: 'WLC-SWP-WBK-M' },
      { id: 'v4-3', size: 'L', color: 'Washed Black', colorHex: '#1A1A1A', price: 2499, available: true, sku: 'WLC-SWP-WBK-L' },
      { id: 'v4-4', size: 'XL', color: 'Washed Black', colorHex: '#1A1A1A', price: 2499, available: true, sku: 'WLC-SWP-WBK-XL' },
      { id: 'v4-5', size: 'S', color: 'Stone', colorHex: '#B8B4A8', price: 2499, available: true, sku: 'WLC-SWP-STN-S' },
      { id: 'v4-6', size: 'M', color: 'Stone', colorHex: '#B8B4A8', price: 2499, available: true, sku: 'WLC-SWP-STN-M' },
      { id: 'v4-7', size: 'L', color: 'Stone', colorHex: '#B8B4A8', price: 2499, available: true, sku: 'WLC-SWP-STN-L' },
      { id: 'v4-8', size: 'XL', color: 'Stone', colorHex: '#B8B4A8', price: 2499, available: true, sku: 'WLC-SWP-STN-XL' },
    ],
    tags: ['sweatpants', 'cargo', 'wide-leg', 'statement'],
    isNew: true,
  },
  {
    id: 'prod-5',
    handle: 'zip-up-hoodie-graphite',
    title: 'Essential Zip-Up Hoodie',
    description: 'A refined take on the classic zip-up. Features a full-length YKK zipper, split kangaroo pockets, and our signature oversized fit. Finished with subtle VERO branding.',
    category: 'hoodies',
    collection: 'essentials',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v5-1', size: 'S', color: 'Graphite', colorHex: '#383838', price: 2799, available: true, sku: 'ESS-ZIP-GRP-S' },
      { id: 'v5-2', size: 'M', color: 'Graphite', colorHex: '#383838', price: 2799, available: true, sku: 'ESS-ZIP-GRP-M' },
      { id: 'v5-3', size: 'L', color: 'Graphite', colorHex: '#383838', price: 2799, available: true, sku: 'ESS-ZIP-GRP-L' },
      { id: 'v5-4', size: 'XL', color: 'Graphite', colorHex: '#383838', price: 2799, available: true, sku: 'ESS-ZIP-GRP-XL' },
    ],
    tags: ['zip-up', 'hoodie', 'essentials'],
    isNew: false,
  },
  {
    id: 'prod-6',
    handle: 'embroidered-logo-hoodie',
    title: 'Embroidered Logo Hoodie',
    description: 'Subtle branding at its finest. This oversized hoodie features a tone-on-tone embroidered VERO logo on the chest. 420GSM heavyweight cotton with a brushed interior.',
    category: 'hoodies',
    collection: 'new-arrivals',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v6-1', size: 'S', color: 'Cream', colorHex: '#FFFDD0', price: 2899, available: true, sku: 'EMB-HOD-CRM-S' },
      { id: 'v6-2', size: 'M', color: 'Cream', colorHex: '#FFFDD0', price: 2899, available: true, sku: 'EMB-HOD-CRM-M' },
      { id: 'v6-3', size: 'L', color: 'Cream', colorHex: '#FFFDD0', price: 2899, available: false, sku: 'EMB-HOD-CRM-L' },
      { id: 'v6-4', size: 'XL', color: 'Cream', colorHex: '#FFFDD0', price: 2899, available: true, sku: 'EMB-HOD-CRM-XL' },
      { id: 'v6-5', size: 'S', color: 'Black', colorHex: '#0A0A0A', price: 2899, available: true, sku: 'EMB-HOD-BLK-S' },
      { id: 'v6-6', size: 'M', color: 'Black', colorHex: '#0A0A0A', price: 2899, available: true, sku: 'EMB-HOD-BLK-M' },
      { id: 'v6-7', size: 'L', color: 'Black', colorHex: '#0A0A0A', price: 2899, available: true, sku: 'EMB-HOD-BLK-L' },
      { id: 'v6-8', size: 'XL', color: 'Black', colorHex: '#0A0A0A', price: 2899, available: true, sku: 'EMB-HOD-BLK-XL' },
    ],
    tags: ['embroidered', 'logo', 'hoodie', 'premium'],
    isNew: true,
  },
  {
    id: 'prod-7',
    handle: 'classic-joggers',
    title: 'Classic Joggers',
    description: 'Everyday joggers elevated. Made from our softest French terry with a relaxed fit, elasticated cuffs, and discreet side pockets. The perfect complement to any VERO top.',
    category: 'sweatpants',
    collection: 'essentials',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v7-1', size: 'S', color: 'Charcoal', colorHex: '#36454F', price: 1799, available: true, sku: 'CLS-JOG-CHR-S' },
      { id: 'v7-2', size: 'M', color: 'Charcoal', colorHex: '#36454F', price: 1799, available: true, sku: 'CLS-JOG-CHR-M' },
      { id: 'v7-3', size: 'L', color: 'Charcoal', colorHex: '#36454F', price: 1799, available: true, sku: 'CLS-JOG-CHR-L' },
      { id: 'v7-4', size: 'XL', color: 'Charcoal', colorHex: '#36454F', price: 1799, available: true, sku: 'CLS-JOG-CHR-XL' },
      { id: 'v7-5', size: 'S', color: 'Heather Grey', colorHex: '#9E9E9E', price: 1799, available: true, sku: 'CLS-JOG-HGR-S' },
      { id: 'v7-6', size: 'M', color: 'Heather Grey', colorHex: '#9E9E9E', price: 1799, available: true, sku: 'CLS-JOG-HGR-M' },
      { id: 'v7-7', size: 'L', color: 'Heather Grey', colorHex: '#9E9E9E', price: 1799, available: true, sku: 'CLS-JOG-HGR-L' },
      { id: 'v7-8', size: 'XL', color: 'Heather Grey', colorHex: '#9E9E9E', price: 1799, available: true, sku: 'CLS-JOG-HGR-XL' },
    ],
    tags: ['joggers', 'classic', 'essentials', 'everyday'],
    isNew: false,
  },
  {
    id: 'prod-8',
    handle: 'vintage-washed-hoodie',
    title: 'Vintage Washed Hoodie',
    description: 'Pre-washed for that lived-in feel from day one. This oversized hoodie features a unique sun-faded wash, distressed edges, and ultra-soft hand feel. Each piece is slightly unique.',
    category: 'hoodies',
    collection: 'new-arrivals',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v8-1', size: 'S', color: 'Faded Black', colorHex: '#2A2A2A', price: 3199, available: true, sku: 'VNT-HOD-FBK-S' },
      { id: 'v8-2', size: 'M', color: 'Faded Black', colorHex: '#2A2A2A', price: 3199, available: true, sku: 'VNT-HOD-FBK-M' },
      { id: 'v8-3', size: 'L', color: 'Faded Black', colorHex: '#2A2A2A', price: 3199, available: true, sku: 'VNT-HOD-FBK-L' },
      { id: 'v8-4', size: 'XL', color: 'Faded Black', colorHex: '#2A2A2A', price: 3199, available: false, sku: 'VNT-HOD-FBK-XL' },
      { id: 'v8-5', size: 'S', color: 'Washed Clay', colorHex: '#B4846C', price: 3199, available: true, sku: 'VNT-HOD-WCL-S' },
      { id: 'v8-6', size: 'M', color: 'Washed Clay', colorHex: '#B4846C', price: 3199, available: true, sku: 'VNT-HOD-WCL-M' },
      { id: 'v8-7', size: 'L', color: 'Washed Clay', colorHex: '#B4846C', price: 3199, available: true, sku: 'VNT-HOD-WCL-L' },
      { id: 'v8-8', size: 'XL', color: 'Washed Clay', colorHex: '#B4846C', price: 3199, available: true, sku: 'VNT-HOD-WCL-XL' },
    ],
    tags: ['vintage', 'washed', 'hoodie', 'limited'],
    isNew: true,
  },
  {
    id: 'prod-9',
    handle: 'heavyweight-track-pants',
    title: 'Heavyweight Track Pants',
    description: 'Athletic heritage reimagined. These heavyweight track pants feature contrast side piping, an elasticated waist with internal drawcord, and zippered ankle closures.',
    category: 'sweatpants',
    collection: 'new-arrivals',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v9-1', size: 'S', color: 'Black/White', colorHex: '#0A0A0A', price: 2299, available: true, sku: 'HWT-TRK-BKW-S' },
      { id: 'v9-2', size: 'M', color: 'Black/White', colorHex: '#0A0A0A', price: 2299, available: true, sku: 'HWT-TRK-BKW-M' },
      { id: 'v9-3', size: 'L', color: 'Black/White', colorHex: '#0A0A0A', price: 2299, available: true, sku: 'HWT-TRK-BKW-L' },
      { id: 'v9-4', size: 'XL', color: 'Black/White', colorHex: '#0A0A0A', price: 2299, available: true, sku: 'HWT-TRK-BKW-XL' },
      { id: 'v9-5', size: 'S', color: 'Navy/Cream', colorHex: '#1C2841', price: 2299, available: true, sku: 'HWT-TRK-NVC-S' },
      { id: 'v9-6', size: 'M', color: 'Navy/Cream', colorHex: '#1C2841', price: 2299, available: true, sku: 'HWT-TRK-NVC-M' },
      { id: 'v9-7', size: 'L', color: 'Navy/Cream', colorHex: '#1C2841', price: 2299, available: true, sku: 'HWT-TRK-NVC-L' },
      { id: 'v9-8', size: 'XL', color: 'Navy/Cream', colorHex: '#1C2841', price: 2299, available: true, sku: 'HWT-TRK-NVC-XL' },
    ],
    tags: ['track', 'pants', 'athletic', 'heavyweight'],
    isNew: true,
  },
  {
    id: 'prod-10',
    handle: 'boxy-crewneck-sweater',
    title: 'Boxy Crewneck Sweater',
    description: 'A modern interpretation of the classic crewneck. Features an exaggerated boxy silhouette, dropped shoulders, and ribbed trim. Perfect layering piece for any season.',
    category: 'hoodies',
    collection: 'essentials',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    variants: [
      { id: 'v10-1', size: 'S', color: 'Oatmeal', colorHex: '#C9B99A', price: 2199, available: true, sku: 'BXY-CRW-OAT-S' },
      { id: 'v10-2', size: 'M', color: 'Oatmeal', colorHex: '#C9B99A', price: 2199, available: true, sku: 'BXY-CRW-OAT-M' },
      { id: 'v10-3', size: 'L', color: 'Oatmeal', colorHex: '#C9B99A', price: 2199, available: true, sku: 'BXY-CRW-OAT-L' },
      { id: 'v10-4', size: 'XL', color: 'Oatmeal', colorHex: '#C9B99A', price: 2199, available: true, sku: 'BXY-CRW-OAT-XL' },
      { id: 'v10-5', size: 'S', color: 'Espresso', colorHex: '#3C2415', price: 2199, available: true, sku: 'BXY-CRW-ESP-S' },
      { id: 'v10-6', size: 'M', color: 'Espresso', colorHex: '#3C2415', price: 2199, available: true, sku: 'BXY-CRW-ESP-M' },
      { id: 'v10-7', size: 'L', color: 'Espresso', colorHex: '#3C2415', price: 2199, available: false, sku: 'BXY-CRW-ESP-L' },
      { id: 'v10-8', size: 'XL', color: 'Espresso', colorHex: '#3C2415', price: 2199, available: true, sku: 'BXY-CRW-ESP-XL' },
    ],
    tags: ['crewneck', 'sweater', 'boxy', 'essentials'],
    isNew: false,
  },
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
  return ['S', 'M', 'L', 'XL'];
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
};
