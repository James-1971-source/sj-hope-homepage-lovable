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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { MultiFileUpload } from "@/components/admin/FileUpload";

interface Program {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  target: string | null;
  schedule: string | null;
  images: string[];
  tags: string[];
  created_at: string;
}

export default function ProgramsAdmin() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("");
  const [schedule, setSchedule] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const fetchPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      setPrograms(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setTarget("");
    setSchedule("");
    setTagsInput("");
    setImages([]);
    setEditingProgram(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (program: Program) => {
    setEditingProgram(program);
    setTitle(program.title);
    setSummary(program.summary || "");
    setContent(program.content || "");
    setTarget(program.target || "");
    setSchedule(program.schedule || "");
    setTagsInput(program.tags?.join(", ") || "");
    setImages(program.images || []);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    const programData = {
      title: title.trim(),
      summary: summary.trim() || null,
      content: content.trim() || null,
      target: target.trim() || null,
      schedule: schedule.trim() || null,
      tags,
      images,
    };

    if (editingProgram) {
      const { error } = await supabase
        .from("programs")
        .update(programData)
        .eq("id", editingProgram.id);

      if (error) {
        toast.error("수정 중 오류가 발생했습니다.");
        console.error(error);
      } else {
        toast.success("프로그램이 수정되었습니다.");
        setDialogOpen(false);
        fetchPrograms();
      }
    } else {
      const { error } = await supabase.from("programs").insert(programData);

      if (error) {
        toast.error("등록 중 오류가 발생했습니다.");
        console.error(error);
      } else {
        toast.success("프로그램이 등록되었습니다.");
        setDialogOpen(false);
        fetchPrograms();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("programs").delete().eq("id", id);

    if (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      toast.success("프로그램이 삭제되었습니다.");
      fetchPrograms();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">프로그램 관리</h1>
            <p className="text-muted-foreground mt-1">운영 중인 프로그램을 관리합니다.</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            새 프로그램
          </Button>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>프로그램명</TableHead>
                <TableHead>대상</TableHead>
                <TableHead>일정</TableHead>
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
              ) : programs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    등록된 프로그램이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{program.title}</span>
                        {program.tags?.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {program.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{program.target || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{program.schedule || "-"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(program.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(program)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(program.id)}
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
              <DialogTitle>{editingProgram ? "프로그램 수정" : "새 프로그램"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>프로그램명 *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="프로그램 이름"
                />
              </div>
              <div className="space-y-2">
                <Label>요약</Label>
                <Input
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="간단한 설명"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>대상</Label>
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="예: 중·고등학생"
                  />
                </div>
                <div className="space-y-2">
                  <Label>일정</Label>
                  <Input
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="예: 주 2회"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>상세 내용</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="프로그램 상세 내용"
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label>태그 (쉼표로 구분)</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="학습지원, 멘토링, 진로상담"
                />
              </div>
              <div className="space-y-2">
                <Label>이미지</Label>
                <MultiFileUpload
                  urls={images}
                  onUrlsChange={setImages}
                  accept="image/*"
                  maxSize={10}
                  type="image"
                />
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
