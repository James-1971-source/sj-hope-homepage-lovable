import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Target, Eye, Users, ChevronRight } from "lucide-react";
import { usePageContents, useHistoryItems, useOrganizationItems, useFacilities } from "@/hooks/usePageContents";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useMemo } from "react";

export default function About() {
  const location = useLocation();
  const { getContent, loading: contentLoading } = usePageContents("about");
  const { items: historyItems, loading: historyLoading } = useHistoryItems();
  const { items: organizationItems, loading: orgLoading } = useOrganizationItems();
  const { settings } = useSiteSettings();
  const { items: facilities, loading: facilitiesLoading } = useFacilities();

  const path = location.pathname;
  const activeSection = path.includes("/greeting") ? "greeting" :
                       path.includes("/mission") ? "mission" :
                       path.includes("/history") ? "history" :
                       path.includes("/organization") ? "organization" :
                       path.includes("/facilities") ? "facilities" : "greeting";

  const greetingContent = getContent("greeting");
  const missionContent = getContent("mission");
  const visionContent = getContent("vision");
  const valuesContent = getContent("values");

  const values = [
    { icon: Target, title: missionContent?.title || "미션", description: missionContent?.content || "", images: missionContent?.images || [] },
    { icon: Eye, title: visionContent?.title || "비전", description: visionContent?.content || "", images: visionContent?.images || [] },
    { icon: Users, title: valuesContent?.title || "핵심가치", description: valuesContent?.content || "", images: valuesContent?.images || [] },
  ];

  // 연혁: 연도별 그룹핑
  const years = useMemo(() => {
    const yearSet = new Set(historyItems.map(i => i.year));
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
  }, [historyItems]);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const activeYear = selectedYear || years[0] || "";

  const yearItems = useMemo(() => {
    return historyItems
      .filter(i => i.year === activeYear)
      .sort((a, b) => {
        const monthA = (a as any).month || 0;
        const monthB = (b as any).month || 0;
        if (monthA !== monthB) return monthA - monthB;
        const dayA = (a as any).day || 0;
        const dayB = (b as any).day || 0;
        return dayA - dayB;
      });
  }, [historyItems, activeYear]);

  const getSectionTitle = () => {
    switch (activeSection) {
      case "mission": return "미션과 비전";
      case "history": return "연혁";
      case "organization": return "조직도";
      case "facilities": return "시설안내";
      default: return "인사말";
    }
  };

  if (contentLoading || historyLoading || orgLoading || facilitiesLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <span>기관소개</span>
            <ChevronRight className="h-4 w-4" />
            <span>{getSectionTitle()}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            {getSectionTitle()}
          </h1>
        </div>
      </section>

      {/* 인사말 */}
      {activeSection === "greeting" && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">인사말</h2>
              {greetingContent?.content?.startsWith('<') ? (
                <div 
                  className="prose prose-lg max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: greetingContent.content }}
                />
              ) : (
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {greetingContent?.content?.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed mb-4">{paragraph}</p>
                  ))}
                </div>
              )}
              {greetingContent?.images && greetingContent.images.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {greetingContent.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`인사말 이미지 ${idx + 1}`} className="rounded-2xl w-full object-cover" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 미션과 비전 */}
      {activeSection === "mission" && (
        <section className="section-padding bg-warm-cream">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">미션과 비전</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((item) => (
                <div key={item.title} className="card-warm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  {item.images && item.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {item.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`${item.title} ${idx + 1}`} className="rounded-lg w-full h-auto object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 연혁 - 연도별 탭 */}
      {activeSection === "history" && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">연혁</h2>
            </div>
            {years.length > 0 ? (
              <>
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {years.map((year) => (
                    <Button
                      key={year}
                      variant={activeYear === year ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}년
                    </Button>
                  ))}
                </div>
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
                    {yearItems.map((item, index) => {
                      const month = (item as any).month;
                      const day = (item as any).day;
                      const images = (item as any).images as string[] | null;
                      const isLeft = index % 2 === 0;

                      return (
                        <div key={item.id} className="relative mb-10">
                          {/* Center dot */}
                          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
                          
                          {/* Content */}
                          <div className={`flex ${isLeft ? "justify-end pr-[calc(50%+2rem)]" : "justify-start pl-[calc(50%+2rem)]"}`}>
                            <div className="card-warm max-w-sm w-full">
                              {month && (
                                <span className="text-sm font-semibold text-primary">
                                  {month}월{day ? ` ${day}일` : ""}
                                </span>
                              )}
                              <p className="text-foreground mt-1">{item.event}</p>
                              {images && images.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  {images.map((img, idx) => (
                                    <img key={idx} src={img} alt="" className="rounded-lg w-full h-24 object-cover" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {yearItems.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">해당 연도의 연혁이 없습니다.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">등록된 연혁이 없습니다.</p>
            )}
          </div>
        </section>
      )}

      {/* 조직도 */}
      {activeSection === "organization" && (
        <section className="section-padding bg-muted/50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">조직도</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              {settings.organization_image_url ? (
                <div className="card-warm p-8 text-center">
                  <img 
                    src={settings.organization_image_url} 
                    alt="조직도" 
                    className="w-full max-w-3xl mx-auto rounded-xl"
                  />
                </div>
              ) : (
                <div className="card-warm p-8 text-center">
                  {organizationItems.filter(o => o.level === 0).map((item) => (
                    <div key={item.id} className="inline-block bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-bold text-lg mb-8">
                      {item.name}
                    </div>
                  ))}
                  {organizationItems.filter(o => o.level === 1).length > 0 && (
                    <div className="flex justify-center mb-8"><div className="w-0.5 h-8 bg-border" /></div>
                  )}
                  {organizationItems.filter(o => o.level === 1).map((item) => (
                    <div key={item.id} className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg mb-8">
                      {item.name}
                    </div>
                  ))}
                  {organizationItems.filter(o => o.level === 2).length > 0 && (
                    <div className="flex justify-center mb-8"><div className="w-0.5 h-8 bg-border" /></div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {organizationItems.filter(o => o.level === 2).map((item) => (
                      <div key={item.id} className="bg-muted px-4 py-3 rounded-xl font-medium text-foreground">
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 시설안내 */}
      {activeSection === "facilities" && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">시설안내</h2>
            </div>
            {facilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {facilities.map((facility) => (
                  <div key={facility.id} className="card-warm p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">{facility.name}</h3>
                    {facility.description && <p className="text-muted-foreground mb-6">{facility.description}</p>}
                    {facility.images && facility.images.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {facility.images.map((img, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden">
                            <img src={img} alt={`${facility.name} ${idx + 1}`} className="w-full h-auto rounded-lg" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">등록된 시설 정보가 없습니다.</div>
            )}
          </div>
        </section>
      )}

    </Layout>
  );
}
