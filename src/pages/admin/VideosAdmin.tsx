import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Video, ExternalLink, GripVertical } from "lucide-react";

interface VideoForm {
  title: string;
  youtube_url: string;
  description: string;
  is_featured: boolean;
  display_order: number;
}

interface Video extends VideoForm {
  id: string;
  created_at: string;
  updated_at: string;
}

const initialForm: VideoForm = {
  title: "",
  youtube_url: "",
  description: "",
  is_featured: true,
  display_order: 0,
};

// YouTube URL에서 비디오 ID 추출
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideosAdmin() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [form, setForm] = useState<VideoForm>(initialForm);

  const { data: videos, isLoading } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Video[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: VideoForm) => {
      const { error } = await supabase.from("videos").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      queryClient.invalidateQueries({ queryKey: ["featured-videos"] });
      toast.success("영상이 추가되었습니다.");
      handleClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("영상 추가에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VideoForm }) => {
      const { error } = await supabase.from("videos").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      queryClient.invalidateQueries({ queryKey: ["featured-videos"] });
      toast.success("영상이 수정되었습니다.");
      handleClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("영상 수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      queryClient.invalidateQueries({ queryKey: ["featured-videos"] });
      toast.success("영상이 삭제되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("영상 삭제에 실패했습니다.");
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setEditingVideo(null);
    setForm(initialForm);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setForm({
      title: video.title,
      youtube_url: video.youtube_url,
      description: video.description || "",
      is_featured: video.is_featured,
      display_order: video.display_order,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.youtube_url) {
      toast.error("제목과 YouTube URL을 입력해주세요.");
      return;
    }

    const videoId = extractYouTubeId(form.youtube_url);
    if (!videoId) {
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }

    if (editingVideo) {
      updateMutation.mutate({ id: editingVideo.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 이 영상을 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">영상 관리</h1>
            <p className="text-muted-foreground">
              홈페이지에 표시할 YouTube 영상을 관리합니다.
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                영상 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingVideo ? "영상 수정" : "새 영상 추가"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="영상 제목을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube_url">YouTube URL *</Label>
                  <Input
                    id="youtube_url"
                    value={form.youtube_url}
                    onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    YouTube 영상 주소를 입력하세요 (일반 링크, 공유 링크, 쇼츠 모두 지원)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="영상에 대한 간단한 설명"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">표시 순서</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    숫자가 작을수록 먼저 표시됩니다
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={form.is_featured}
                    onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">홈페이지에 표시</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingVideo ? "수정" : "추가"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            로딩 중...
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">순서</TableHead>
                  <TableHead className="w-32">미리보기</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-24">홈 표시</TableHead>
                  <TableHead className="w-32">등록일</TableHead>
                  <TableHead className="w-24">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => {
                  const videoId = extractYouTubeId(video.youtube_url);
                  return (
                    <TableRow key={video.id}>
                      <TableCell className="text-center">
                        {video.display_order}
                      </TableCell>
                      <TableCell>
                        {videoId && (
                          <a
                            href={video.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group"
                          >
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-24 h-14 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                              <ExternalLink className="h-4 w-4 text-white" />
                            </div>
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{video.title}</p>
                          {video.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            video.is_featured
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {video.is_featured ? "표시" : "숨김"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(video.created_at).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(video)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(video.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              등록된 영상이 없습니다.
            </p>
            <Button onClick={() => setIsOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              첫 영상 추가하기
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
