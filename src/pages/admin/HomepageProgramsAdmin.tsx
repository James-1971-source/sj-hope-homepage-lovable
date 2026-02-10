import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2, GripVertical } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";

interface HomepageProgram {
  id?: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string;
  icon: string;
  display_order: number;
}

const ICON_OPTIONS = [
  { value: "BookOpen", label: "📖 학습/교육" },
  { value: "Heart", label: "❤️ 상담/복지" },
  { value: "Palette", label: "🎨 문화/체험" },
  { value: "Globe", label: "🌍 글로벌" },
  { value: "GraduationCap", label: "🎓 졸업/진로" },
  { value: "Users", label: "👥 공동체" },
  { value: "Building", label: "🏢 시설" },
];

export default function HomepageProgramsAdmin() {
  const [programs, setPrograms] = useState<HomepageProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("homepage_programs" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      setPrograms((data as any[]) || []);
    } catch (error) {
      console.error(error);
      toast.error("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const addProgram = () => {
    setPrograms([
      ...programs,
      {
        title: "",
        description: "",
        image_url: null,
        link: "/programs",
        icon: "BookOpen",
        display_order: programs.length,
      },
    ]);
  };

  const updateProgram = (index: number, field: keyof HomepageProgram, value: any) => {
    const updated = [...programs];
    (updated[index] as any)[field] = value;
    setPrograms(updated);
  };

  const removeProgram = async (index: number) => {
    const program = programs[index];
    if (program.id) {
      const { error } = await supabase.from("homepage_programs" as any).delete().eq("id", program.id);
      if (error) {
        toast.error("삭제에 실패했습니다.");
        return;
      }
    }
    setPrograms(programs.filter((_, i) => i !== index));
    toast.success("삭제되었습니다.");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < programs.length; i++) {
        const p = { ...programs[i], display_order: i };
        if (p.id) {
          const { error } = await supabase
            .from("homepage_programs" as any)
            .update({ title: p.title, description: p.description, image_url: p.image_url, link: p.link, icon: p.icon, display_order: p.display_order } as any)
            .eq("id", p.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("homepage_programs" as any)
            .insert({ title: p.title, description: p.description, image_url: p.image_url, link: p.link, icon: p.icon, display_order: p.display_order } as any);
          if (error) throw error;
        }
      }
      toast.success("저장되었습니다.");
      fetchPrograms();
    } catch (error) {
      console.error(error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">메인 사업소개 관리</h1>
            <p className="text-muted-foreground mt-1">메인 페이지에 표시되는 주요 사업 카드를 관리합니다.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={addProgram}>
              <Plus className="h-4 w-4 mr-2" />
              추가
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </div>

        {programs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              등록된 사업이 없습니다. '추가' 버튼을 눌러 사업을 추가하세요.
            </CardContent>
          </Card>
        ) : (
          programs.map((program, index) => (
            <Card key={program.id || `new-${index}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    사업 {index + 1}: {program.title || "(제목 없음)"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => removeProgram(index)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>제목</Label>
                    <Input value={program.title} onChange={(e) => updateProgram(index, "title", e.target.value)} placeholder="사업 제목" />
                  </div>
                  <div className="space-y-2">
                    <Label>아이콘</Label>
                    <Select value={program.icon} onValueChange={(v) => updateProgram(index, "icon", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea value={program.description} onChange={(e) => updateProgram(index, "description", e.target.value)} placeholder="사업 설명" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>링크 URL</Label>
                  <Input value={program.link} onChange={(e) => updateProgram(index, "link", e.target.value)} placeholder="/programs" />
                </div>
                <div className="space-y-2">
                  <Label>이미지</Label>
                  {program.image_url ? (
                    <div className="flex items-center gap-4">
                      <div className="w-40 h-24 rounded-lg border border-border overflow-hidden bg-muted">
                        <img src={program.image_url} alt={program.title} className="w-full h-full object-cover" />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => updateProgram(index, "image_url", null)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </Button>
                    </div>
                  ) : (
                    <FileUpload onUpload={(url) => updateProgram(index, "image_url", url)} accept="image/*" type="image" />
                  )}
                  <p className="text-xs text-muted-foreground">이미지를 등록하지 않으면 기본 이미지가 사용됩니다.</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
