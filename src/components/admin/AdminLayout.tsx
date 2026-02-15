import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Images,
  Video,
  FolderOpen,
  Heart,
  Users,
  MessageSquare,
  LogOut,
  Home,
  Menu,
  X,
  Settings,
  Building2,
  Layers,
  Handshake,
  Megaphone,
} from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

const navItems = [
  { path: "/admin", label: "대시보드", icon: LayoutDashboard },
  { path: "/admin/settings", label: "사이트 설정", icon: Settings },
  { path: "/admin/banners", label: "배너 관리", icon: Images },
  { path: "/admin/pages", label: "페이지 관리", icon: Building2 },
  { path: "/admin/homepage-programs", label: "메인 사업소개", icon: Layers },
  { path: "/admin/partners", label: "함께하는 기관", icon: Handshake },
  { path: "/admin/posts", label: "공지/소식", icon: FileText },
  { path: "/admin/recruitment", label: "모집공고", icon: Megaphone },
  { path: "/admin/programs", label: "사업소개", icon: BookOpen },
  { path: "/admin/gallery", label: "갤러리", icon: Images },
  { path: "/admin/videos", label: "영상", icon: Video },
  { path: "/admin/resources", label: "자료실", icon: FolderOpen },
  { path: "/admin/donations", label: "후원문의", icon: Heart },
  { path: "/admin/volunteers", label: "봉사신청", icon: Users },
  { path: "/admin/messages", label: "문의", icon: MessageSquare },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (!isLoading && user && !isAdmin) {
      toast.error("관리자 권한이 필요합니다.");
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S&J</span>
              </div>
              <span className="font-bold text-foreground">관리자</span>
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/admin" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>사이트 보기</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-background border-b border-border p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold">관리자</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
