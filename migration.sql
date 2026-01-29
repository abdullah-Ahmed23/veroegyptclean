-- Migration Script for Vero Egypt Data

-- 1. Insert Categories
INSERT INTO categories (handle, title_en, title_ar) VALUES
('hoodies', 'Oversized Hoodies', 'هوديز أوفرسايز'),
('sweatpants', 'Sweatpants', 'بناطيل رياضية')
ON CONFLICT (handle) DO NOTHING;

-- 2. Insert Collections
INSERT INTO collections (handle, title_en, title_ar, description_en, description_ar, coming_soon) VALUES
('new-arrivals', 'New Arrivals', 'وصل حديثاً', 'The latest additions to our collection. Fresh styles, premium quality.', 'أحدث الإضافات لمجموعتنا. أساليب جديدة، جودة عالية.', false),
('essentials', 'Essentials', 'الأساسيات', 'Timeless pieces that form the foundation of your wardrobe.', 'قطع خالدة تشكل أساس خزانة ملابسك.', false),
('footwear', 'Footwear', 'أحذية', 'Coming soon. Premium footwear to complete your look.', 'قريباً. أحذية فاخرة لإكمال إطلالتك.', true),
('accessories', 'Accessories', 'إكسسوارات', 'Coming soon. The finishing touches for the discerning.', 'قريباً. اللمسات الأخيرة للمميزين.', true)
ON CONFLICT (handle) DO NOTHING;

-- 3. Insert Products and Variants

