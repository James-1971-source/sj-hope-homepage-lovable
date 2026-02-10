import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Heart, Palette, Globe, GraduationCap, Users, Building } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useHomepagePrograms } from "@/hooks/useHomepagePrograms";
import programEducation from "@/assets/program-education.jpg";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Heart, Palette, Globe, GraduationCap, Users, Building,
};

export default function ProgramsSection() {
  const { settings } = useSiteSettings();
  const { programs, loading } = useHomepagePrograms();

  if (loading || programs.length === 0) return null;

  return (
    <section className="section-padding bg-warm-cream">
      <div className="container-wide">
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

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => {
            const IconComp = iconMap[program.icon] || BookOpen;
            const image = program.image_url || programEducation;
            return (
              <Link
                key={program.id}
                to={program.link || "/programs"}
                className="group card-warm overflow-hidden p-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                      <IconComp className="h-6 w-6 text-primary-foreground" />
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
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/programs">
              전체 사업 보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
