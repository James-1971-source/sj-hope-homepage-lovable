import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, HardDrive, Image, FileText, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StorageFile {
  name: string;
  size: number;
  created_at: string;
  content_type: string;
}

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  totalSizeMB: string;
  imageCount: number;
  imageSize: number;
  docCount: number;
  docSize: number;
  storageLimitMB: number;
  files: StorageFile[];
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + units[i];
}

export default function StorageAdmin() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("storage-stats");
      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error(err);
      toast.error("스토리지 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async (filePath: string) => {
    if (!confirm(`"${filePath}" 파일을 삭제하시겠습니까?`)) return;

    const { error } = await supabase.storage.from("media").remove([filePath]);
    if (error) {
      toast.error("파일 삭제 중 오류가 발생했습니다.");
    } else {
      toast.success("파일이 삭제되었습니다.");
      fetchStats();
    }
  };

  const usagePercent = stats
    ? (parseFloat(stats.totalSizeMB) / stats.storageLimitMB) * 100
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              스토리지 관리
            </h1>
            <p className="text-muted-foreground mt-1">
              파일 저장소 사용량을 확인하고 관리합니다.
            </p>
          </div>
          <Button variant="outline" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
        </div>

        {loading && !stats ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <>
            {/* Usage Overview */}
            <div className="bg-background rounded-lg border p-6 space-y-4">
              <div className="flex items-center gap-3">
                <HardDrive className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-semibold">저장소 사용량</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {stats.totalSizeMB} MB / {stats.storageLimitMB} MB (무료 한도)
                  </span>
                  <span className="font-medium">{usagePercent.toFixed(1)}%</span>
                </div>
                <Progress
                  value={usagePercent}
                  className="h-3"
                />
                {usagePercent > 80 && (
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ 저장소 용량이 80%를 초과했습니다. 불필요한 파일을 삭제해주세요.
                  </p>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg border p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">전체 파일</p>
                  <p className="text-xl font-bold">{stats.totalFiles}개</p>
                  <p className="text-xs text-muted-foreground">{formatSize(stats.totalSize)}</p>
                </div>
              </div>
              <div className="bg-background rounded-lg border p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Image className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">이미지</p>
                  <p className="text-xl font-bold">{stats.imageCount}개</p>
                  <p className="text-xs text-muted-foreground">{formatSize(stats.imageSize)}</p>
                </div>
              </div>
              <div className="bg-background rounded-lg border p-4 flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">문서</p>
                  <p className="text-xl font-bold">{stats.docCount}개</p>
                  <p className="text-xs text-muted-foreground">{formatSize(stats.docSize)}</p>
                </div>
              </div>
            </div>

            {/* File List */}
            <div className="bg-background rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">파일 목록 (최근 순)</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>파일명</TableHead>
                    <TableHead className="w-24">유형</TableHead>
                    <TableHead className="w-24">크기</TableHead>
                    <TableHead className="w-32">등록일</TableHead>
                    <TableHead className="w-16">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.files.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        업로드된 파일이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    stats.files.map((file) => {
                      const isImage = file.content_type.startsWith("image/");
                      const publicUrl = isImage
                        ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media/${file.name}`
                        : null;
                      return (
                      <TableRow key={file.name}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {publicUrl ? (
                              <img
                                src={publicUrl}
                                alt={file.name}
                                className="h-10 w-10 rounded object-cover border flex-shrink-0"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-mono text-sm truncate max-w-[200px]">
                              {file.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {file.content_type.startsWith("image/") ? "이미지" : "문서"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatSize(file.size)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {file.created_at
                            ? new Date(file.created_at).toLocaleDateString("ko-KR")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(file.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
