-- Custom Designs Storage Security
-- This script creates the bucket and reinforces security for custom design uploads.

-- 1. Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('custom-designs', 'custom-designs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow anonymous uploads for custom design images
DROP POLICY IF EXISTS "Allow public custom design uploads" ON storage.objects;
CREATE POLICY "Allow public custom design uploads" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'custom-designs' AND
    (lower(storage.extension(name)) = 'jpg' OR 
     lower(storage.extension(name)) = 'jpeg' OR 
     lower(storage.extension(name)) = 'png' OR 
     lower(storage.extension(name)) = 'webp')
);

-- 3. Allow only admins to view custom designs (Secure)
DROP POLICY IF EXISTS "Allow admin viewing custom designs" ON storage.objects;
CREATE POLICY "Allow admin viewing custom designs" ON storage.objects
FOR SELECT TO authenticated USING (
    bucket_id = 'custom-designs' AND 
    ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
