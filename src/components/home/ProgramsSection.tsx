import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Heart, Palette } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import programEducation from "@/assets/program-education.jpg";
import programCounseling from "@/assets/program-counseling.jpg";
import programCulture from "@/assets/program-culture.jpg";

const programs = [
  {
    id: "education",
    title: "학습지원",
    description: "기초학습 지도, 멘토링, 진로상담 등을 통해 청소년들의 학업 역량을 키워갑니다.",
    icon: BookOpen,
    image: programEducation,
    link: "/programs?category=education",
  },
  {
    id: "counseling",
    title: "상담·복지",
    description: "전문 상담사와 함께 청소년들의 마음 건강과 정서적 안정을 지원합니다.",
    icon: Heart,
    image: programCounseling,
    link: "/programs?category=counseling",
  },
  {
    id: "culture",
    title: "문화·체험",
    description: "다양한 문화예술 활동과 체험 프로그램으로 창의성과 사회성을 길러줍니다.",
    icon: Palette,
    image: programCulture,
    link: "/programs?category=culture",
  },
];

export default function ProgramsSection() {
  const { settings } = useSiteSettings();

  return (
    <section className="section-padding bg-warm-cream">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {settings.programs_badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {settings.programs_title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {settings.programs_subtitle}
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <Link
              key={program.id}
              to={program.link}
              className="group card-warm overflow-hidden p-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <program.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {program.title}
                </h3>
                <p className="text-muted-foreground mb-4">{program.description}</p>
                <div className="flex items-center text-primary font-medium">
                  자세히 보기
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/programs">
              전체 프로그램 보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
