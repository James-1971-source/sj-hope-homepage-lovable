import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface Post {
  id: string;
  category: string;
  title: string;
  content: string | null;
  created_at: string;
  pinned: boolean;
}

const categoryColors: Record<string, string> = {
  공지사항: "bg-primary text-primary-foreground",
  활동소식: "bg-accent text-accent-foreground",
  행사안내: "bg-success text-success-foreground",
};

export default function NewsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getExcerpt = (content: string | null) => {
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > 80 ? plainText.substring(0, 80) + "..." : plainText;
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {settings.news_badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {settings.news_title}
            </h2>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/news">
              전체 보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* News List - 2열 카드 레이아웃 */}
        {posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {posts.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group card-warm flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <Badge className={categoryColors[item.category] || "bg-muted"}>
                    {item.category}
                  </Badge>
                  {item.pinned && (
                    <Badge variant="outline" className="text-primary border-primary/40 text-xs">
                      중요
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                {getExcerpt(item.content) && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {getExcerpt(item.content)}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto pt-2 border-t border-border/50">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(item.created_at)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            등록된 소식이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
