
-- 재능기부활동가 모집 공고 테이블
CREATE TABLE public.recruitment_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  poster_image TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recruitment_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active recruitment posts"
ON public.recruitment_posts FOR SELECT USING (true);

CREATE POLICY "Admins can manage recruitment posts"
ON public.recruitment_posts FOR ALL
USING (public.is_admin());

CREATE TRIGGER update_recruitment_posts_updated_at
BEFORE UPDATE ON public.recruitment_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
