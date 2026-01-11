import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronRight, Calendar, Eye, Search, ChevronLeft } from "lucide-react";

const categories = [
  { id: "all", name: "전체" },
  { id: "notice", name: "공지사항" },
  { id: "activity", name: "활동소식" },
  { id: "event", name: "행사안내" },
];

const newsItems = [
  {
    id: 1,
    category: "notice",
    title: "2024년 하반기 청소년 멘토링 프로그램 참가자 모집",
    excerpt: "청소년들의 학습과 진로를 함께 고민할 멘토와 멘티를 모집합니다. 많은 관심과 참여 부탁드립니다.",
    date: "2024-01-10",
    views: 156,
    pinned: true,
  },
  {
    id: 2,
    category: "activity",
    title: "겨울방학 문화체험 활동 성료",
    excerpt: "지난 12월 진행된 문화체험 활동에 50명의 청소년이 참여했습니다. 참가자들의 후기와 사진을 공유합니다.",
    date: "2024-01-08",
    views: 89,
  },
  {
    id: 3,
    category: "event",
    title: "2024년 신년맞이 후원자 감사 행사 안내",
    excerpt: "한 해 동안 보내주신 관심과 사랑에 감사드립니다. 후원자분들을 위한 감사 행사를 준비했습니다.",
    date: "2024-01-05",
    views: 124,
  },
  {
    id: 4,
    category: "activity",
    title: "청소년 자기성장 캠프 후기",
    excerpt: "자기 이해와 성장을 위한 2박 3일 캠프가 성공적으로 마무리되었습니다.",
    date: "2024-01-03",
    views: 78,
  },
  {
    id: 5,
    category: "notice",
    title: "2024년 1분기 자원봉사자 모집",
    excerpt: "청소년들과 함께할 자원봉사자를 모집합니다. 학습지도, 문화활동 등 다양한 분야에서 활동하실 수 있습니다.",
    date: "2024-01-02",
    views: 98,
  },
  {
    id: 6,
    category: "event",
    title: "청소년 진로탐색 워크숍 개최 예정",
    excerpt: "다양한 직업군 전문가들과 함께하는 진로탐색 워크숍을 개최합니다.",
    date: "2023-12-28",
    views: 67,
  },
];

const categoryColors: Record<string, string> = {
  notice: "bg-primary text-primary-foreground",
  activity: "bg-accent text-accent-foreground",
  event: "bg-success text-success-foreground",
};

const categoryNames: Record<string, string> = {
  notice: "공지사항",
  activity: "활동소식",
  event: "행사안내",
};

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const categoryFilter = searchParams.get("category") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const filteredNews = newsItems
    .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
    .filter((item) => 
      searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    setSearchParams(params);
  };

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

      {/* News List */}
      <section className="section-padding">
        <div className="container-wide">
          {filteredNews.length > 0 ? (
            <div className="space-y-4">
              {filteredNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="card-warm block group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={categoryColors[item.category]}>
                          {categoryNames[item.category]}
                        </Badge>
                        {item.pinned && (
                          <Badge variant="outline" className="text-primary border-primary">
                            중요
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.views}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button variant="outline" size="icon" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
