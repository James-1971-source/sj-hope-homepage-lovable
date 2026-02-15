import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecruitmentPosts } from "@/hooks/useRecruitmentPosts";

export default function RecruitmentSection() {
  const { posts, loading } = useRecruitmentPosts(true);

  // Only show featured posts on homepage
  const featuredPosts = posts.filter((p) => p.is_featured);

  if (loading) {
    return (
      <section className="section-padding bg-primary/5">
        <div className="container-wide">
          <Skeleton className="h-10 w-64 mx-auto mb-8" />
          <Skeleton className="h-64 w-full max-w-2xl mx-auto rounded-xl" />
        </div>
      </section>
    );
  }

  if (featuredPosts.length === 0) return null;

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("ko-KR") : "";

  return (
    <section className="section-padding bg-primary/5">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Megaphone className="h-4 w-4" />
            모집공고
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            재능기부활동가를 모집합니다
          </h2>
        </div>

        {/* Cards */}
        <div
          className={`grid gap-8 ${
            featuredPosts.length === 1
              ? "max-w-2xl mx-auto"
              : "md:grid-cols-2 max-w-5xl mx-auto"
          }`}
        >
          {featuredPosts.map((post) => (
            <Link
              key={post.id}
              to="/recruitment"
              className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border"
            >
              {post.poster_image && (
                <div className="w-full">
                  <img
                    src={post.poster_image}
                    alt={post.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h3>
                {(post.start_date || post.end_date) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(post.start_date)} ~ {formatDate(post.end_date)}
                    </span>
                  </div>
                )}
                {post.content && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {post.content.replace(/<[^>]*>/g, "").slice(0, 100)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/recruitment">
              모집공고 전체보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
