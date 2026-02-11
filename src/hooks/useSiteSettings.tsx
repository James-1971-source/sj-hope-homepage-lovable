import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  logo_url: string | null;
  org_name: string;
  org_subtitle: string;
  phone: string;
  address: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  hero_stat_1_label: string;
  hero_stat_1_value: string;
  hero_stat_2_label: string;
  hero_stat_2_value: string;
  hero_stat_3_label: string;
  hero_stat_3_value: string;
  hero_stat_4_label: string;
  hero_stat_4_value: string;
  programs_badge: string;
  programs_title: string;
  programs_subtitle: string;
  news_badge: string;
  news_title: string;
  // Footer fields
  footer_org_name: string;
  footer_org_subtitle: string;
  footer_address: string;
  footer_phone: string;
  footer_email: string;
  footer_work_hours: string;
  footer_org_number: string;
  footer_copyright: string;
  footer_cta_title: string;
  footer_cta_subtitle: string;
  footer_sns_blog: string;
  footer_sns_youtube: string;
  footer_sns_instagram: string;
  footer_sns_facebook: string;
  hero_overlay_color: string;
  contact_fax: string;
  contact_map_embed: string;
  contact_transport: string;
}

const defaultSettings: SiteSettings = {
  logo_url: null,
  org_name: "S&J희망나눔",
  org_subtitle: "청소년 교육복지기관",
  phone: "053-428-7942",
  address: "",
  hero_badge: "사단법인 S&J희망나눔",
  hero_title: "청소년의 꿈과 희망을\n함께 키워갑니다",
  hero_subtitle: "교육, 상담, 문화 프로그램을 통해 청소년들이 건강하게 성장하고 밝은 미래를 꿈꿀 수 있도록 지원합니다.",
  hero_image_url: null,
  hero_stat_1_label: "설립연도",
  hero_stat_1_value: "2015년",
  hero_stat_2_label: "누적 수혜 청소년",
  hero_stat_2_value: "5,000+",
  hero_stat_3_label: "진행 프로그램",
  hero_stat_3_value: "50+",
  hero_stat_4_label: "자원봉사자",
  hero_stat_4_value: "300+",
  programs_badge: "주요 사업",
  programs_title: "청소년을 위한 다양한 프로그램",
  programs_subtitle: "학습, 상담, 문화 등 종합적인 지원을 통해 청소년들의 성장을 돕습니다.",
  news_badge: "소식",
  news_title: "공지사항 및 소식",
  footer_org_name: "S&J희망나눔",
  footer_org_subtitle: "사단법인 에스엔제이희망나눔",
  footer_address: "대구시 중구 동덕로 115, 진석타워 9층 906호",
  footer_phone: "053-428-7942",
  footer_email: "sjfoundation@sj-hs.or.kr",
  footer_work_hours: "평일 10:00 - 18:00 (근무 요일: 화~금)\n점심시간 12:00 - 13:00",
  footer_org_number: "고유번호: 463-82-00186",
  footer_copyright: "© 2026 사단법인 S&J희망나눔. All rights reserved.",
  footer_cta_title: "함께하면 더 큰 희망이 됩니다",
  footer_cta_subtitle: "청소년들의 밝은 미래를 위한 여러분의 따뜻한 관심이 필요합니다.",
  footer_sns_blog: "",
  footer_sns_youtube: "",
  footer_sns_instagram: "",
  footer_sns_facebook: "",
  hero_overlay_color: "#1e3a5f",
  contact_fax: "",
  contact_map_embed: "",
  contact_transport: "대중교통: 대구 지하철 1호선 중앙로역 3번 출구에서 도보 5분\n버스: 동덕로 정류장 하차",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value");

        if (error) throw error;

        if (data) {
          const settingsMap = data.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
          }, {} as Record<string, string | null>);

          const merged = { ...defaultSettings };
          for (const key of Object.keys(defaultSettings) as (keyof SiteSettings)[]) {
            if (settingsMap[key] !== undefined && settingsMap[key] !== null) {
              (merged as any)[key] = settingsMap[key];
            }
          }
          setSettings(merged);
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
