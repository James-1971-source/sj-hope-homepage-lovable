import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, RefreshCw, ExternalLink, GitCommit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

interface Commit {
  sha: string;
  short_sha: string;
  message: string;
  author: string;
  date: string | null;
  url: string;
}

interface SyncData {
  repo: {
    full_name: string;
    html_url: string;
    default_branch: string;
    pushed_at: string;
    updated_at: string;
  };
  commits: Commit[];
}

function timeAgo(iso: string | null) {
  if (!iso) return "-";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}

export default function GithubSyncPanel() {
  const [data, setData] = useState<SyncData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res, error: err } = await supabase.functions.invoke("github-sync-status");
      if (err) {
        const details = err instanceof FunctionsHttpError ? await err.context.text() : err.message;
        throw new Error(details);
      }
      setData(res as SyncData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" /> GitHub 동기화 상태
        </CardTitle>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
            {error}
          </div>
        )}
        {loading && !data && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
        {data && (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a
                href={data.repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline flex items-center gap-1"
              >
                {data.repo.full_name}
                <ExternalLink className="h-3 w-3" />
              </a>
              <Badge variant="secondary">{data.repo.default_branch}</Badge>
              <span className="text-muted-foreground">
                마지막 푸시: <strong>{timeAgo(data.repo.pushed_at)}</strong>
                {data.repo.pushed_at && (
                  <span className="ml-1 text-xs">
                    ({new Date(data.repo.pushed_at).toLocaleString("ko-KR")})
                  </span>
                )}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <GitCommit className="h-4 w-4" /> 최근 커밋
              </h3>
              <ul className="divide-y border rounded-md">
                {data.commits.map((c) => (
                  <li key={c.sha} className="p-3 text-sm flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{c.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <code className="bg-muted px-1 rounded">{c.short_sha}</code>
                        {" · "}{c.author}{" · "}{timeAgo(c.date)}
                      </p>
                    </div>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline shrink-0"
                    >
                      보기
                    </a>
                  </li>
                ))}
                {data.commits.length === 0 && (
                  <li className="p-3 text-sm text-muted-foreground">커밋이 없습니다.</li>
                )}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
