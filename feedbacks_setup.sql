-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name text NOT NULL,
  customer_title text, -- e.g. "Verified Buyer"
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
DROP POLICY IF EXISTS "feedbacks_admin_policy" ON feedbacks;
CREATE POLICY "feedbacks_admin_policy" ON feedbacks FOR ALL 
  TO authenticated 
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Anonymous can read approved feedbacks
DROP POLICY IF EXISTS "feedbacks_read_policy" ON feedbacks;
CREATE POLICY "feedbacks_read_policy" ON feedbacks FOR SELECT
  USING (is_approved = true);

-- Seed initial data
INSERT INTO feedbacks (customer_name, customer_title, rating, comment, is_approved)
VALUES 
('Ahmed H.', 'Verified Buyer', 5, 'The oversized hoodie fits perfectly. The heavy cotton quality is unlike anything else in Egypt.', true),
('Sarah M.', 'Verified Buyer', 5, 'Custom studio was so easy to use. My design came out exactly how I imagined!', true),
('Omar K.', 'Verified Buyer', 4, 'Very comfortable for everyday wear. Looking forward to more collections.', true),
('Nour G.', 'Verified Buyer', 5, 'Fast shipping and premium packaging. VERO is the new standard.', true),
('Mostafa A.', 'Verified Buyer', 5, 'The fabric drape is incredible. Truly premium essentials.', true),
('Layla S.', 'Verified Buyer', 5, 'Best custom streetwear experience in Cairo.', true);
