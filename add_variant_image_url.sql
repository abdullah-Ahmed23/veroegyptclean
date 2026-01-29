-- Add image_url column to product_variants table
-- Allows associating a specific image with each variant/color

ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS image_url TEXT;
