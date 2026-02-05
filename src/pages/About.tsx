import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Target, Eye, Users, ChevronRight } from "lucide-react";
import { usePageContents, useHistoryItems, useOrganizationItems, useFacilities } from "@/hooks/usePageContents";

export default function About() {
  const location = useLocation();
  const { getContent, loading: contentLoading } = usePageContents("about");
  const { items: historyItems, loading: historyLoading } = useHistoryItems();
  const { items: organizationItems, loading: orgLoading } = useOrganizationItems();
  const { items: facilities, loading: facilitiesLoading } = useFacilities();

  // 현재 하위 경로에 따라 활성 섹션 결정
  const path = location.pathname;
  const activeSection = path.includes("/mission") ? "mission" :
                       path.includes("/history") ? "history" :
                       path.includes("/organization") ? "organization" :
                       path.includes("/facilities") ? "facilities" : "greeting";

  const greetingContent = getContent("greeting");
  const missionContent = getContent("mission");
  const visionContent = getContent("vision");
  const valuesContent = getContent("values");

  const values = [
    { icon: Target, title: missionContent?.title || "사명", description: missionContent?.content || "" },
    { icon: Eye, title: visionContent?.title || "비전", description: visionContent?.content || "" },
    { icon: Users, title: valuesContent?.title || "핵심가치", description: valuesContent?.content || "" },
  ];

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
            {activeSection !== "greeting" && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span>{getSectionTitle()}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            기관소개
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            S&J희망나눔은 청소년들의 건강한 성장과 밝은 미래를 위해 함께합니다.
          </p>
        </div>
      </section>

      {/* 인사말 섹션 */}
      {(activeSection === "greeting" || activeSection === "mission") && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                인사말
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {greetingContent?.content?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 미션과 비전 섹션 */}
      {(activeSection === "greeting" || activeSection === "mission") && (
        <section className="section-padding bg-warm-cream">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                미션과 비전
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((item) => (
                <div key={item.title} className="card-warm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 연혁 섹션 */}
      {(activeSection === "greeting" || activeSection === "history") && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                연혁
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
                {historyItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative flex items-center gap-6 mb-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                      {index % 2 === 0 && (
                        <div className="card-warm inline-block">
                          <span className="font-bold text-primary">{item.year}</span>
                          <p className="text-muted-foreground mt-1">{item.event}</p>
                        </div>
                      )}
                    </div>
                    <div className="relative z-10 w-4 h-4 rounded-full bg-primary border-4 border-background flex-shrink-0 ml-6 md:ml-0" />
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                      {index % 2 === 1 ? (
                        <div className="card-warm inline-block hidden md:block">
                          <span className="font-bold text-primary">{item.year}</span>
                          <p className="text-muted-foreground mt-1">{item.event}</p>
                        </div>
                      ) : null}
                      <div className="card-warm md:hidden">
                        <span className="font-bold text-primary">{item.year}</span>
                        <p className="text-muted-foreground mt-1">{item.event}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 조직도 섹션 */}
      {(activeSection === "greeting" || activeSection === "organization") && (
        <section className="section-padding bg-muted/50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                조직도
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="card-warm p-8 text-center">
                {/* 최상위 (level 0) */}
                {organizationItems.filter(o => o.level === 0).map((item) => (
                  <div key={item.id} className="inline-block bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-bold text-lg mb-8">
                    {item.name}
                  </div>
                ))}
                
                {/* 연결선 */}
                {organizationItems.filter(o => o.level === 1).length > 0 && (
                  <div className="flex justify-center mb-8">
                    <div className="w-0.5 h-8 bg-border" />
                  </div>
                )}
                
                {/* 중간 (level 1) */}
                {organizationItems.filter(o => o.level === 1).map((item) => (
                  <div key={item.id} className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg mb-8">
                    {item.name}
                  </div>
                ))}
                
                {/* 연결선 */}
                {organizationItems.filter(o => o.level === 2).length > 0 && (
                  <div className="flex justify-center mb-8">
                    <div className="w-0.5 h-8 bg-border" />
                  </div>
                )}
                
                {/* 하위 (level 2) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {organizationItems.filter(o => o.level === 2).map((item) => (
                    <div key={item.id} className="bg-muted px-4 py-3 rounded-xl font-medium text-foreground">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 시설안내 섹션 */}
      {activeSection === "facilities" && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                시설안내
              </h2>
            </div>
            {facilities.length > 0 ? (
              <div className="space-y-12">
                {facilities.map((facility) => (
                  <div key={facility.id} className="card-warm p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">{facility.name}</h3>
                    {facility.description && (
                      <p className="text-muted-foreground mb-6">{facility.description}</p>
                    )}
                    {facility.images && facility.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {facility.images.map((img, idx) => (
                          <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                            <img src={img} alt={`${facility.name} ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                등록된 시설 정보가 없습니다.
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-band">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            함께 희망을 나누어 주세요
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            여러분의 관심과 후원이 청소년들에게 밝은 미래를 선물합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/donate">후원하기</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/volunteer">자원봉사 신청</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
