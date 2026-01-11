import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, FileText, Download, Search, Calendar, FileDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "all", name: "전체" },
  { id: "form", name: "신청서/서식" },
  { id: "report", name: "보고서" },
  { id: "guide", name: "안내자료" },
];

const resources = [
  {
    id: 1,
    category: "form",
    title: "자원봉사 신청서",
    description: "자원봉사 활동 신청을 위한 서식입니다.",
    fileType: "HWP",
    fileSize: "45KB",
    date: "2024-01-10",
  },
  {
    id: 2,
    category: "form",
    title: "후원 신청서",
    description: "정기/일시 후원 신청을 위한 서식입니다.",
    fileType: "PDF",
    fileSize: "120KB",
    date: "2024-01-08",
  },
  {
    id: 3,
    category: "report",
    title: "2023년 연간 활동보고서",
    description: "2023년 S&J희망나눔의 주요 활동과 성과를 정리한 보고서입니다.",
    fileType: "PDF",
    fileSize: "2.5MB",
    date: "2024-01-05",
  },
  {
    id: 4,
    category: "guide",
    title: "프로그램 안내 리플렛",
    description: "주요 프로그램에 대한 안내 자료입니다.",
    fileType: "PDF",
    fileSize: "850KB",
    date: "2024-01-03",
  },
  {
    id: 5,
    category: "form",
    title: "개인정보 수집·이용 동의서",
    description: "프로그램 참여 및 후원 시 필요한 동의서입니다.",
    fileType: "HWP",
    fileSize: "35KB",
    date: "2023-12-28",
  },
  {
    id: 6,
    category: "report",
    title: "2023년 결산보고서",
    description: "2023년 재정 운영 현황 보고서입니다.",
    fileType: "PDF",
    fileSize: "1.2MB",
    date: "2023-12-20",
  },
];

const categoryNames: Record<string, string> = {
  form: "신청서/서식",
  report: "보고서",
  guide: "안내자료",
};

export default function Resources() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources
    .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
    .filter((item) =>
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleDownload = (resource: typeof resources[0]) => {
    // In a real app, this would trigger a file download
    alert(`다운로드: ${resource.title}.${resource.fileType.toLowerCase()}`);
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
          {filteredResources.length > 0 ? (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="card-warm flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{categoryNames[resource.category]}</Badge>
                        <Badge variant="secondary">{resource.fileType}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground truncate">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{resource.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-sm text-muted-foreground hidden sm:block">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {resource.date}
                      </div>
                      <div className="mt-1">{resource.fileSize}</div>
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
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
