import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, BookOpen, Heart, Palette, Users, ArrowRight } from "lucide-react";
import programEducation from "@/assets/program-education.jpg";
import programCounseling from "@/assets/program-counseling.jpg";
import programCulture from "@/assets/program-culture.jpg";

const categories = [
  { id: "all", name: "전체", icon: Users },
  { id: "education", name: "학습지원", icon: BookOpen },
  { id: "counseling", name: "상담·복지", icon: Heart },
  { id: "culture", name: "문화·체험", icon: Palette },
];

const programs = [
  {
    id: 1,
    category: "education",
    title: "청소년 학습 멘토링",
    summary: "대학생 멘토와 함께하는 1:1 학습 지원 프로그램",
    target: "중·고등학생",
    schedule: "주 2회, 2시간",
    image: programEducation,
    tags: ["학습지원", "멘토링", "진로상담"],
  },
  {
    id: 2,
    category: "education",
    title: "기초학력 향상 프로그램",
    summary: "국어, 영어, 수학 기초학력 집중 지원",
    target: "초등학생, 중학생",
    schedule: "주 3회",
    image: programEducation,
    tags: ["기초학력", "국영수"],
  },
  {
    id: 3,
    category: "counseling",
    title: "청소년 심리상담",
    summary: "전문 상담사와 함께하는 개인 및 집단 상담",
    target: "청소년",
    schedule: "예약제",
    image: programCounseling,
    tags: ["심리상담", "정서지원"],
  },
  {
    id: 4,
    category: "counseling",
    title: "가족상담 프로그램",
    summary: "청소년과 가족이 함께하는 관계 개선 프로그램",
    target: "청소년 및 가족",
    schedule: "월 2회",
    image: programCounseling,
    tags: ["가족상담", "관계회복"],
  },
  {
    id: 5,
    category: "culture",
    title: "문화예술 체험활동",
    summary: "미술, 음악, 연극 등 다양한 예술 체험",
    target: "초·중·고등학생",
    schedule: "월 1~2회",
    image: programCulture,
    tags: ["문화체험", "예술활동"],
  },
  {
    id: 6,
    category: "culture",
    title: "진로체험 캠프",
    summary: "다양한 직업 탐색과 진로 설계 프로그램",
    target: "중·고등학생",
    schedule: "방학 중",
    image: programCulture,
    tags: ["진로탐색", "캠프"],
  },
];

export default function Programs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "all";

  const filteredPrograms = categoryFilter === "all"
    ? programs
    : programs.filter((p) => p.category === categoryFilter);

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

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

      {/* Category Filter */}
      <section className="py-8 border-b border-border sticky top-16 md:top-20 bg-background z-40">
        <div className="container-wide">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={categoryFilter === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(cat.id)}
                className="gap-2"
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPrograms.map((program) => (
              <Link
                key={program.id}
                to={`/programs/${program.id}`}
                className="card-warm overflow-hidden p-0 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {categories.find((c) => c.id === program.category)?.name}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{program.summary}</p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p><span className="font-medium text-foreground">대상:</span> {program.target}</p>
                    <p><span className="font-medium text-foreground">일정:</span> {program.schedule}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {program.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-primary font-medium">
                    자세히 보기
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
