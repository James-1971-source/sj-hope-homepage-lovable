import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, BookOpen, Images, Video, FolderOpen, Heart, Users, MessageSquare,
  Eye, TrendingUp, Calendar, BarChart3,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  posts: number;
  programs: number;
  galleries: number;
  videos: number;
  resources: number;
  donations: number;
  volunteers: number;
  messages: number;
}

interface VisitorStats {
  today: number;
  week: number;
  month: number;
  total: number;
}

interface TopContent {
  page_path: string;
  page_title: string;
  view_count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    posts: 0, programs: 0, galleries: 0, videos: 0,
    resources: 0, donations: 0, volunteers: 0, messages: 0,
  });
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    today: 0, week: 0, month: 0, total: 0,
  });
  const [topContents, setTopContents] = useState<TopContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Content stats
        const [
          { count: posts }, { count: programs }, { count: galleries },
          { count: videos }, { count: resources }, { count: donations },
          { count: volunteers }, { count: messages },
        ] = await Promise.all([
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("programs").select("*", { count: "exact", head: true }),
          supabase.from("gallery_albums").select("*", { count: "exact", head: true }),
          supabase.from("videos").select("*", { count: "exact", head: true }),
          supabase.from("resources").select("*", { count: "exact", head: true }),
          supabase.from("donation_inquiries").select("*", { count: "exact", head: true }),
          supabase.from("volunteer_applications").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          posts: posts || 0, programs: programs || 0,
          galleries: galleries || 0, videos: videos || 0,
          resources: resources || 0, donations: donations || 0,
          volunteers: volunteers || 0, messages: messages || 0,
        });

        // Visitor stats
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const [
          { count: todayCount },
          { count: weekCount },
          { count: monthCount },
          { count: totalCount },
        ] = await Promise.all([
          supabase.from("page_views").select("*", { count: "exact", head: true })
            .gte("created_at", todayStart),
          supabase.from("page_views").select("*", { count: "exact", head: true })
            .gte("created_at", weekStart),
          supabase.from("page_views").select("*", { count: "exact", head: true })
            .gte("created_at", monthStart),
          supabase.from("page_views").select("*", { count: "exact", head: true }),
        ]);

        setVisitorStats({
          today: todayCount || 0,
          week: weekCount || 0,
          month: monthCount || 0,
          total: totalCount || 0,
        });

        // Top 10 content by views - fetch all page_views and aggregate client-side
        const { data: allViews } = await supabase
          .from("page_views")
          .select("page_path, page_title");

        if (allViews) {
          const countMap = new Map<string, { title: string; count: number }>();
          for (const v of allViews) {
            const key = v.page_path;
            const existing = countMap.get(key);
            if (existing) {
              existing.count++;
            } else {
              countMap.set(key, { title: v.page_title || v.page_path, count: 1 });
            }
          }
          const sorted = Array.from(countMap.entries())
            .map(([path, { title, count }]) => ({ page_path: path, page_title: title, view_count: count }))
            .sort((a, b) => b.view_count - a.view_count)
            .slice(0, 10);
          setTopContents(sorted);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const statCards = [
    { label: "공지/소식", value: stats.posts, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "프로그램", value: stats.programs, icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "갤러리", value: stats.galleries, icon: Images, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "영상", value: stats.videos, icon: Video, color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "자료실", value: stats.resources, icon: FolderOpen, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "후원문의", value: stats.donations, icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "봉사신청", value: stats.volunteers, icon: Users, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "문의", value: stats.messages, icon: MessageSquare, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  const visitorCards = [
    { label: "오늘 방문", value: visitorStats.today, icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "최근 7일", value: visitorStats.week, icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "이번 달", value: visitorStats.month, icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "전체 방문", value: visitorStats.total, icon: BarChart3, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">대시보드</h1>
          <p className="text-muted-foreground mt-1">S&J희망나눔 관리자 페이지에 오신 것을 환영합니다.</p>
        </div>

        {/* Visitor Stats */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Eye className="h-5 w-5" /> 방문자 현황
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visitorCards.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : stat.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Stats */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5" /> 콘텐츠 현황
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top 10 Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> 인기 콘텐츠 TOP 10
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">로딩 중...</p>
            ) : topContents.length === 0 ? (
              <p className="text-muted-foreground">아직 방문 데이터가 없습니다.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">순위</TableHead>
                    <TableHead>페이지</TableHead>
                    <TableHead>경로</TableHead>
                    <TableHead className="text-right w-24">조회수</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topContents.map((item, index) => (
                    <TableRow key={item.page_path} className="h-10">
                      <TableCell className="text-center font-medium">
                        {index < 3 ? (
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            {index + 1}
                          </Badge>
                        ) : (
                          index + 1
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.page_title}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{item.page_path}</TableCell>
                      <TableCell className="text-right font-bold">{item.view_count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              왼쪽 메뉴에서 관리할 항목을 선택해주세요.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>공지/소식:</strong> 공지사항, 활동소식, 행사안내 등을 관리합니다.</li>
              <li><strong>프로그램:</strong> 운영 중인 프로그램 정보를 관리합니다.</li>
              <li><strong>갤러리:</strong> 활동 사진 앨범을 관리합니다.</li>
              <li><strong>영상:</strong> YouTube 영상을 관리합니다.</li>
              <li><strong>자료실:</strong> 다운로드 가능한 서식 및 문서를 관리합니다.</li>
              <li><strong>후원문의:</strong> 후원 신청 내역을 확인합니다.</li>
              <li><strong>봉사신청:</strong> 자원봉사 신청 내역을 확인합니다.</li>
              <li><strong>문의:</strong> 일반 문의 내역을 확인합니다.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
