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
    contact_transport: "",
    donate_bank_name: "신한은행",
    donate_account_number: "XXX-XXX-XXXXXX",
    donate_account_holder: "사단법인 S&J희망나눔",
    donate_benefits: "기부금 영수증 발급\n후원 소식지 발송 (분기별)\n연간 활동보고서 제공\n후원자 감사 행사 초대",
    donate_usage: "청소년 학습지원 프로그램 운영\n상담 및 복지 서비스 제공\n문화·체험 활동 지원\n교육 자료 및 시설 개선",
    donate_contact_phone: "02-XXX-XXXX",
    donate_contact_email: "contact@sj-hs.or.kr",
    organization_image_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("key, value");
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

  const handleLogoUpload = (url: string) => setSettings({ ...settings, logo_url: url });
  const handleRemoveLogo = () => setSettings({ ...settings, logo_url: null });
  const handleHeroImageUpload = (url: string) => setSettings({ ...settings, hero_image_url: url });
  const handleRemoveHeroImage = () => setSettings({ ...settings, hero_image_url: null });
  const update = (key: keyof SiteSettings, value: string) => setSettings({ ...settings, [key]: value });

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
            <p className="text-muted-foreground mt-1">로고, 기관명, 연락처, 히어로 섹션, 푸터 등 기본 정보를 관리합니다.</p>
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
            <CardDescription>헤더와 푸터에 표시될 기관 로고를 업로드하세요.</CardDescription>
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
            <CardDescription>헤더에 표시되는 기관명과 부제목입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org_name">기관명</Label>
                <Input id="org_name" value={settings.org_name} onChange={(e) => update("org_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org_subtitle">부제목</Label>
                <Input id="org_subtitle" value={settings.org_subtitle} onChange={(e) => update("org_subtitle", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 연락처 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>연락처 정보</CardTitle>
            <CardDescription>헤더 상단에 표시될 전화번호입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input id="phone" value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input id="address" value={settings.address} onChange={(e) => update("address", e.target.value)} />
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
            <div className="space-y-2">
              <Label htmlFor="hero_overlay_color">배경 오버레이 색상</Label>
              <div className="flex items-center gap-3">
                {settings.hero_overlay_color && settings.hero_overlay_color !== "none" && (
                  <input
                    type="color"
                    id="hero_overlay_color"
                    value={settings.hero_overlay_color}
                    onChange={(e) => update("hero_overlay_color", e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-border"
                  />
                )}
                <Input
                  value={settings.hero_overlay_color === "none" ? "" : settings.hero_overlay_color}
                  onChange={(e) => update("hero_overlay_color", e.target.value || "none")}
                  placeholder="컬러 없음"
                  className="max-w-[200px]"
                />
                <Button
                  type="button"
                  variant={settings.hero_overlay_color === "none" || !settings.hero_overlay_color ? "default" : "outline"}
                  size="sm"
                  onClick={() => update("hero_overlay_color", settings.hero_overlay_color === "none" ? "#1e3a5f" : "none")}
                >
                  {settings.hero_overlay_color === "none" || !settings.hero_overlay_color ? "컬러 없음 ✓" : "컬러 없음"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">오버레이를 제거하려면 '컬러 없음' 버튼을 클릭하세요.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hero_badge">뱃지 텍스트</Label>
                <Input id="hero_badge" value={settings.hero_badge} onChange={(e) => update("hero_badge", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_title">제목 (줄바꿈: \n 사용)</Label>
              <Input id="hero_title" value={settings.hero_title} onChange={(e) => update("hero_title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">부제목</Label>
              <Textarea id="hero_subtitle" value={settings.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} rows={3} />
            </div>
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
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">값 {n}</Label>
                      <Input
                        value={settings[`hero_stat_${n}_value` as keyof SiteSettings] as string}
                        onChange={(e) => update(`hero_stat_${n}_value` as keyof SiteSettings, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 메인 페이지 - 사업소개 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>메인 페이지 - 사업소개 섹션</CardTitle>
            <CardDescription>홈 페이지의 '주요 사업' 영역에 표시되는 뱃지, 제목, 부제목입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="programs_badge">뱃지 텍스트</Label>
              <Input id="programs_badge" value={settings.programs_badge} onChange={(e) => update("programs_badge", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programs_title">제목</Label>
              <Input id="programs_title" value={settings.programs_title} onChange={(e) => update("programs_title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programs_subtitle">부제목</Label>
              <Textarea id="programs_subtitle" value={settings.programs_subtitle} onChange={(e) => update("programs_subtitle", e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* 메인 페이지 - 소식 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>메인 페이지 - 소식 섹션</CardTitle>
            <CardDescription>홈 페이지의 '공지사항 및 소식' 영역에 표시되는 뱃지와 제목입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news_badge">뱃지 텍스트</Label>
              <Input id="news_badge" value={settings.news_badge} onChange={(e) => update("news_badge", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news_title">제목</Label>
              <Input id="news_title" value={settings.news_title} onChange={(e) => update("news_title", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* 푸터 - CTA 영역 */}
        <Card>
          <CardHeader>
            <CardTitle>푸터 - 상단 CTA 영역</CardTitle>
            <CardDescription>푸터 상단의 후원/봉사 안내 문구를 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="footer_cta_title">CTA 제목</Label>
              <Input id="footer_cta_title" value={settings.footer_cta_title} onChange={(e) => update("footer_cta_title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer_cta_subtitle">CTA 부제목</Label>
              <Input id="footer_cta_subtitle" value={settings.footer_cta_subtitle} onChange={(e) => update("footer_cta_subtitle", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* 푸터 - 기관 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>푸터 - 기관 정보</CardTitle>
            <CardDescription>푸터에 표시되는 기관명, 주소, 연락처, 근무시간 등을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="footer_org_name">기관명</Label>
                <Input id="footer_org_name" value={settings.footer_org_name} onChange={(e) => update("footer_org_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_org_subtitle">기관 부제목</Label>
                <Input id="footer_org_subtitle" value={settings.footer_org_subtitle} onChange={(e) => update("footer_org_subtitle", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer_address">주소</Label>
              <Input id="footer_address" value={settings.footer_address} onChange={(e) => update("footer_address", e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="footer_phone">전화번호</Label>
                <Input id="footer_phone" value={settings.footer_phone} onChange={(e) => update("footer_phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_email">이메일</Label>
                <Input id="footer_email" value={settings.footer_email} onChange={(e) => update("footer_email", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer_work_hours">근무시간 (줄바꿈: \n 사용)</Label>
              <Textarea id="footer_work_hours" value={settings.footer_work_hours} onChange={(e) => update("footer_work_hours", e.target.value)} rows={3} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="footer_org_number">고유번호</Label>
                <Input id="footer_org_number" value={settings.footer_org_number} onChange={(e) => update("footer_org_number", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_copyright">저작권 문구</Label>
                <Input id="footer_copyright" value={settings.footer_copyright} onChange={(e) => update("footer_copyright", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 후원 페이지 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>후원 페이지 설정</CardTitle>
            <CardDescription>후원 페이지 오른쪽 영역의 계좌안내, 후원혜택, 사용처, 문의 정보를 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="donate_bank_name">은행명</Label>
                <Input id="donate_bank_name" value={settings.donate_bank_name} onChange={(e) => update("donate_bank_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donate_account_number">계좌번호</Label>
                <Input id="donate_account_number" value={settings.donate_account_number} onChange={(e) => update("donate_account_number", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donate_account_holder">예금주</Label>
                <Input id="donate_account_holder" value={settings.donate_account_holder} onChange={(e) => update("donate_account_holder", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="donate_benefits">후원 혜택 (줄바꿈으로 구분)</Label>
              <Textarea id="donate_benefits" value={settings.donate_benefits} onChange={(e) => update("donate_benefits", e.target.value)} rows={4} placeholder="기부금 영수증 발급&#10;후원 소식지 발송" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donate_usage">후원금 사용처 (줄바꿈으로 구분)</Label>
              <Textarea id="donate_usage" value={settings.donate_usage} onChange={(e) => update("donate_usage", e.target.value)} rows={4} placeholder="청소년 학습지원 프로그램 운영&#10;상담 및 복지 서비스 제공" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="donate_contact_phone">후원 문의 전화번호</Label>
                <Input id="donate_contact_phone" value={settings.donate_contact_phone} onChange={(e) => update("donate_contact_phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donate_contact_email">후원 문의 이메일</Label>
                <Input id="donate_contact_email" value={settings.donate_contact_email} onChange={(e) => update("donate_contact_email", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 문의 페이지 - 연락처 추가 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>문의 페이지 설정</CardTitle>
            <CardDescription>문의 페이지의 FAX 번호, 지도 임베드 URL, 교통안내 정보를 설정합니다. 주소, 전화, 이메일, 운영시간은 위 푸터 기관 정보와 공유됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_fax">FAX 번호</Label>
              <Input id="contact_fax" value={settings.contact_fax} onChange={(e) => update("contact_fax", e.target.value)} placeholder="053-XXX-XXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_map_embed">지도 임베드 URL</Label>
              <Input id="contact_map_embed" value={settings.contact_map_embed} onChange={(e) => update("contact_map_embed", e.target.value)} placeholder="https://map.naver.com/p/... 또는 카카오맵 임베드 URL" />
              <p className="text-xs text-muted-foreground">네이버 지도 또는 카카오맵에서 '공유 → 임베드' URL을 복사하여 붙여넣으세요. 비워두면 기본 주소 기반 지도가 표시됩니다.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_transport">교통안내 (줄바꿈: Enter 사용)</Label>
              <Textarea id="contact_transport" value={settings.contact_transport} onChange={(e) => update("contact_transport", e.target.value)} rows={3} placeholder="대중교통: 지하철 O호선 OO역 O번 출구&#10;버스: OOO번 OO정류장 하차" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>푸터 - SNS 링크</CardTitle>
            <CardDescription>SNS 링크를 입력하면 푸터에 표시됩니다. 비워두면 표시되지 않습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="footer_sns_blog">블로그 URL</Label>
                <Input id="footer_sns_blog" value={settings.footer_sns_blog} onChange={(e) => update("footer_sns_blog", e.target.value)} placeholder="https://blog.naver.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_sns_youtube">YouTube URL</Label>
                <Input id="footer_sns_youtube" value={settings.footer_sns_youtube} onChange={(e) => update("footer_sns_youtube", e.target.value)} placeholder="https://youtube.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_sns_instagram">Instagram URL</Label>
                <Input id="footer_sns_instagram" value={settings.footer_sns_instagram} onChange={(e) => update("footer_sns_instagram", e.target.value)} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_sns_facebook">Facebook URL</Label>
                <Input id="footer_sns_facebook" value={settings.footer_sns_facebook} onChange={(e) => update("footer_sns_facebook", e.target.value)} placeholder="https://facebook.com/..." />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
