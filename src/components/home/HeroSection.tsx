import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Phone } from "lucide-react";
import heroImageDefault from "@/assets/hero-youth.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function HeroSection() {
  const { settings } = useSiteSettings();

  const heroImage = settings.hero_image_url || heroImageDefault;
  const titleLines = (settings.hero_title || "청소년의 꿈과 희망을\n함께 키워갑니다").split("\n");

  const stats = [
    { label: settings.hero_stat_1_label, value: settings.hero_stat_1_value },
    { label: settings.hero_stat_2_label, value: settings.hero_stat_2_value },
    { label: settings.hero_stat_3_label, value: settings.hero_stat_3_value },
    { label: settings.hero_stat_4_label, value: settings.hero_stat_4_value },
  ];

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="S&J희망나눔 청소년 활동"
          className="w-full h-full object-cover"
        />
        {settings.hero_overlay_color && settings.hero_overlay_color !== "none" && (
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${settings.hero_overlay_color}e6 0%, ${settings.hero_overlay_color}cc 50%, ${settings.hero_overlay_color}d9 100%)`
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <span className="inline-block bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              {settings.hero_badge}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {titleLines.map((line, i) => (
              <span key={i}>{line}{i < titleLines.length - 1 && <br />}</span>
            ))}
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: "0.1s", textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {settings.hero_subtitle}
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
          {stats.map((stat) => (
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
