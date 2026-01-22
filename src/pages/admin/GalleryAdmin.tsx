import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Images } from "lucide-react";

interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  created_at: string;
}

export default function GalleryAdmin() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagesInput, setImagesInput] = useState("");

  const fetchAlbums = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      setAlbums(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImagesInput("");
    setEditingAlbum(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setTitle(album.title);
    setDescription(album.description || "");
    setImagesInput(album.images?.join("\n") || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    setSaving(true);

    const images = imagesInput
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url);

    const albumData = {
      title: title.trim(),
      description: description.trim() || null,
      images,
    };

    if (editingAlbum) {
      const { error } = await supabase
        .from("gallery_albums")
        .update(albumData)
        .eq("id", editingAlbum.id);

      if (error) {
        toast.error("수정 중 오류가 발생했습니다.");
        console.error(error);
      } else {
        toast.success("앨범이 수정되었습니다.");
        setDialogOpen(false);
        fetchAlbums();
      }
    } else {
      const { error } = await supabase.from("gallery_albums").insert(albumData);

      if (error) {
        toast.error("등록 중 오류가 발생했습니다.");
        console.error(error);
      } else {
        toast.success("앨범이 등록되었습니다.");
        setDialogOpen(false);
        fetchAlbums();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("gallery_albums").delete().eq("id", id);

    if (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      toast.success("앨범이 삭제되었습니다.");
      fetchAlbums();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">갤러리 관리</h1>
            <p className="text-muted-foreground mt-1">활동 사진 앨범을 관리합니다.</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            새 앨범
          </Button>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>앨범명</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="w-24">사진 수</TableHead>
                <TableHead className="w-32">등록일</TableHead>
                <TableHead className="w-24">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : albums.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    등록된 앨범이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                albums.map((album) => (
                  <TableRow key={album.id}>
                    <TableCell className="font-medium">{album.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {album.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Images className="h-4 w-4" />
                        {album.images?.length || 0}장
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(album.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(album)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(album.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAlbum ? "앨범 수정" : "새 앨범"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>앨범명 *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="앨범 이름"
                />
              </div>
              <div className="space-y-2">
                <Label>설명</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="앨범에 대한 설명"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>이미지 URL (한 줄에 하나씩)</Label>
                <Textarea
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  이미지 URL을 한 줄에 하나씩 입력하세요.
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    "저장"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
