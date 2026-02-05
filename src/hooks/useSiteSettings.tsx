import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  logo_url: string | null;
  org_name: string;
  org_subtitle: string;
  phone: string;
  address: string;
}

const defaultSettings: SiteSettings = {
  logo_url: null,
  org_name: "S&J희망나눔",
  org_subtitle: "청소년 교육복지기관",
  phone: "053-428-7942",
  address: "",
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

          setSettings({
            logo_url: settingsMap.logo_url || null,
            org_name: settingsMap.org_name || defaultSettings.org_name,
            org_subtitle: settingsMap.org_subtitle || defaultSettings.org_subtitle,
            phone: settingsMap.phone || defaultSettings.phone,
            address: settingsMap.address || defaultSettings.address,
          });
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
