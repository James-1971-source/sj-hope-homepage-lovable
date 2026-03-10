import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronRight, Calendar, Search, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Post {
  id: string;
  category: string;
  title: string;
  content: string | null;
  created_at: string;
  pinned: boolean;
}

const categories = [
  { id: "all", name: "전체" },
  { id: "공지사항", name: "공지사항" },
  { id: "활동소식", name: "활동소식" },
  { id: "행사안내", name: "행사안내" },
];

const categoryColors: Record<string, string> = {
  공지사항: "bg-primary text-primary-foreground",
  활동소식: "bg-accent text-accent-foreground",
  행사안내: "bg-success text-success-foreground",
};

const ITEMS_PER_PAGE = 15;

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryFilter = searchParams.get("category") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false });
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });

  const filteredNews = posts
    .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
    .filter((item) =>
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      handlePageChange(1);
    }
  }, [filteredNews.length]);

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <span>소식</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            공지사항 및 소식
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            S&J희망나눔의 다양한 소식과 활동을 전해드립니다.
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
                  onClick={() => handleCategoryChange(cat.id)}
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

      {/* News Table */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-sm text-muted-foreground mb-4">
            총 <span className="font-semibold text-foreground">{filteredNews.length}</span>건
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : paginatedNews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">번호</TableHead>
                  <TableHead className="w-24 text-center">분류</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-28 text-center">등록일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNews.map((item, index) => {
                  const rowNum = filteredNews.length - ((currentPage - 1) * ITEMS_PER_PAGE + index);
                  return (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50 h-10"
                      onClick={() => window.location.href = `/news/${item.id}`}
                    >
                      <TableCell className="text-center text-muted-foreground py-2 text-sm">
                        {item.pinned ? (
                          <Badge variant="outline" className="text-primary border-primary text-xs px-1.5 py-0">
                            중요
                          </Badge>
                        ) : rowNum}
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <Badge className={`${categoryColors[item.category] || "bg-muted"} text-xs px-2 py-0`}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <Link
                          to={`/news/${item.id}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-2 text-xs">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.created_at)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter !== "all"
                  ? "검색 결과가 없습니다."
                  : "등록된 소식이 없습니다."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-8">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">...</span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 text-sm"
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
