import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Loader2 } from "lucide-react";
import type { Program } from "@/hooks/usePrograms";
import programEducation from "@/assets/program-education.jpg";

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", id!)
        .single();
      if (!error) setProgram(data);
      setLoading(false);
    };
    if (id) fetch();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!program) {
    return (
      <Layout>
        <div className="py-32 text-center text-muted-foreground">
          프로그램을 찾을 수 없습니다.
        </div>
      </Layout>
    );
  }

  const heroImage = program.images?.[0] || programEducation;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/programs" className="hover:text-secondary-foreground">사업소개</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{program.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            {program.title}
          </h1>
          {program.summary && (
            <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
              {program.summary}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src={heroImage}
              alt={program.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          {/* Meta */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {program.target && (
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">대상</p>
                <p className="font-medium text-foreground">{program.target}</p>
              </div>
            )}
            {program.schedule && (
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">일정</p>
                <p className="font-medium text-foreground">{program.schedule}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {program.tags && program.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {program.tags.map((tag) => (
                <span key={tag} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Body Content */}
          {program.content && (
            <div className="prose prose-lg max-w-none text-foreground whitespace-pre-wrap">
              {program.content}
            </div>
          )}

          {/* Additional Images */}
          {program.images && program.images.length > 1 && (
            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              {program.images.slice(1).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <img src={img} alt={`${program.title} ${i + 2}`} className="w-full h-56 object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
