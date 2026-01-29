-- Final RLS Fix for Orders and Items
-- This script clears old policies and sets up clean, working ones for guest and admin checkout.

-- 1. Drops
DROP POLICY IF EXISTS "Anyone can create an order" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON orders;
DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;

DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Admins can read all order items" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_select_policy" ON order_items;

DROP POLICY IF EXISTS "Anyone can create custom designs" ON custom_designs;
DROP POLICY IF EXISTS "Admins can read all custom designs" ON custom_designs;
DROP POLICY IF EXISTS "custom_designs_insert_policy" ON custom_designs;
DROP POLICY IF EXISTS "custom_designs_select_policy" ON custom_designs;

-- 2. Orders Policies
-- Allow anyone (guest or logged in) to insert an order
CREATE POLICY "orders_insert_policy" ON orders FOR INSERT WITH CHECK (true);

-- Allow admins to see everything, and users to see their own orders
CREATE POLICY "orders_select_policy" ON orders FOR SELECT USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' OR 
  auth.uid() = user_id
);

-- 3. Order Items Policies
CREATE POLICY "order_items_insert_policy" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select_policy" ON order_items FOR SELECT USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

-- 4. Custom Designs Policies
CREATE POLICY "custom_designs_insert_policy" ON custom_designs FOR INSERT WITH CHECK (true);
CREATE POLICY "custom_designs_select_policy" ON custom_designs FOR SELECT USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') ->> 'admin'
);

-- 6. Storage Bucket & Permissions
-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Cleanup existing storage policies
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;

-- Allow anonymous uploads for payment proof
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

-- Allow only admins to view payment proofs (Secure)
CREATE POLICY "Allow admin viewing" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'payment-proofs' AND 
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
