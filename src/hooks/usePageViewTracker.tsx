import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getSessionId() {
  let sid = sessionStorage.getItem("pv_session");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("pv_session", sid);
  }
  return sid;
}

const pageTitleMap: Record<string, string> = {
  "/": "홈",
  "/about": "기관소개",
  "/programs": "사업소개",
  "/news": "공지/소식",
  "/gallery": "갤러리",
  "/videos": "영상",
  "/resources": "자료실",
  "/donate": "후원안내",
  "/volunteer": "봉사신청",
  "/contact": "문의하기",
  "/recruitment": "모집공고",
  "/youth-news": "청소년 늬우스",
  "/privacy": "개인정보처리방침",
  "/terms": "이용약관",
};

function getPageTitle(path: string): string {
  if (pageTitleMap[path]) return pageTitleMap[path];
  if (path.startsWith("/news/")) return "공지/소식 상세";
  if (path.startsWith("/programs/")) return "사업소개 상세";
  if (path.startsWith("/gallery/")) return "갤러리 상세";
  if (path.startsWith("/about/")) return "기관소개";
  return path;
}

export function usePageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages or auth
    if (location.pathname.startsWith("/admin") || location.pathname === "/auth") {
      return;
    }

    const sessionId = getSessionId();

    supabase
      .from("page_views")
      .insert({
        page_path: location.pathname,
        page_title: getPageTitle(location.pathname),
        session_id: sessionId,
      })
      .then(); // fire and forget
  }, [location.pathname]);
}
