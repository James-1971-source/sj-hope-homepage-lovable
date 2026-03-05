
CREATE TABLE public.youth_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL DEFAULT 'https://today-news-brown.vercel.app/',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.youth_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active youth news"
  ON public.youth_news FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage youth news"
  ON public.youth_news FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
