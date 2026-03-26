import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Loader2, Download, ExternalLink } from "lucide-react";

export default function ResourceViewer() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url") || "";
  const title = searchParams.get("title") || "자료 보기";
  const from = searchParams.get("from") || "resources";
  const returnTo = searchParams.get("returnTo") || "/resources";
  const returnLabel = searchParams.get("returnLabel") || "목록";
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isHtmlFile = /\.html?/i.test(url) || url.includes(".html");
  const sectionLabel = from === "news" ? "소식" : "자료실";
  const sectionPath = from === "news" ? "/news" : "/resources";
  const pageLabel = from === "news" ? "첨부 보기" : "자료 보기";
  const viewerUrl = `/resources/view${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  useEffect(() => {
    if (!isHtmlFile || !url) {
      setLoading(false);
      return;
    }

    const fetchHtml = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const buffer = await res.arrayBuffer();
        // Try UTF-8 first, then fallback
        let text = new TextDecoder("utf-8").decode(buffer);
        // Ensure charset meta is present for proper rendering
        if (!text.includes("<meta charset") && !text.includes("<meta http-equiv=\"Content-Type\"")) {
          text = text.replace(/<head>/i, '<head><meta charset="UTF-8">');
          if (!text.includes("<head>") && !text.includes("<HEAD>")) {
            text = '<meta charset="UTF-8">' + text;
          }
        }
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
            <Link to={sectionPath} className="hover:text-secondary-foreground">{sectionLabel}</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{pageLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-secondary-foreground truncate">
              {title}
            </h1>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" asChild>
                <Link to={returnTo}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {returnLabel}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(viewerUrl, "_blank", "noopener,noreferrer")}>
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
