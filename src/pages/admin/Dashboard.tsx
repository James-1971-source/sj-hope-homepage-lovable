import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FileText, BookOpen, Images, FolderOpen, Heart, Users, MessageSquare } from "lucide-react";

interface DashboardStats {
  posts: number;
  programs: number;
  galleries: number;
  resources: number;
  donations: number;
  volunteers: number;
  messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    posts: 0,
    programs: 0,
    galleries: 0,
    resources: 0,
    donations: 0,
    volunteers: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: posts },
          { count: programs },
          { count: galleries },
          { count: resources },
          { count: donations },
          { count: volunteers },
          { count: messages },
        ] = await Promise.all([
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("programs").select("*", { count: "exact", head: true }),
          supabase.from("gallery_albums").select("*", { count: "exact", head: true }),
          supabase.from("resources").select("*", { count: "exact", head: true }),
          supabase.from("donation_inquiries").select("*", { count: "exact", head: true }),
          supabase.from("volunteer_applications").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          posts: posts || 0,
          programs: programs || 0,
          galleries: galleries || 0,
          resources: resources || 0,
          donations: donations || 0,
          volunteers: volunteers || 0,
          messages: messages || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "공지/소식", value: stats.posts, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "프로그램", value: stats.programs, icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "갤러리", value: stats.galleries, icon: Images, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "자료실", value: stats.resources, icon: FolderOpen, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "후원문의", value: stats.donations, icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "봉사신청", value: stats.volunteers, icon: Users, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "문의", value: stats.messages, icon: MessageSquare, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">대시보드</h1>
          <p className="text-muted-foreground mt-1">S&J희망나눔 관리자 페이지에 오신 것을 환영합니다.</p>
        </div>

        {/* Stats Grid */}
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
