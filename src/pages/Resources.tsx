import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, FileText, Download, Search, Calendar, FileDown, Loader2, ChevronLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const ITEMS_PER_PAGE = 15;

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);

  const handleDownload = (resource: Resource) => {
    window.open(resource.file_url, "_blank");
  };

  const getFileType = (url: string) => {
    if (url.includes("claude.site")) return "EMBED";
    const ext = url.split(".").pop()?.split("?")[0]?.toUpperCase() || "FILE";
    if (ext === "HTM" || ext === "HTML") return "HTML";
    return ext.length > 5 ? "LINK" : ext;
  };

  const isViewType = (url: string) => {
    const type = getFileType(url);
    return ["HTML", "EMBED", "LINK"].includes(type) || url.includes("claude.site");
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

      {/* Resources Table */}
      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredResources.length > 0 ? (
            <>
              {/* Result count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  총 <span className="font-semibold text-foreground">{filteredResources.length}</span>건
                  {totalPages > 1 && ` (${currentPage}/${totalPages} 페이지)`}
                </p>
              </div>

              {/* Compact Table */}
              <div className="bg-background rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-16 text-center">번호</TableHead>
                      <TableHead className="w-28">분류</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead className="w-20 text-center hidden sm:table-cell">형식</TableHead>
                      <TableHead className="w-28 text-center hidden md:table-cell">등록일</TableHead>
                      <TableHead className="w-24 text-center">다운로드</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResources.map((resource, index) => (
                      <TableRow
                        key={resource.id}
                        className="hover:bg-muted/30 cursor-pointer"
                        onClick={() => handleDownload(resource)}
                      >
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {filteredResources.length - ((currentPage - 1) * ITEMS_PER_PAGE + index)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {resource.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="font-medium text-foreground truncate">
                              {resource.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {getFileType(resource.file_url)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground hidden md:table-cell">
                          {new Date(resource.created_at).toLocaleDateString("ko-KR")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(resource);
                            }}
                            className="gap-1 text-primary hover:text-primary/80"
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">받기</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 2) return true;
                      return false;
                    })
                    .map((page, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && page - prev > 1;
                      return (
                        <span key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-2 text-muted-foreground">…</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className="w-9"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </span>
                      );
                    })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
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
