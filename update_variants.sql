-- Update all products to have the new colors and sizes
-- 1. Clear existing variants (Careful: this will delete old stock data)
DELETE FROM product_variants;

-- 2. Ensure custom-hoodie product exists
INSERT INTO products (handle, title_en, title_ar, description_en, tags, is_new)
VALUES ('custom-hoodie', 'Custom Designed Hoodie', 'هوديي بتصميم خاص', 'Your own design, printed on premium fabric.', ARRAY['custom', 'hoodie'], false)
ON CONFLICT (handle) DO NOTHING;

-- 3. Define colors and sizes
-- Colors: Black (#000000), Green (#1B4D3E), Off-white (#FAF9F6), White (#FFFFFF), Rose (#E0BFB8)
-- Sizes: 1X, 2X, 3X

-- 3. Insert new variants for all products
DO $$
DECLARE
    p_id UUID;
BEGIN
    FOR p_id IN SELECT id FROM products LOOP
        -- Black
        INSERT INTO product_variants (product_id, sku, size, color_en, color_ar, color_hex, price, stock_quantity) VALUES
        (p_id, p_id || '-BLK-1X', '1X', 'Black', 'أسود', '#000000', 249900, 50),
        (p_id, p_id || '-BLK-2X', '2X', 'Black', 'أسود', '#000000', 249900, 50),
        (p_id, p_id || '-BLK-3X', '3X', 'Black', 'أسود', '#000000', 249900, 50),
        -- Green
        (p_id, p_id || '-GRN-1X', '1X', 'Green', 'أخضر', '#1B4D3E', 249900, 50),
        (p_id, p_id || '-GRN-2X', '2X', 'Green', 'أخضر', '#1B4D3E', 249900, 50),
        (p_id, p_id || '-GRN-3X', '3X', 'Green', 'أخضر', '#1B4D3E', 249900, 50),
        -- Off-White
        (p_id, p_id || '-OFW-1X', '1X', 'Off-White', 'أبيض مطفي', '#FAF9F6', 249900, 50),
        (p_id, p_id || '-OFW-2X', '2X', 'Off-White', 'أبيض مطفي', '#FAF9F6', 249900, 50),
        (p_id, p_id || '-OFW-3X', '3X', 'Off-White', 'أبيض مطفي', '#FAF9F6', 249900, 50),
        -- White
        (p_id, p_id || '-WHT-1X', '1X', 'White', 'أبيض', '#FFFFFF', 249900, 50),
        (p_id, p_id || '-WHT-2X', '2X', 'White', 'أبيض', '#FFFFFF', 249900, 50),
        (p_id, p_id || '-WHT-3X', '3X', 'White', 'أبيض', '#FFFFFF', 249900, 50),
        -- Rose
        (p_id, p_id || '-ROS-1X', '1X', 'Rose', 'روز', '#E0BFB8', 249900, 50),
        (p_id, p_id || '-ROS-2X', '2X', 'Rose', 'روز', '#E0BFB8', 249900, 50),
        (p_id, p_id || '-ROS-3X', '3X', 'Rose', 'روز', '#E0BFB8', 249900, 50);
    END LOOP;
END $$;
