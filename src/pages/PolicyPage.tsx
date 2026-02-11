import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

export default function PolicyPage() {
  const location = useLocation();
  const isPrivacy = location.pathname === "/privacy";
  const pageKey = isPrivacy ? "privacy" : "terms";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("page_contents")
        .select("title, content")
        .eq("page_key", pageKey)
        .eq("section_key", "main")
        .single();

      if (data) {
        setTitle(data.title || "");
        setContent(data.content || "");
      }
      setLoading(false);
    };
    fetch();
  }, [pageKey]);

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold mt-8 mb-3 text-foreground">{line.slice(3)}</h2>;
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold mt-4 text-foreground">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith("- **")) {
        const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) {
          return <li key={i} className="ml-4 list-disc text-muted-foreground"><strong className="text-foreground">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</li>;
        }
      }
      if (line.startsWith("- ")) {
        return <li key={i} className="ml-4 list-disc text-muted-foreground">{line.slice(2)}</li>;
      }
      if (/^\d+\.\s/.test(line)) {
        return <li key={i} className="ml-4 list-decimal text-muted-foreground">{line.replace(/^\d+\.\s/, "")}</li>;
      }
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
    });
  };

  return (
    <Layout>
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container-wide text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{title || (isPrivacy ? "개인정보처리방침" : "이용약관")}</h1>
        </div>
      </div>
      <div className="container-wide py-12 md:py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto prose-sm">
            {renderMarkdown(content)}
          </div>
        )}
      </div>
    </Layout>
  );
}
