import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Github, RefreshCw, ExternalLink, GitCommit, CheckCircle2, XCircle, Loader2, Clock, Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { toast } from "sonner";

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

type SyncStatus = "idle" | "running" | "success" | "error";
type IntervalKey = "off" | "5m" | "15m" | "1h" | "6h" | "1d";

const INTERVAL_OPTIONS: { key: IntervalKey; label: string; ms: number }[] = [
  { key: "off", label: "사용 안 함", ms: 0 },
  { key: "5m", label: "5분마다", ms: 5 * 60 * 1000 },
  { key: "15m", label: "15분마다", ms: 15 * 60 * 1000 },
  { key: "1h", label: "1시간마다", ms: 60 * 60 * 1000 },
  { key: "6h", label: "6시간마다", ms: 6 * 60 * 60 * 1000 },
  { key: "1d", label: "매일", ms: 24 * 60 * 60 * 1000 },
];

interface SyncSettings {
  interval: IntervalKey;
  notifySuccess: boolean;
  notifyError: boolean;
}

const SETTINGS_KEY = "github_sync_settings_v1";
const defaultSettings: SyncSettings = { interval: "1h", notifySuccess: false, notifyError: true };

function loadSettings(): SyncSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
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

function StatusBadge({ status }: { status: SyncStatus }) {
  if (status === "running") {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" /> 진행중
      </Badge>
    );
  }
  if (status === "success") {
    return (
      <Badge className="gap-1 bg-green-500/15 text-green-700 hover:bg-green-500/20 border-green-500/30">
        <CheckCircle2 className="h-3 w-3" /> 성공
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" /> 실패
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <Clock className="h-3 w-3" /> 대기
    </Badge>
  );
}

export default function GithubSyncPanel() {
  const [data, setData] = useState<SyncData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [changeNote, setChangeNote] = useState<string | null>(null);
  const [settings, setSettings] = useState<SyncSettings>(loadSettings);
  const [showSettings, setShowSettings] = useState(false);

  const prevShaRef = useRef<string | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const runSync = async (opts: { auto?: boolean } = {}) => {
    setStatus("running");
    setError(null);
    setChangeNote(null);
    try {
      const { data: res, error: err } = await supabase.functions.invoke("github-sync-status");
      if (err) {
        const details = err instanceof FunctionsHttpError ? await err.context.text() : err.message;
        throw new Error(details);
      }
      const next = res as SyncData;
      const nextSha = next.commits[0]?.sha ?? null;
      const prevSha = prevShaRef.current;
      let note: string | null = null;
      if (prevSha && nextSha && prevSha !== nextSha) {
        note = `새 커밋 감지됨: ${next.commits[0].short_sha}`;
      } else if (prevSha && nextSha && prevSha === nextSha) {
        note = "변경 없음 — 이미 최신 상태입니다.";
      }
      if (note) setChangeNote(note);
      prevShaRef.current = nextSha;
      setData(next);
      setStatus("success");
      setLastCheckedAt(new Date().toISOString());
      if (settingsRef.current.notifySuccess) {
        toast.success(opts.auto ? "자동 동기화 성공" : "동기화 성공", {
          description: note ?? `최신 커밋 ${next.commits[0]?.short_sha ?? ""}`,
        });
      } else if (opts.auto && note?.startsWith("새 커밋")) {
        // 성공 알림을 껐어도 신규 커밋은 알림
        toast.success("새 커밋 감지", { description: note });
      }
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      setStatus("error");
      setLastCheckedAt(new Date().toISOString());
      if (settingsRef.current.notifyError) {
        toast.error(opts.auto ? "자동 동기화 실패" : "동기화 실패", { description: msg });
      }
    }
  };

  useEffect(() => {
    runSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 자동 동기화 타이머
  useEffect(() => {
    const opt = INTERVAL_OPTIONS.find((o) => o.key === settings.interval);
    if (!opt || opt.ms === 0) return;
    const id = window.setInterval(() => runSync({ auto: true }), opt.ms);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.interval]);

  const updateSettings = (patch: Partial<SyncSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const running = status === "running";
  const currentInterval = INTERVAL_OPTIONS.find((o) => o.key === settings.interval)?.label ?? "사용 안 함";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" /> GitHub 동기화 상태
          <StatusBadge status={status} />
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowSettings((s) => !s)}>
            <Settings2 className="h-4 w-4 mr-1" />
            설정
          </Button>
          <Button size="sm" onClick={() => runSync()} disabled={running}>
            <RefreshCw className={`h-4 w-4 mr-1 ${running ? "animate-spin" : ""}`} />
            {running ? "동기화 중..." : "지금 동기화"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSettings && (
          <div className="rounded-md border bg-muted/30 p-4 space-y-4">
            <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:items-center">
              <Label htmlFor="sync-interval" className="text-sm">자동 동기화 주기</Label>
              <Select
                value={settings.interval}
                onValueChange={(v) => updateSettings({ interval: v as IntervalKey })}
              >
                <SelectTrigger id="sync-interval" className="sm:max-w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERVAL_OPTIONS.map((o) => (
                    <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notify-success" className="text-sm">성공 알림</Label>
                <p className="text-xs text-muted-foreground">동기화 성공 시 토스트 알림을 표시합니다.</p>
              </div>
              <Switch
                id="notify-success"
                checked={settings.notifySuccess}
                onCheckedChange={(v) => updateSettings({ notifySuccess: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notify-error" className="text-sm">실패 알림</Label>
                <p className="text-xs text-muted-foreground">동기화 실패 시 토스트 알림을 표시합니다.</p>
              </div>
              <Switch
                id="notify-error"
                checked={settings.notifyError}
                onCheckedChange={(v) => updateSettings({ notifyError: v })}
              />
            </div>
            <p className="text-xs text-muted-foreground border-t pt-3">
              ※ 설정은 이 브라우저에만 저장되며, 관리자 페이지가 열려 있는 동안 자동 동기화가 실행됩니다.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            마지막 확인:{" "}
            <strong className="text-foreground">
              {lastCheckedAt ? new Date(lastCheckedAt).toLocaleString("ko-KR") : "-"}
            </strong>
          </span>
          <span>
            자동 주기: <strong className="text-foreground">{currentInterval}</strong>
          </span>
          {changeNote && <span className="text-foreground">{changeNote}</span>}
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
            {error}
          </div>
        )}

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

        <p className="text-xs text-muted-foreground border-t pt-3">
          ※ Lovable ↔ GitHub 코드 동기화는 자동으로 실행됩니다. 이 패널은 GitHub 저장소의 최신 상태를 조회하여
          동기화 결과(신규 커밋 여부)를 확인·알림합니다.
        </p>
      </CardContent>
    </Card>
  );
}
