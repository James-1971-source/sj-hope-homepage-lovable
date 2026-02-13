import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  category: string;
  title: string;
  content: string | null;
  cover_image: string | null;
  created_at: string;
  pinned: boolean;
}

const categoryColors: Record<string, string> = {
  공지사항: "bg-primary text-primary-foreground",
  활동소식: "bg-accent text-accent-foreground",
  행사안내: "bg-success text-success-foreground",
};

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout>
        <section className="bg-secondary py-16 md:py-20">
          <div className="container-wide">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        </section>
        <section className="section-padding">
          <div className="container-wide max-w-4xl">
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-wide text-center py-16">
            <p className="text-muted-foreground mb-4">게시글을 찾을 수 없습니다.</p>
            <Button onClick={() => navigate("/news")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/news" className="hover:text-secondary-foreground">소식</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{post.category}</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-foreground">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <Badge className={categoryColors[post.category] || "bg-muted"}>
              {post.category}
            </Badge>
            {post.pinned && (
              <Badge variant="outline" className="text-primary border-primary">
                중요
              </Badge>
            )}
            <div className="flex items-center gap-1 text-sm text-secondary-foreground/70">
              <Calendar className="h-4 w-4" />
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          {post.cover_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none text-foreground whitespace-pre-wrap [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          <div className="mt-12 pt-8 border-t border-border">
            <Button variant="outline" onClick={() => navigate("/news")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
