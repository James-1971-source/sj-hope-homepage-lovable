import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const newsItems = [
  {
    id: 1,
    category: "공지",
    title: "2024년 하반기 청소년 멘토링 프로그램 참가자 모집",
    excerpt: "청소년들의 학습과 진로를 함께 고민할 멘토와 멘티를 모집합니다.",
    date: "2024-01-10",
    views: 156,
    pinned: true,
  },
  {
    id: 2,
    category: "활동",
    title: "겨울방학 문화체험 활동 성료",
    excerpt: "지난 12월 진행된 문화체험 활동에 50명의 청소년이 참여했습니다.",
    date: "2024-01-08",
    views: 89,
  },
  {
    id: 3,
    category: "행사",
    title: "2024년 신년맞이 후원자 감사 행사 안내",
    excerpt: "한 해 동안 보내주신 관심과 사랑에 감사드립니다.",
    date: "2024-01-05",
    views: 124,
  },
  {
    id: 4,
    category: "활동",
    title: "청소년 자기성장 캠프 후기",
    excerpt: "자기 이해와 성장을 위한 2박 3일 캠프가 성공적으로 마무리되었습니다.",
    date: "2024-01-03",
    views: 78,
  },
];

const categoryColors: Record<string, string> = {
  공지: "bg-primary text-primary-foreground",
  활동: "bg-accent text-accent-foreground",
  행사: "bg-success text-success-foreground",
};

export default function NewsSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              소식
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              공지사항 및 소식
            </h2>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/news">
              전체 보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* News List */}
        <div className="grid gap-4">
          {newsItems.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group card-warm flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Badge className={categoryColors[item.category] || "bg-muted"}>
                  {item.category}
                </Badge>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate flex-1">
                  {item.pinned && (
                    <span className="text-primary mr-2">[중요]</span>
                  )}
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {item.views}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
