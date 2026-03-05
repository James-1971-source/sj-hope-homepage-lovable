import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Newspaper } from "lucide-react";

export default function YouthNews() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["youth-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youth_news")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <div className="bg-muted/30 py-12 md:py-16">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              청소년 늬우스
            </h1>
            <p className="text-muted-foreground">
              매월 업데이트되는 청소년 뉴스를 확인하세요
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>등록된 청소년 늬우스가 없습니다.</p>
            </div>
          ) : (
            (() => {
              const latest = items[0];
              return (
                <div className="flex justify-center">
                  <a
                    href={latest.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-md w-full"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={latest.image_url}
                        alt={latest.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {latest.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        클릭하면 오늘의 최신 청소년 뉴스를 볼 수 있습니다
                      </p>
                    </div>
                  </a>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </Layout>
  );
}
