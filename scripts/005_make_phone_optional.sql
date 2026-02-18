-- Make customer_phone nullable in orders table
ALTER TABLE public.orders ALTER COLUMN customer_phone DROP NOT NULL;
