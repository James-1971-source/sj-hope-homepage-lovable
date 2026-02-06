import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { usePrograms } from "@/hooks/usePrograms";
import programEducation from "@/assets/program-education.jpg";

export default function Programs() {
  const { programs, loading } = usePrograms();

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <span>사업소개</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            사업소개
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            청소년들의 건강한 성장을 위한 다양한 프로그램을 운영하고 있습니다.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : programs.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">등록된 프로그램이 없습니다.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {programs.map((program) => {
                const image = program.images?.[0] || programEducation;
                return (
                  <div
                    key={program.id}
                    className="card-warm overflow-hidden p-0 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={image}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {program.title}
                      </h3>
                      {program.summary && (
                        <p className="text-muted-foreground mb-4">{program.summary}</p>
                      )}
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        {program.target && (
                          <p><span className="font-medium text-foreground">대상:</span> {program.target}</p>
                        )}
                        {program.schedule && (
                          <p><span className="font-medium text-foreground">일정:</span> {program.schedule}</p>
                        )}
                      </div>
                      {program.tags && program.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {program.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="cta-band">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            프로그램에 대해 궁금하신 점이 있으신가요?
          </h2>
          <p className="text-primary-foreground/90 mb-8">
            언제든지 문의해 주세요. 친절하게 안내해 드리겠습니다.
          </p>
          <Button variant="hero" size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link to="/contact">문의하기</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
