-- Migration to sync product sizes and colors with Custom Studio standards
-- This script updates existing variants to use 1X, 2X, 3X and Custom Studio colors

-- 1. Update sizes
UPDATE product_variants
SET size = CASE 
    WHEN size IN ('S', 'Small') THEN '1X'
    WHEN size IN ('M', 'Medium') THEN '2X'
    WHEN size IN ('L', 'Large', 'XL', 'Extra Large') THEN '3X'
    ELSE size
END;

-- 2. Update colors to match Custom Studio Palette
-- Black (#000000)
UPDATE product_variants 
SET color_en = 'Black', color_ar = 'أسود', color_hex = '#000000' 
WHERE color_en ILIKE 'Black' OR color_en ILIKE 'Obsidian' OR color_en ILIKE 'Washed Black' OR color_en ILIKE 'Faded Black';

-- Dark Teal (#045D5D)
UPDATE product_variants 
SET color_en = 'Dark Teal', color_ar = 'تيل غامق', color_hex = '#045D5D' 
WHERE color_en ILIKE 'Dark Teal' OR color_en ILIKE 'Teal';

-- Off-White (#FAF9F6)
UPDATE product_variants 
SET color_en = 'Off-White', color_ar = 'أوف وايت', color_hex = '#FAF9F6' 
WHERE color_en ILIKE 'Off-White' OR color_en ILIKE 'Cream' OR color_en ILIKE 'Oatmeal';

-- White (#FFFFFF)
UPDATE product_variants 
SET color_en = 'White', color_ar = 'أبيض', color_hex = '#FFFFFF' 
WHERE color_en ILIKE 'White';

-- Light Rose (#F4D4D6)
UPDATE product_variants 
SET color_en = 'Light Rose', color_ar = 'روزي فاتح', color_hex = '#F4D4D6' 
WHERE color_en ILIKE 'Light Rose' OR color_en ILIKE 'Rose' OR color_en ILIKE 'Washed Clay';
