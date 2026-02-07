
-- Add month, day, images columns to history_items
ALTER TABLE public.history_items ADD COLUMN IF NOT EXISTS month integer;
ALTER TABLE public.history_items ADD COLUMN IF NOT EXISTS day integer;
ALTER TABLE public.history_items ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];

-- Create banners table
CREATE TABLE public.banners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  title text,
  link_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  slide_interval integer DEFAULT 5,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage banners" ON public.banners
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
