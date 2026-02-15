import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ChevronRight, Calendar, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecruitmentPosts } from "@/hooks/useRecruitmentPosts";

export default function Recruitment() {
  const { posts, loading } = useRecruitmentPosts(true);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("ko-KR") : "";

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/volunteer" className="hover:text-secondary-foreground">참여</Link>
            <ChevronRight className="h-4 w-4" />
            <span>재능기부활동가 모집</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            재능기부활동가 모집
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            청소년들에게 외국어와 IT 교육을 지도할 재능기부활동가를 모집합니다.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">현재 진행 중인 모집 공고가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-8 max-w-3xl mx-auto">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
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
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-primary text-primary-foreground">모집중</Badge>
                      {(post.start_date || post.end_date) && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.start_date)} ~ {formatDate(post.end_date)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {post.title}
                    </h2>
                    {post.content && (
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
