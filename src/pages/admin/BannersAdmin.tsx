import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  slide_interval: number;
  created_at: string;
}

export default function BannersAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [slideInterval, setSlideInterval] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await supabase.from("banners").select("*").order("display_order");
    setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const resetForm = () => {
    setImageUrl(""); setTitle(""); setLinkUrl("");
    setSlideInterval(5); setIsActive(true); setDisplayOrder(0);
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setDisplayOrder(banners.length); setDialogOpen(true); };

  const openEdit = (b: Banner) => {
    setEditing(b); setImageUrl(b.image_url); setTitle(b.title || "");
    setLinkUrl(b.link_url || ""); setSlideInterval(b.slide_interval);
    setIsActive(b.is_active); setDisplayOrder(b.display_order);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!imageUrl.trim()) { toast.error("이미지를 업로드해주세요."); return; }
    setSaving(true);
    const data = {
      image_url: imageUrl, title: title || null, link_url: linkUrl || null,
      slide_interval: slideInterval, is_active: isActive, display_order: displayOrder,
    };

    const { error } = editing
      ? await supabase.from("banners").update(data).eq("id", editing.id)
      : await supabase.from("banners").insert(data);

    if (error) { toast.error("저장 실패"); console.error(error); }
    else { toast.success("저장되었습니다."); setDialogOpen(false); fetchBanners(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("banners").delete().eq("id", id);
    toast.success("삭제되었습니다."); fetchBanners();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">배너 관리</h1>
            <p className="text-muted-foreground mt-1">메인 페이지 상단 배너 슬라이드를 관리합니다.</p>
          </div>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />새 배너</Button>
        </div>

        <div className="bg-background rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">미리보기</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-20">순서</TableHead>
                <TableHead className="w-24">슬라이드(초)</TableHead>
                <TableHead className="w-20">활성</TableHead>
                <TableHead className="w-24">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : banners.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">등록된 배너가 없습니다.</TableCell></TableRow>
              ) : banners.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <img src={b.image_url} alt="" className="w-16 h-10 object-cover rounded" />
                  </TableCell>
                  <TableCell className="font-medium">{b.title || "(제목 없음)"}</TableCell>
                  <TableCell>{b.display_order}</TableCell>
                  <TableCell>{b.slide_interval}초</TableCell>
                  <TableCell>{b.is_active ? "✅" : "❌"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "배너 수정" : "새 배너"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>배너 이미지 *</Label>
                <FileUpload onUpload={setImageUrl} accept="image/*" type="image" />
                {imageUrl && <img src={imageUrl} alt="미리보기" className="w-full h-32 object-cover rounded-lg" />}
              </div>
              <div className="space-y-2">
                <Label>제목 (선택)</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="배너 제목" />
              </div>
              <div className="space-y-2">
                <Label>링크 URL (선택)</Label>
                <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>슬라이드 간격 (초)</Label>
                  <Input type="number" min={1} max={30} value={slideInterval} onChange={(e) => setSlideInterval(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>표시 순서</Label>
                  <Input type="number" min={0} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>활성화</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />저장 중...</> : "저장"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
