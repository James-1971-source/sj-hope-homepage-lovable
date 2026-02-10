
CREATE TABLE public.homepage_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  link TEXT DEFAULT '/programs',
  icon TEXT DEFAULT 'BookOpen',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homepage_programs"
ON public.homepage_programs FOR SELECT USING (true);

CREATE POLICY "Admins can manage homepage_programs"
ON public.homepage_programs FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Insert default data
INSERT INTO public.homepage_programs (title, description, icon, display_order) VALUES
('학습지원', '기초학습 지도, 멘토링, 진로상담 등을 통해 청소년들의 학업 역량을 키워갑니다.', 'BookOpen', 0),
('상담·복지', '전문 상담사와 함께 청소년들의 마음 건강과 정서적 안정을 지원합니다.', 'Heart', 1),
('문화·체험', '다양한 문화예술 활동과 체험 프로그램으로 창의성과 사회성을 길러줍니다.', 'Palette', 2);
