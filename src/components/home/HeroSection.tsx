import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Phone } from "lucide-react";
import heroImage from "@/assets/hero-youth.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="S&J희망나눔 청소년 활동"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(228, 105, 60, 0.85) 0%, rgba(237, 137, 54, 0.75) 50%, rgba(228, 105, 60, 0.7) 100%)"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <span className="inline-block bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              사단법인 S&J희망나눔
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up leading-tight">
            청소년의 꿈과 희망을<br />
            함께 키워갑니다
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            교육, 상담, 문화 프로그램을 통해 청소년들이 건강하게 성장하고
            밝은 미래를 꿈꿀 수 있도록 지원합니다.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="xl" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/donate">
                <Heart className="h-5 w-5" />
                후원하기
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/programs">
                프로그램 보기
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/contact">
                <Phone className="h-5 w-5" />
                문의하기
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {[
            { label: "설립연도", value: "2015년" },
            { label: "누적 수혜 청소년", value: "5,000+" },
            { label: "진행 프로그램", value: "50+" },
            { label: "자원봉사자", value: "300+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-primary-foreground/15 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-sm text-primary-foreground/80 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
