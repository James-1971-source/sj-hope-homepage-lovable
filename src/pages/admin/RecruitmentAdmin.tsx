import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRecruitmentPosts, RecruitmentPost } from "@/hooks/useRecruitmentPosts";
import FileUpload from "@/components/admin/FileUpload";
import { MultiFileUpload } from "@/components/admin/FileUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

const emptyForm = {
  title: "",
  content: "",
  poster_image: "",
  start_date: "",
  end_date: "",
  is_active: true,
  is_featured: false,
  display_order: 0,
  attachments: [] as string[],
};

export default function RecruitmentAdmin() {
  const { posts, loading, refetch } = useRecruitmentPosts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (post: RecruitmentPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      content: post.content || "",
      poster_image: post.poster_image || "",
      start_date: post.start_date || "",
      end_date: post.end_date || "",
      is_active: post.is_active,
      is_featured: post.is_featured,
      display_order: post.display_order,
      attachments: post.attachments || [],
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      content: form.content || null,
      poster_image: form.poster_image || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      display_order: form.display_order,
      attachments: form.attachments,
    };

    const { error } = editingId
      ? await supabase.from("recruitment_posts" as any).update(payload).eq("id", editingId)
      : await supabase.from("recruitment_posts" as any).insert(payload);

    setSaving(false);
    if (error) {
      toast.error("저장 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      toast.success(editingId ? "수정되었습니다." : "등록되었습니다.");
      setDialogOpen(false);
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("recruitment_posts" as any).delete().eq("id", id);
    if (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
    } else {
      toast.success("삭제되었습니다.");
      refetch();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">모집공고 관리</h1>
            <p className="text-muted-foreground mt-1">재능기부활동가 모집 공고를 관리합니다.</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            공고 등록
          </Button>
        </div>

        <div className="bg-background rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead className="w-28">모집기간</TableHead>
                <TableHead className="w-20">활성</TableHead>
                <TableHead className="w-20">메인노출</TableHead>
                <TableHead className="w-20">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    등록된 모집공고가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.start_date && new Date(post.start_date).toLocaleDateString("ko-KR")}
                      {post.start_date && post.end_date && " ~ "}
                      {post.end_date && new Date(post.end_date).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>{post.is_active ? "✅" : "❌"}</TableCell>
                    <TableCell>{post.is_featured ? "✅" : "❌"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
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
              <DialogTitle>{editingId ? "모집공고 수정" : "모집공고 등록"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>제목 *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 2026년 상반기 재능기부활동가 모집"
                />
              </div>

              <div className="space-y-2">
                <Label>포스터 이미지</Label>
                <FileUpload
                  onUpload={(url) => setForm({ ...form, poster_image: url })}
                  type="image"
                />
                {form.poster_image && (
                  <img src={form.poster_image} alt="포스터 미리보기" className="max-h-48 rounded-lg mt-2" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>모집 시작일</Label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>모집 종료일</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>상세 내용</Label>
                <RichTextEditor
                  content={form.content}
                  onChange={(val) => setForm({ ...form, content: val })}
                />
              </div>

              <div className="space-y-2">
                <Label>첨부 문서 (PDF, DOC, XLS 등)</Label>
                <MultiFileUpload
                  urls={form.attachments}
                  onUrlsChange={(urls) => setForm({ ...form, attachments: urls })}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.hwp,.ppt,.pptx"
                  maxSize={20}
                  type="file"
                />
              </div>

              <div className="space-y-2">
                <Label>표시 순서</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                  />
                  <Label>활성화</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_featured}
                    onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
                  />
                  <Label>메인 페이지 노출</Label>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? "수정하기" : "등록하기"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
