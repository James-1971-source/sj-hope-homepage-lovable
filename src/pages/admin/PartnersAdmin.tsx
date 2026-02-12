import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Save, Trash2, GripVertical } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";

interface Partner {
  id?: string;
  name: string;
  logo_url: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
}

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from("partner_organizations")
      .select("*")
      .order("display_order");
    if (error) { toast.error("불러오기 실패"); console.error(error); }
    setPartners(data || []);
    setLoading(false);
  };

  const addPartner = () => {
    setPartners([...partners, { name: "", logo_url: "", link_url: null, display_order: partners.length, is_active: true }]);
  };

  const update = (i: number, field: keyof Partner, value: any) => {
    const arr = [...partners];
    (arr[i] as any)[field] = value;
    setPartners(arr);
  };

  const remove = async (i: number) => {
    const p = partners[i];
    if (p.id) {
      const { error } = await supabase.from("partner_organizations").delete().eq("id", p.id);
      if (error) { toast.error("삭제 실패"); return; }
    }
    setPartners(partners.filter((_, idx) => idx !== i));
    toast.success("삭제되었습니다.");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < partners.length; i++) {
        const p = { ...partners[i], display_order: i };
        const payload = { name: p.name, logo_url: p.logo_url, link_url: p.link_url, display_order: p.display_order, is_active: p.is_active };
        if (p.id) {
          const { error } = await supabase.from("partner_organizations").update(payload).eq("id", p.id);
          if (error) throw error;
        } else {
          if (!p.name || !p.logo_url) { toast.error(`${i + 1}번 항목의 이름과 로고를 입력하세요.`); setSaving(false); return; }
          const { error } = await supabase.from("partner_organizations").insert(payload);
          if (error) throw error;
        }
      }
      toast.success("저장되었습니다.");
      fetchPartners();
    } catch (e) { console.error(e); toast.error("저장 실패"); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">함께하는 기관 관리</h1>
            <p className="text-muted-foreground mt-1">푸터 위에 표시되는 협력 기관 로고를 관리합니다.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={addPartner}><Plus className="h-4 w-4 mr-2" />추가</Button>
            <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "저장 중..." : "저장하기"}</Button>
          </div>
        </div>

        {partners.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">등록된 기관이 없습니다. '추가' 버튼을 눌러 기관을 추가하세요.</CardContent></Card>
        ) : (
          partners.map((p, i) => (
            <Card key={p.id || `new-${i}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    {i + 1}. {p.name || "(이름 없음)"}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${i}`} className="text-sm">활성</Label>
                      <Switch id={`active-${i}`} checked={p.is_active} onCheckedChange={(v) => update(i, "is_active", v)} />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => remove(i)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>기관명</Label>
                    <Input value={p.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="기관 이름" />
                  </div>
                  <div className="space-y-2">
                    <Label>링크 URL (선택)</Label>
                    <Input value={p.link_url || ""} onChange={(e) => update(i, "link_url", e.target.value || null)} placeholder="https://example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>로고 이미지</Label>
                  {p.logo_url ? (
                    <div className="flex items-center gap-4">
                      <div className="h-16 px-4 rounded-lg border border-border bg-background flex items-center">
                        <img src={p.logo_url} alt={p.name} className="h-12 w-auto max-w-[180px] object-contain" />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => update(i, "logo_url", "")}><Trash2 className="h-4 w-4 mr-2" />삭제</Button>
                    </div>
                  ) : (
                    <FileUpload onUpload={(url) => update(i, "logo_url", url)} accept="image/*" type="image" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
