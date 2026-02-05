import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";

interface SiteSettings {
  logo_url: string | null;
  org_name: string;
  org_subtitle: string;
  phone: string;
  address: string;
}

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings>({
    logo_url: null,
    org_name: "S&J희망나눔",
    org_subtitle: "청소년 교육복지기관",
    phone: "053-428-7942",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

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
          org_name: settingsMap.org_name || "S&J희망나눔",
          org_subtitle: settingsMap.org_subtitle || "청소년 교육복지기관",
          phone: settingsMap.phone || "053-428-7942",
          address: settingsMap.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("설정을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || null,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key: update.key, value: update.value }, { onConflict: "key" });

        if (error) throw error;
      }

      toast.success("설정이 저장되었습니다.");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("설정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (url: string) => {
    setSettings({ ...settings, logo_url: url });
  };

  const handleRemoveLogo = () => {
    setSettings({ ...settings, logo_url: null });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">사이트 설정</h1>
            <p className="text-muted-foreground mt-1">로고, 기관명, 연락처 등 기본 정보를 관리합니다.</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "저장 중..." : "저장하기"}
          </Button>
        </div>

        {/* 로고 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>로고</CardTitle>
            <CardDescription>헤더에 표시될 기관 로고를 업로드하세요. (권장 크기: 200x200px 이상)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.logo_url ? (
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl border border-border flex items-center justify-center bg-muted overflow-hidden">
                  <img
                    src={settings.logo_url}
                    alt="로고 미리보기"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleRemoveLogo}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  로고 삭제
                </Button>
              </div>
            ) : (
              <FileUpload
                onUpload={handleLogoUpload}
                accept="image/*"
                type="image"
              />
            )}
          </CardContent>
        </Card>

        {/* 기관 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기관 정보</CardTitle>
            <CardDescription>기관명과 부제목을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org_name">기관명</Label>
                <Input
                  id="org_name"
                  value={settings.org_name}
                  onChange={(e) => setSettings({ ...settings, org_name: e.target.value })}
                  placeholder="기관명을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org_subtitle">부제목</Label>
                <Input
                  id="org_subtitle"
                  value={settings.org_subtitle}
                  onChange={(e) => setSettings({ ...settings, org_subtitle: e.target.value })}
                  placeholder="부제목을 입력하세요"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 연락처 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>연락처 정보</CardTitle>
            <CardDescription>헤더와 푸터에 표시될 연락처 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="전화번호를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="주소를 입력하세요"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
