import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, FileText, Download, Search, Calendar, FileDown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Resource {
  id: string;
  title: string;
  file_url: string;
  category: string;
  created_at: string;
}

const categories = [
  { id: "all", name: "전체" },
  { id: "신청서/서식", name: "신청서/서식" },
  { id: "보고서", name: "보고서" },
  { id: "안내자료", name: "안내자료" },
  { id: "일반", name: "일반" },
  { id: "소식지", name: "소식지" },
  { id: "후원자 명단", name: "후원자 명단" },
  { id: "회원 명단", name: "회원 명단" },
  { id: "재능기부활동가 명단", name: "재능기부활동가 명단" },
  { id: "S&J 끌레버", name: "S&J 끌레버" },
  { id: "S&J 주니어 끌레버", name: "S&J 주니어 끌레버" },
  { id: "S&J 글로벌 서포터즈", name: "S&J 글로벌 서포터즈" },
  { id: "S&J 온라인 홍보단", name: "S&J 온라인 홍보단" },
  { id: "학술자료", name: "학술자료" },
  { id: "업무협약서", name: "업무협약서" },
  { id: "함께하는 기업 및 기관", name: "함께하는 기업 및 기관" },
];

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching resources:", error);
      } else {
        setResources(data || []);
      }
      setLoading(false);
    };

    fetchResources();
  }, []);

  const filteredResources = resources
    .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
    .filter((item) =>
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleDownload = (resource: Resource) => {
    window.open(resource.file_url, "_blank");
  };

  const getFileType = (url: string) => {
    const ext = url.split(".").pop()?.toUpperCase() || "FILE";
    return ext.length > 5 ? "FILE" : ext;
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <span>자료실</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            자료실
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            각종 서식, 보고서, 안내자료를 다운로드하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-8 border-b border-border">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoryFilter === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resources List */}
      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="card-warm flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{resource.category}</Badge>
                        <Badge variant="secondary">{getFileType(resource.file_url)}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground truncate">{resource.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-sm text-muted-foreground hidden sm:block">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(resource.created_at).toLocaleDateString("ko-KR")}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(resource)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      다운로드
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {resources.length === 0 ? "등록된 자료가 없습니다." : "검색 결과가 없습니다."}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
