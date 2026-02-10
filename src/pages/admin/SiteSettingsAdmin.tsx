import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";
import type { SiteSettings } from "@/hooks/useSiteSettings";

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings>({
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

        setSettings((prev) => {
          const merged = { ...prev };
          for (const key of Object.keys(prev) as (keyof SiteSettings)[]) {
            if (settingsMap[key] !== undefined && settingsMap[key] !== null) {
              (merged as any)[key] = settingsMap[key];
            }
          }
          return merged;
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

  const handleHeroImageUpload = (url: string) => {
    setSettings({ ...settings, hero_image_url: url });
  };

  const handleRemoveHeroImage = () => {
    setSettings({ ...settings, hero_image_url: null });
  };

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
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
            <p className="text-muted-foreground mt-1">로고, 기관명, 연락처, 히어로 섹션 등 기본 정보를 관리합니다.</p>
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
            <CardDescription>헤더에 표시될 기관 로고를 업로드하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.logo_url ? (
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl border border-border flex items-center justify-center bg-muted overflow-hidden">
                  <img src={settings.logo_url} alt="로고 미리보기" className="w-full h-full object-contain" />
                </div>
                <Button variant="outline" size="sm" onClick={handleRemoveLogo}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  로고 삭제
                </Button>
              </div>
            ) : (
              <FileUpload onUpload={handleLogoUpload} accept="image/*" type="image" />
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
                <Input id="org_name" value={settings.org_name} onChange={(e) => update("org_name", e.target.value)} placeholder="기관명을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org_subtitle">부제목</Label>
                <Input id="org_subtitle" value={settings.org_subtitle} onChange={(e) => update("org_subtitle", e.target.value)} placeholder="부제목을 입력하세요" />
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
                <Input id="phone" value={settings.phone} onChange={(e) => update("phone", e.target.value)} placeholder="전화번호를 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input id="address" value={settings.address} onChange={(e) => update("address", e.target.value)} placeholder="주소를 입력하세요" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 히어로 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>히어로 섹션</CardTitle>
            <CardDescription>메인 페이지 상단 히어로 영역의 텍스트, 이미지, 통계를 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 배경 이미지 */}
            <div className="space-y-2">
              <Label>배경 이미지</Label>
              {settings.hero_image_url ? (
                <div className="flex items-center gap-4">
                  <div className="w-48 h-28 rounded-lg border border-border overflow-hidden bg-muted">
                    <img src={settings.hero_image_url} alt="히어로 배경" className="w-full h-full object-cover" />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRemoveHeroImage}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    이미지 삭제
                  </Button>
                </div>
              ) : (
                <FileUpload onUpload={handleHeroImageUpload} accept="image/*" type="image" />
              )}
              <p className="text-xs text-muted-foreground">이미지를 삭제하면 기본 이미지가 사용됩니다.</p>
            </div>

            {/* 텍스트 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hero_badge">뱃지 텍스트</Label>
                <Input id="hero_badge" value={settings.hero_badge} onChange={(e) => update("hero_badge", e.target.value)} placeholder="상단 뱃지 텍스트" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_title">제목 (줄바꿈: \n 사용)</Label>
              <Input id="hero_title" value={settings.hero_title} onChange={(e) => update("hero_title", e.target.value)} placeholder="히어로 제목" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">부제목</Label>
              <Textarea id="hero_subtitle" value={settings.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} placeholder="히어로 부제목" rows={3} />
            </div>

            {/* 통계 */}
            <div>
              <Label className="mb-3 block">통계 항목 (4개)</Label>
              <div className="grid gap-4 md:grid-cols-2">
                {([1, 2, 3, 4] as const).map((n) => (
                  <div key={n} className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">라벨 {n}</Label>
                      <Input
                        value={settings[`hero_stat_${n}_label` as keyof SiteSettings] as string}
                        onChange={(e) => update(`hero_stat_${n}_label` as keyof SiteSettings, e.target.value)}
                        placeholder="라벨"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">값 {n}</Label>
                      <Input
                        value={settings[`hero_stat_${n}_value` as keyof SiteSettings] as string}
                        onChange={(e) => update(`hero_stat_${n}_value` as keyof SiteSettings, e.target.value)}
                        placeholder="값"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 프로그램 소개 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>프로그램 소개 섹션</CardTitle>
            <CardDescription>메인 페이지 '주요 사업' 영역의 뱃지, 제목, 부제목을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="programs_badge">뱃지 텍스트</Label>
              <Input id="programs_badge" value={settings.programs_badge} onChange={(e) => update("programs_badge", e.target.value)} placeholder="예: 주요 사업" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programs_title">제목</Label>
              <Input id="programs_title" value={settings.programs_title} onChange={(e) => update("programs_title", e.target.value)} placeholder="섹션 제목" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programs_subtitle">부제목</Label>
              <Textarea id="programs_subtitle" value={settings.programs_subtitle} onChange={(e) => update("programs_subtitle", e.target.value)} placeholder="섹션 부제목" rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* 뉴스 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>뉴스 섹션</CardTitle>
            <CardDescription>메인 페이지 '공지사항 및 소식' 영역의 뱃지와 제목을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news_badge">뱃지 텍스트</Label>
              <Input id="news_badge" value={settings.news_badge} onChange={(e) => update("news_badge", e.target.value)} placeholder="예: 소식" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news_title">제목</Label>
              <Input id="news_title" value={settings.news_title} onChange={(e) => update("news_title", e.target.value)} placeholder="섹션 제목" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
