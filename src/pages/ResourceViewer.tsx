import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Loader2, Download, ExternalLink } from "lucide-react";

export default function ResourceViewer() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url") || "";
  const title = searchParams.get("title") || "자료 보기";
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isHtmlFile = /\.html?/i.test(url) || url.includes(".html");

  useEffect(() => {
    if (!isHtmlFile || !url) {
      setLoading(false);
      return;
    }

    const fetchHtml = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const text = await res.text();
        setHtmlContent(text);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHtml();
  }, [url, isHtmlFile]);

  return (
    <Layout>
      <section className="bg-secondary py-8">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-3">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/resources" className="hover:text-secondary-foreground">자료실</Link>
            <ChevronRight className="h-4 w-4" />
            <span>자료 보기</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-secondary-foreground truncate">
              {title}
            </h1>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" asChild>
                <Link to="/resources">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  목록
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}>
                <ExternalLink className="h-4 w-4 mr-1" />
                새 창
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="container-wide">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">파일을 불러올 수 없습니다.</p>
              <Button onClick={() => window.open(url, "_blank")}>
                <Download className="h-4 w-4 mr-2" />
                직접 다운로드
              </Button>
            </div>
          ) : (
            <div className="bg-background rounded-lg border overflow-hidden">
              <iframe
                srcDoc={isHtmlFile ? (htmlContent || undefined) : undefined}
                src={!isHtmlFile ? url : undefined}
                title={title}
                className="w-full border-0"
                style={{ minHeight: "80vh" }}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
