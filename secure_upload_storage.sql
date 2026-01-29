-- Storage Security Enhancements
-- These policies reinforce the file upload security by enforcing MIME types and extensions at the database level.

-- 1. Ensure Policy Exists for Insert
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'payment-proofs' AND
    (lower(storage.extension(name)) = 'jpg' OR 
     lower(storage.extension(name)) = 'jpeg' OR 
     lower(storage.extension(name)) = 'png' OR 
     lower(storage.extension(name)) = 'webp')
);

-- 2. Restrict View Access to Admins Only (Reinforcement)
DROP POLICY IF EXISTS "Allow admin viewing" ON storage.objects;
CREATE POLICY "Allow admin viewing" ON storage.objects
FOR SELECT TO authenticated USING (
    bucket_id = 'payment-proofs' AND 
    ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
