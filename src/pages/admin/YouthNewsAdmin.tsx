import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

export default function YouthNewsAdmin() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("https://today-news-brown.vercel.app/");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["youth-news-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youth_news")
        .select("*")
        .order("display_order", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setLinkUrl("https://today-news-brown.vercel.app/");
    setImageFile(null);
    setImagePreview("");
    setDisplayOrder(0);
    setIsActive(true);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setLinkUrl(item.link_url);
    setImagePreview(item.image_url);
    setDisplayOrder(item.display_order);
    setIsActive(item.is_active);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!editingId && !imageFile) {
      toast.error("이미지를 선택해주세요.");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        const processed = await compressImage(imageFile);
        const ext = processed.name.split(".").pop();
        const path = `youth-news/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("media").upload(path, processed);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
        imageUrl = publicUrl;
      }

      if (editingId) {
        const { error } = await supabase
          .from("youth_news")
          .update({ title, image_url: imageUrl, link_url: linkUrl, display_order: displayOrder, is_active: isActive, updated_at: new Date().toISOString() })
          .eq("id", editingId);
        if (error) throw error;
        toast.success("수정되었습니다.");
      } else {
        const { error } = await supabase
          .from("youth_news")
          .insert({ title, image_url: imageUrl, link_url: linkUrl, display_order: displayOrder, is_active: isActive });
        if (error) throw error;
        toast.success("등록되었습니다.");
      }

      queryClient.invalidateQueries({ queryKey: ["youth-news-admin"] });
      setDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast.error(e.message || "저장 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const { error } = await supabase.from("youth_news").delete().eq("id", id);
    if (error) {
      toast.error("삭제 실패");
    } else {
      toast.success("삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["youth-news-admin"] });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">청소년 늬우스 관리</h1>
            <p className="text-muted-foreground text-sm">매월 청소년 뉴스 이미지를 등록하면 방문자가 클릭 시 뉴스 페이지로 이동합니다.</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> 등록
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">등록된 항목이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="aspect-square overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={item.is_active ? "text-green-600" : "text-red-500"}>
                      {item.is_active ? "활성" : "비활성"}
                    </span>
                    <span>순서: {item.display_order}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                      <Pencil className="h-3 w-3 mr-1" /> 수정
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-3 w-3 mr-1" /> 삭제
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "청소년 늬우스 수정" : "청소년 늬우스 등록"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>제목 *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2026년 1월 청소년 늬우스" />
            </div>
            <div className="space-y-2">
              <Label>썸네일 이미지 *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImageFile(f);
                    setImagePreview(URL.createObjectURL(f));
                  }
                }}
              />
              {imagePreview && (
                <img src={imagePreview} alt="미리보기" className="w-40 h-40 object-cover rounded-lg border" />
              )}
            </div>
            <div className="space-y-2">
              <Label>링크 URL</Label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://today-news-brown.vercel.app/" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>표시 순서</Label>
                <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>활성 상태</Label>
                <div className="pt-2">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={uploading} className="w-full">
              {uploading ? "업로드 중..." : editingId ? "수정" : "등록"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
