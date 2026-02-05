-- 사이트 전역 설정 테이블 (로고, 연락처 등)
CREATE TABLE public.site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 페이지 콘텐츠 테이블 (기관소개, 사업소개 등 각 페이지 내용)
CREATE TABLE public.page_contents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key text NOT NULL,
    section_key text NOT NULL,
    title text,
    content text,
    images text[] DEFAULT '{}'::text[],
    display_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(page_key, section_key)
);

-- 연혁 테이블 (별도 관리를 위해)
CREATE TABLE public.history_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    year text NOT NULL,
    event text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 조직도 테이블
CREATE TABLE public.organization_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    position text,
    parent_id uuid REFERENCES public.organization_items(id) ON DELETE SET NULL,
    level integer DEFAULT 0,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 시설안내 테이블
CREATE TABLE public.facilities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    images text[] DEFAULT '{}'::text[],
    display_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
CREATE POLICY "Anyone can view site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can view page_contents" ON public.page_contents FOR SELECT USING (true);
CREATE POLICY "Anyone can view history_items" ON public.history_items FOR SELECT USING (true);
CREATE POLICY "Anyone can view organization_items" ON public.organization_items FOR SELECT USING (true);
CREATE POLICY "Anyone can view facilities" ON public.facilities FOR SELECT USING (true);

-- 관리자만 수정 가능
CREATE POLICY "Admins can manage site_settings" ON public.site_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage page_contents" ON public.page_contents FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage history_items" ON public.history_items FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage organization_items" ON public.organization_items FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can manage facilities" ON public.facilities FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- updated_at 트리거
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_page_contents_updated_at BEFORE UPDATE ON public.page_contents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_history_items_updated_at BEFORE UPDATE ON public.history_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organization_items_updated_at BEFORE UPDATE ON public.organization_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON public.facilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 기본 데이터 삽입 (현재 하드코딩된 내용)
INSERT INTO public.site_settings (key, value) VALUES
    ('logo_url', null),
    ('org_name', 'S&J희망나눔'),
    ('org_subtitle', '청소년 교육복지기관'),
    ('phone', '053-428-7942'),
    ('address', '');

INSERT INTO public.page_contents (page_key, section_key, title, content, display_order) VALUES
    ('about', 'greeting', '인사말', '안녕하세요, 사단법인 S&J희망나눔을 방문해 주셔서 감사합니다.

저희 S&J희망나눔은 2015년 설립 이래 청소년들의 건강한 성장과 자립을 위해 학습지원, 상담·복지, 문화·체험 프로그램을 운영하고 있습니다.

모든 청소년들이 환경과 상황에 관계없이 자신의 잠재력을 발휘하고, 꿈을 향해 나아갈 수 있도록 최선의 지원을 다하고 있습니다.

많은 분들의 관심과 후원, 그리고 자원봉사자분들의 헌신적인 참여 덕분에 지금까지 5,000명이 넘는 청소년들에게 희망의 손길을 전할 수 있었습니다.

앞으로도 청소년들의 밝은 미래를 위해 최선을 다하겠습니다.
감사합니다.

사단법인 S&J희망나눔 이사장 윤동성', 1),
    ('about', 'mission', '사명', '청소년들이 건강하게 성장하고 꿈을 실현할 수 있도록 교육, 상담, 문화 프로그램을 통해 종합적인 지원을 제공합니다.', 1),
    ('about', 'vision', '비전', '모든 청소년이 차별 없이 자신의 잠재력을 발휘하고 건강한 사회구성원으로 성장하는 세상을 만들어 갑니다.', 2),
    ('about', 'values', '핵심가치', '존중, 협력, 성장, 나눔의 가치를 바탕으로 청소년과 지역사회를 연결하는 가교 역할을 수행합니다.', 3);

INSERT INTO public.history_items (year, event, display_order) VALUES
    ('2015', '사단법인 S&J희망나눔 설립', 1),
    ('2016', '청소년 학습지원 프로그램 시작', 2),
    ('2017', 'OO구청 청소년복지사업 위탁 운영', 3),
    ('2018', '문화예술 체험활동 프로그램 확대', 4),
    ('2019', '청소년 멘토링 사업 시작', 5),
    ('2020', '비대면 교육 프로그램 도입', 6),
    ('2021', '자원봉사자 300명 돌파', 7),
    ('2022', '청소년 상담센터 개소', 8),
    ('2023', '누적 수혜 청소년 5,000명 달성', 9),
    ('2024', '시설 확장 및 프로그램 다양화', 10);

INSERT INTO public.organization_items (name, position, level, display_order) VALUES
    ('이사장', null, 0, 1),
    ('사무국장', null, 1, 2),
    ('학습지원팀', null, 2, 3),
    ('상담복지팀', null, 2, 4),
    ('문화사업팀', null, 2, 5),
    ('운영지원팀', null, 2, 6);