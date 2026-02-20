-- Add images array column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[];

-- Migrate existing image_url to images array if it exists
UPDATE public.products 
SET images = ARRAY[image_url]::TEXT[]
WHERE image_url IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);
