-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "products_select_all" ON public.products;
  DROP POLICY IF EXISTS "products_insert_auth" ON public.products;
  DROP POLICY IF EXISTS "products_update_auth" ON public.products;
  DROP POLICY IF EXISTS "products_delete_auth" ON public.products;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "orders_insert_all" ON public.orders;
  DROP POLICY IF EXISTS "orders_select_auth" ON public.orders;
  DROP POLICY IF EXISTS "orders_update_auth" ON public.orders;
  DROP POLICY IF EXISTS "orders_delete_auth" ON public.orders;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "order_items_insert_all" ON public.order_items;
  DROP POLICY IF EXISTS "order_items_select_auth" ON public.order_items;
  DROP POLICY IF EXISTS "order_items_select_by_order" ON public.order_items;
  DROP POLICY IF EXISTS "order_items_update_auth" ON public.order_items;
  DROP POLICY IF EXISTS "order_items_delete_auth" ON public.order_items;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Drop existing tables
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.products;

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  shipping_time TEXT NOT NULL DEFAULT '3-5 business days',
  shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  shipping_time TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products: everyone can read
CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert_auth" ON public.products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "products_update_auth" ON public.products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "products_delete_auth" ON public.products FOR DELETE USING (auth.uid() IS NOT NULL);

-- Orders: anyone can insert, only auth can read/update/delete
CREATE POLICY "orders_insert_all" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_auth" ON public.orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "orders_update_auth" ON public.orders FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "orders_delete_auth" ON public.orders FOR DELETE USING (auth.uid() IS NOT NULL);

-- Order items: anyone can insert, only auth can read/update/delete
CREATE POLICY "order_items_insert_all" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select_auth" ON public.order_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "order_items_update_auth" ON public.order_items FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "order_items_delete_auth" ON public.order_items FOR DELETE USING (auth.uid() IS NOT NULL);
