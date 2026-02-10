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
