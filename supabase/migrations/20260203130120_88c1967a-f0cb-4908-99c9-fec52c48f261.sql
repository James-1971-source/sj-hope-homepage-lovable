-- YouTube 영상 관리 테이블 생성
CREATE TABLE public.videos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    description TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 누구나 조회 가능
CREATE POLICY "Anyone can view videos"
ON public.videos
FOR SELECT
USING (true);

-- RLS 정책: 관리자만 추가 가능
CREATE POLICY "Admins can insert videos"
ON public.videos
FOR INSERT
WITH CHECK (is_admin());

-- RLS 정책: 관리자만 수정 가능
CREATE POLICY "Admins can update videos"
ON public.videos
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- RLS 정책: 관리자만 삭제 가능
CREATE POLICY "Admins can delete videos"
ON public.videos
FOR DELETE
USING (is_admin());

-- updated_at 자동 갱신 트리거
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();