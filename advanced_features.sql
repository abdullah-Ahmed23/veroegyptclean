-- 1. Add cost_price to product_variants for Margin calculations
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS cost_price BIGINT;

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount BIGINT NOT NULL, -- in cents
    payment_method TEXT CHECK (payment_method IN ('cod', 'wallet', 'instapay')),
    payment_proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'cancelled', 'delivered')),
    user_id UUID REFERENCES auth.users(id)
);

-- 3. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    price_at_purchase BIGINT NOT NULL -- in cents
);

-- 4. Create custom_designs table
CREATE TABLE IF NOT EXISTS custom_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    front_image_url TEXT,
    back_image_url TEXT,
    base_color TEXT,
    size TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_designs ENABLE ROW LEVEL SECURITY;

-- Policies for Orders (Admin can read all, Users can read their own)
CREATE POLICY "orders_insert_policy" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_policy" ON orders FOR SELECT USING (
  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' OR 
  auth.uid() = user_id OR
  user_id IS NULL
);

-- Similar policies for order_items and custom_designs...
CREATE POLICY "order_items_insert_policy" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select_policy" ON order_items FOR SELECT USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "custom_designs_insert_policy" ON custom_designs FOR INSERT WITH CHECK (true);
CREATE POLICY "custom_designs_select_policy" ON custom_designs FOR SELECT USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
