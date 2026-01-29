-- Supabase Security Hardening Script (v5)
-- This script addresses "Insecure Metadata", "Always True", "Performance", and missing Admin Manage permissions.

-- 1. General Storefront Tables (Public Read, Admin Write)

-- categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full Admin Access" ON categories;
DROP POLICY IF EXISTS "products_read_policy" ON categories;
DROP POLICY IF EXISTS "categories_read_policy" ON categories;
DROP POLICY IF EXISTS "categories_admin_policy" ON categories;
DROP POLICY IF EXISTS "Allow public read access" ON categories;
DROP POLICY IF EXISTS "Public Read Access" ON categories;
CREATE POLICY "categories_read_policy" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_policy" ON categories FOR ALL 
  TO authenticated 
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full Admin Access" ON collections;
DROP POLICY IF EXISTS "collections_read_policy" ON collections;
DROP POLICY IF EXISTS "collections_admin_policy" ON collections;
DROP POLICY IF EXISTS "Allow public read access" ON collections;
DROP POLICY IF EXISTS "Public Read Access" ON collections;
CREATE POLICY "collections_read_policy" ON collections FOR SELECT USING (true);
CREATE POLICY "collections_admin_policy" ON collections FOR ALL 
  TO authenticated 
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full Admin Access" ON products;
DROP POLICY IF EXISTS "products_read_policy" ON products;
DROP POLICY IF EXISTS "products_admin_policy" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Public Read Access" ON products;
CREATE POLICY "products_read_policy" ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_policy" ON products FOR ALL 
  TO authenticated 
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- product_variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full Admin Access" ON product_variants;
DROP POLICY IF EXISTS "Allow all for admins" ON product_variants;
DROP POLICY IF EXISTS "product_variants_read_policy" ON product_variants;
DROP POLICY IF EXISTS "product_variants_admin_policy" ON product_variants;
DROP POLICY IF EXISTS "Allow public read access" ON product_variants;
DROP POLICY IF EXISTS "Public Read Access" ON product_variants;
CREATE POLICY "product_variants_read_policy" ON product_variants FOR SELECT USING (true);
CREATE POLICY "product_variants_admin_policy" ON product_variants FOR ALL 
  TO authenticated 
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');


-- 2. Transactional Tables (Guest/User Insert, Admin Read/Manage)

-- orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_admin_policy" ON orders;
CREATE POLICY "orders_insert_policy" ON orders FOR INSERT WITH CHECK (total_amount >= 0);
CREATE POLICY "orders_select_policy" ON orders FOR SELECT USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' OR 
  (SELECT auth.uid()) = user_id OR
  user_id IS NULL
);
CREATE POLICY "orders_admin_policy" ON orders FOR ALL 
  TO authenticated 
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "order_items_insert_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_select_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_admin_policy" ON order_items;
CREATE POLICY "order_items_insert_policy" ON order_items FOR INSERT WITH CHECK (quantity > 0);
CREATE POLICY "order_items_select_policy" ON order_items FOR SELECT USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
CREATE POLICY "order_items_admin_policy" ON order_items FOR ALL 
  TO authenticated 
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- custom_designs
ALTER TABLE custom_designs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "custom_designs_insert_policy" ON custom_designs;
DROP POLICY IF EXISTS "custom_designs_select_policy" ON custom_designs;
DROP POLICY IF EXISTS "custom_designs_admin_policy" ON custom_designs;
CREATE POLICY "custom_designs_insert_policy" ON custom_designs FOR INSERT WITH CHECK (base_color IS NOT NULL);
CREATE POLICY "custom_designs_select_policy" ON custom_designs FOR SELECT USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
CREATE POLICY "custom_designs_admin_policy" ON custom_designs FOR ALL 
  TO authenticated 
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