-- Product 1: Essential Oversized Hoodie
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'hoodies';
    SELECT id INTO col_id FROM collections WHERE handle = 'essentials';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('essential-oversized-hoodie-charcoal', 'Essential Oversized Hoodie', 'هوديي أساسي أوفرسايز', 'Our signature oversized hoodie crafted from premium 400GSM cotton fleece.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['oversized', 'hoodie', 'essentials', 'cotton'], false)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'ESS-HOD-CHR-S', 'S', 'Charcoal', 'فحمي', '#36454F', 249900, 10),
    (prod_id, 'ESS-HOD-CHR-M', 'M', 'Charcoal', 'فحمي', '#36454F', 249900, 10),
    (prod_id, 'ESS-HOD-CHR-L', 'L', 'Charcoal', 'فحمي', '#36454F', 249900, 10),
    (prod_id, 'ESS-HOD-OFW-S', 'S', 'Off-White', 'أبيض مطفي', '#F5F5F0', 249900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 2: Cloud Heavyweight Hoodie
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'hoodies';
    SELECT id INTO col_id FROM collections WHERE handle = 'new-arrivals';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('cloud-heavyweight-hoodie-midnight', 'Cloud Heavyweight Hoodie', 'كلاود هوديي ثقيل', 'Experience unparalleled comfort with our Cloud Heavyweight Hoodie.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['oversized', 'hoodie', 'heavyweight', 'premium'], true)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'CLD-HOD-MID-S', 'S', 'Midnight', 'منتصف الليل', '#191970', 299900, 10),
    (prod_id, 'CLD-HOD-FOG-S', 'S', 'Fog', 'ضبابي', '#C4C4C4', 299900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 3: Relaxed Sweatpants
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'sweatpants';
    SELECT id INTO col_id FROM collections WHERE handle = 'essentials';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('relaxed-sweatpants-slate', 'Relaxed Sweatpants', 'بنطال رياضي مريح', 'The ultimate in relaxed luxury.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['sweatpants', 'relaxed', 'essentials', 'baggy'], false)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'RLX-SWP-SLT-S', 'S', 'Slate', 'رمادي صخري', '#708090', 199900, 10),
    (prod_id, 'RLX-SWP-OBS-S', 'S', 'Obsidian', 'أوبسيديان', '#0A0A0A', 199900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 4: Wide Leg Cargo Sweatpants
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'sweatpants';
    SELECT id INTO col_id FROM collections WHERE handle = 'new-arrivals';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('wide-leg-cargo-sweatpants', 'Wide Leg Cargo Sweatpants', 'بنطال كارغو واسع', 'Utility meets comfort.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['sweatpants', 'cargo', 'wide-leg', 'statement'], true)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'WLC-SWP-WBK-S', 'S', 'Washed Black', 'أسود مغسول', '#1A1A1A', 249900, 10),
    (prod_id, 'WLC-SWP-STN-S', 'S', 'Stone', 'حجري', '#B8B4A8', 249900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 5: Essential Zip-Up Hoodie
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'hoodies';
    SELECT id INTO col_id FROM collections WHERE handle = 'essentials';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('zip-up-hoodie-graphite', 'Essential Zip-Up Hoodie', 'هوديي بسحاب أساسي', 'A refined take on the classic zip-up.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['zip-up', 'hoodie', 'essentials'], false)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'ESS-ZIP-GRP-S', 'S', 'Graphite', 'جرافيت', '#383838', 279900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 6: Embroidered Logo Hoodie
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'hoodies';
    SELECT id INTO col_id FROM collections WHERE handle = 'new-arrivals';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('embroidered-logo-hoodie', 'Embroidered Logo Hoodie', 'هوديي بشعار مطرز', 'Subtle branding at its finest.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['embroidered', 'logo', 'hoodie', 'premium'], true)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'EMB-HOD-CRM-S', 'S', 'Cream', 'كريمي', '#FFFDD0', 289900, 10),
    (prod_id, 'EMB-HOD-BLK-S', 'S', 'Black', 'أسود', '#0A0A0A', 289900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 7: Classic Joggers
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'sweatpants';
    SELECT id INTO col_id FROM collections WHERE handle = 'essentials';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('classic-joggers', 'Classic Joggers', 'جوغر كلاسيكي', 'Everyday joggers elevated.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['joggers', 'classic', 'essentials', 'everyday'], false)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'CLS-JOG-CHR-S', 'S', 'Charcoal', 'فحمي', '#36454F', 179900, 10),
    (prod_id, 'CLS-JOG-HGR-S', 'S', 'Heather Grey', 'رمادي فاتح', '#9E9E9E', 179900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 8: Vintage Washed Hoodie
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'hoodies';
    SELECT id INTO col_id FROM collections WHERE handle = 'new-arrivals';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('vintage-washed-hoodie', 'Vintage Washed Hoodie', 'هوديي بتأثير عتيق', 'Pre-washed for that lived-in feel from day one.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['vintage', 'washed', 'hoodie', 'limited'], true)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'VNT-HOD-FBK-S', 'S', 'Faded Black', 'أسود باهت', '#2A2A2A', 319900, 10),
    (prod_id, 'VNT-HOD-WCL-S', 'S', 'Washed Clay', 'صلصال مغسول', '#B4846C', 319900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 9: Heavyweight Track Pants
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'sweatpants';
    SELECT id INTO col_id FROM collections WHERE handle = 'new-arrivals';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('heavyweight-track-pants', 'Heavyweight Track Pants', 'بنطال تراك ثقيل', 'Athletic heritage reimagined.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['track', 'pants', 'athletic', 'heavyweight'], true)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'HWT-TRK-BKW-S', 'S', 'Black/White', 'أسود/أبيض', '#0A0A0A', 229900, 10),
    (prod_id, 'HWT-TRK-NVC-S', 'S', 'Navy/Cream', 'كحلي/كريمي', '#1C2841', 229900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;

-- Product 10: Boxy Crewneck Sweater
DO $$ 
DECLARE 
    cat_id UUID;
    col_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_id FROM categories WHERE handle = 'hoodies';
    SELECT id INTO col_id FROM collections WHERE handle = 'essentials';

    INSERT INTO products (handle, title_en, title_ar, description_en, category_id, collection_id, images, tags, is_new)
    VALUES ('boxy-crewneck-sweater', 'Boxy Crewneck Sweater', 'سويتر رقبة دائرية بوكسي', 'A modern interpretation of the classic crewneck.', cat_id, col_id, ARRAY['/placeholder.svg'], ARRAY['crewneck', 'sweater', 'boxy', 'essentials'], false)
    ON CONFLICT (handle) DO UPDATE SET title_en = EXCLUDED.title_en RETURNING id INTO prod_id;

    INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
    (prod_id, 'BXY-CRW-OAT-S', 'S', 'Oatmeal', 'شوفاني', '#C9B99A', 219900, 10),
    (prod_id, 'BXY-CRW-ESP-S', 'S', 'Espresso', 'إسبريسو', '#3C2415', 219900, 10)
    ON CONFLICT (sku) DO NOTHING;
END $$;
