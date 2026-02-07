import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import FileUpload, { MultiFileUpload } from "@/components/admin/FileUpload";

interface PageContent {
  id: string;
  page_key: string;
  section_key: string;
  title: string | null;
  content: string | null;
  images: string[];
  display_order: number;
}

interface HistoryItem {
  id: string;
  year: string;
  event: string;
  month: number | null;
  day: number | null;
  images: string[];
  display_order: number;
}

interface OrganizationItem {
  id: string;
  name: string;
  position: string | null;
  level: number;
  display_order: number;
}

interface Facility {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  display_order: number;
}

export default function PageContentsAdmin() {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [organizationItems, setOrganizationItems] = useState<OrganizationItem[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("greeting");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [contentsRes, historyRes, orgRes, facilityRes] = await Promise.all([
        supabase.from("page_contents").select("*").order("display_order"),
        supabase.from("history_items").select("*").order("display_order"),
        supabase.from("organization_items").select("*").order("display_order"),
        supabase.from("facilities").select("*").order("display_order"),
      ]);

      if (contentsRes.data) setPageContents(contentsRes.data);
      if (historyRes.data) setHistoryItems(historyRes.data);
      if (orgRes.data) setOrganizationItems(orgRes.data);
      if (facilityRes.data) setFacilities(facilityRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (content: PageContent) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("page_contents")
        .upsert({
          id: content.id,
          page_key: content.page_key,
          section_key: content.section_key,
          title: content.title,
          content: content.content,
          images: content.images,
          display_order: content.display_order,
        });

      if (error) throw error;
      toast.success("저장되었습니다.");
      fetchAllData();
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 연혁 관련 함수
  const [historyYear, setHistoryYear] = useState<string>(new Date().getFullYear().toString());

  const historyYears = Array.from(new Set(historyItems.map(i => i.year))).sort((a, b) => b.localeCompare(a));
  const [activeHistoryYear, setActiveHistoryYear] = useState<string>("");

  useEffect(() => {
    if (historyYears.length > 0 && !activeHistoryYear) {
      setActiveHistoryYear(historyYears[0]);
    }
  }, [historyYears]);

  const handleAddHistoryYear = async () => {
    const year = prompt("추가할 연도를 입력하세요 (예: 2024)");
    if (!year || isNaN(Number(year))) return;
    // Add a placeholder entry for the year
    try {
      const { error } = await supabase
        .from("history_items")
        .insert({ year, event: "새로운 연혁", month: 1, day: 1, display_order: 0 });
      if (error) throw error;
      toast.success(`${year}년이 추가되었습니다.`);
      setActiveHistoryYear(year);
      fetchAllData();
    } catch (error) {
      toast.error("추가에 실패했습니다.");
    }
  };

  const handleAddHistory = async () => {
    const year = activeHistoryYear || new Date().getFullYear().toString();
    try {
      const { error } = await supabase
        .from("history_items")
        .insert({ year, event: "새로운 연혁", month: 1, day: 1, images: [], display_order: historyItems.length + 1 });
      if (error) throw error;
      toast.success("연혁이 추가되었습니다.");
      fetchAllData();
    } catch (error) {
      toast.error("추가에 실패했습니다.");
    }
  };

  const handleUpdateHistory = async (item: HistoryItem) => {
    try {
      const { error } = await supabase
        .from("history_items")
        .update({ year: item.year, event: item.event, month: item.month, day: item.day, images: item.images })
        .eq("id", item.id);

      if (error) throw error;
      toast.success("저장되었습니다.");
    } catch (error) {
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase.from("history_items").delete().eq("id", id);
      if (error) throw error;
      toast.success("삭제되었습니다.");
      fetchAllData();
    } catch (error) {
      toast.error("삭제에 실패했습니다.");
    }
  };

  // 조직도 관련 함수
  const handleAddOrganization = async () => {
    try {
      const { error } = await supabase
        .from("organization_items")
        .insert({ name: "새로운 부서", level: 2, display_order: organizationItems.length + 1 });

      if (error) throw error;
      toast.success("조직이 추가되었습니다.");
      fetchAllData();
    } catch (error) {
      toast.error("추가에 실패했습니다.");
    }
  };

  const handleUpdateOrganization = async (item: OrganizationItem) => {
    try {
      const { error } = await supabase
        .from("organization_items")
        .update({ name: item.name, position: item.position, level: item.level })
        .eq("id", item.id);

      if (error) throw error;
      toast.success("저장되었습니다.");
    } catch (error) {
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase.from("organization_items").delete().eq("id", id);
      if (error) throw error;
      toast.success("삭제되었습니다.");
      fetchAllData();
    } catch (error) {
      toast.error("삭제에 실패했습니다.");
    }
  };

  // 시설안내 관련 함수
  const handleAddFacility = async () => {
    try {
      const { error } = await supabase
        .from("facilities")
        .insert({ name: "새로운 시설", display_order: facilities.length + 1 });

      if (error) throw error;
      toast.success("시설이 추가되었습니다.");
      fetchAllData();
    } catch (error) {
      toast.error("추가에 실패했습니다.");
    }
  };

  const handleUpdateFacility = async (item: Facility) => {
    try {
      const { error } = await supabase
        .from("facilities")
        .update({ name: item.name, description: item.description, images: item.images })
        .eq("id", item.id);

      if (error) throw error;
      toast.success("저장되었습니다.");
    } catch (error) {
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase.from("facilities").delete().eq("id", id);
      if (error) throw error;
      toast.success("삭제되었습니다.");
      fetchAllData();
    } catch (error) {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const getContent = (sectionKey: string) => {
    return pageContents.find(c => c.section_key === sectionKey);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">페이지 콘텐츠 관리</h1>
          <p className="text-muted-foreground mt-1">기관소개 페이지의 내용을 수정합니다.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="greeting">인사말</TabsTrigger>
            <TabsTrigger value="mission">미션/비전</TabsTrigger>
            <TabsTrigger value="history">연혁</TabsTrigger>
            <TabsTrigger value="organization">조직도</TabsTrigger>
            <TabsTrigger value="facilities">시설안내</TabsTrigger>
          </TabsList>

          {/* 인사말 탭 */}
          <TabsContent value="greeting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>인사말</CardTitle>
                <CardDescription>기관장 인사말을 작성합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const content = getContent("greeting");
                  if (!content) return <p>데이터가 없습니다.</p>;
                  return (
                    <>
                      <div className="space-y-2">
                        <Label>내용</Label>
                        <Textarea
                          value={content.content || ""}
                          onChange={(e) => {
                            const updated = pageContents.map(c =>
                              c.section_key === "greeting" ? { ...c, content: e.target.value } : c
                            );
                            setPageContents(updated);
                          }}
                          rows={15}
                          placeholder="인사말 내용을 입력하세요"
                        />
                        <p className="text-xs text-muted-foreground">줄바꿈은 그대로 반영됩니다.</p>
                      </div>
                      <Button onClick={() => handleSaveContent(content)} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        저장
                      </Button>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 미션/비전 탭 */}
          <TabsContent value="mission" className="space-y-4">
            {["mission", "vision", "values"].map((key) => {
              const content = getContent(key);
              if (!content) return null;
              const labels: Record<string, string> = {
                mission: "사명",
                vision: "비전",
                values: "핵심가치",
              };
              return (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle>{labels[key]}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>제목</Label>
                      <Input
                        value={content.title || ""}
                        onChange={(e) => {
                          const updated = pageContents.map(c =>
                            c.section_key === key ? { ...c, title: e.target.value } : c
                          );
                          setPageContents(updated);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>내용</Label>
                      <Textarea
                        value={content.content || ""}
                        onChange={(e) => {
                          const updated = pageContents.map(c =>
                            c.section_key === key ? { ...c, content: e.target.value } : c
                          );
                          setPageContents(updated);
                        }}
                        rows={4}
                      />
                    </div>
                    <Button onClick={() => handleSaveContent(content)} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* 연혁 탭 */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex flex-wrap gap-2">
                {historyYears.map((year) => (
                  <Button
                    key={year}
                    variant={activeHistoryYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveHistoryYear(year)}
                  >
                    {year}년
                  </Button>
                ))}
                <Button variant="secondary" size="sm" onClick={handleAddHistoryYear}>
                  <Plus className="h-4 w-4 mr-1" />
                  연도 추가
                </Button>
              </div>
              <Button onClick={handleAddHistory} disabled={!activeHistoryYear}>
                <Plus className="h-4 w-4 mr-2" />
                연혁 추가
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {historyItems
                    .filter(i => i.year === activeHistoryYear)
                    .sort((a, b) => (a.month || 0) - (b.month || 0) || (a.day || 0) - (b.day || 0))
                    .map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={item.month || ""}
                            onChange={(e) => {
                              const updated = historyItems.map(h =>
                                h.id === item.id ? { ...h, month: e.target.value ? Number(e.target.value) : null } : h
                              );
                              setHistoryItems(updated);
                            }}
                            className="w-20 px-2 py-2 border rounded-md bg-background text-sm"
                          >
                            <option value="">월</option>
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}월</option>
                            ))}
                          </select>
                          <select
                            value={item.day || ""}
                            onChange={(e) => {
                              const updated = historyItems.map(h =>
                                h.id === item.id ? { ...h, day: e.target.value ? Number(e.target.value) : null } : h
                              );
                              setHistoryItems(updated);
                            }}
                            className="w-20 px-2 py-2 border rounded-md bg-background text-sm"
                          >
                            <option value="">일</option>
                            {Array.from({ length: 31 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}일</option>
                            ))}
                          </select>
                        </div>
                        <Input
                          value={item.event}
                          onChange={(e) => {
                            const updated = historyItems.map(h =>
                              h.id === item.id ? { ...h, event: e.target.value } : h
                            );
                            setHistoryItems(updated);
                          }}
                          className="flex-1"
                          placeholder="연혁 내용"
                        />
                        <Button variant="outline" size="sm" onClick={() => handleUpdateHistory(item)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteHistory(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      {/* Images */}
                      <div>
                        <Label className="text-xs mb-1 block">이미지</Label>
                        {item.images && item.images.length > 0 && (
                          <div className="flex gap-2 mb-2 flex-wrap">
                            {item.images.map((img, idx) => (
                              <div key={idx} className="relative w-20 h-14 rounded overflow-hidden border">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                  onClick={() => {
                                    const updated = historyItems.map(h =>
                                      h.id === item.id ? { ...h, images: h.images.filter((_, i) => i !== idx) } : h
                                    );
                                    setHistoryItems(updated);
                                  }}
                                  className="absolute top-0 right-0 p-0.5 bg-destructive text-destructive-foreground rounded-bl"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <MultiFileUpload
                          urls={item.images || []}
                          onUrlsChange={(newUrls) => {
                            const updated = historyItems.map(h =>
                              h.id === item.id ? { ...h, images: newUrls } : h
                            );
                            setHistoryItems(updated);
                          }}
                          accept="image/*"
                          type="image"
                        />
                      </div>
                    </div>
                  ))}
                  {historyItems.filter(i => i.year === activeHistoryYear).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      {activeHistoryYear ? `${activeHistoryYear}년 연혁이 없습니다. 추가해주세요.` : "연도를 선택하거나 추가해주세요."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 조직도 탭 */}
          <TabsContent value="organization" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddOrganization}>
                <Plus className="h-4 w-4 mr-2" />
                조직 추가
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {organizationItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <select
                        value={item.level}
                        onChange={(e) => {
                          const updated = organizationItems.map(o =>
                            o.id === item.id ? { ...o, level: parseInt(e.target.value) } : o
                          );
                          setOrganizationItems(updated);
                        }}
                        className="w-24 px-3 py-2 border rounded-md bg-background"
                      >
                        <option value={0}>최상위</option>
                        <option value={1}>중간</option>
                        <option value={2}>하위</option>
                      </select>
                      <Input
                        value={item.name}
                        onChange={(e) => {
                          const updated = organizationItems.map(o =>
                            o.id === item.id ? { ...o, name: e.target.value } : o
                          );
                          setOrganizationItems(updated);
                        }}
                        className="flex-1"
                        placeholder="조직/직책명"
                      />
                      <Button variant="outline" size="sm" onClick={() => handleUpdateOrganization(item)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteOrganization(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {organizationItems.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">조직 정보가 없습니다. 추가해주세요.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 시설안내 탭 */}
          <TabsContent value="facilities" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddFacility}>
                <Plus className="h-4 w-4 mr-2" />
                시설 추가
              </Button>
            </div>
            <div className="grid gap-4">
              {facilities.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Input
                        value={item.name}
                        onChange={(e) => {
                          const updated = facilities.map(f =>
                            f.id === item.id ? { ...f, name: e.target.value } : f
                          );
                          setFacilities(updated);
                        }}
                        className="max-w-md font-semibold"
                        placeholder="시설 이름"
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateFacility(item)}>
                          <Save className="h-4 w-4 mr-1" />
                          저장
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFacility(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={item.description || ""}
                      onChange={(e) => {
                        const updated = facilities.map(f =>
                          f.id === item.id ? { ...f, description: e.target.value } : f
                        );
                        setFacilities(updated);
                      }}
                      rows={3}
                      placeholder="시설 설명"
                    />
                    <div>
                      <Label className="mb-2 block">시설 사진</Label>
                      {item.images && item.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {item.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => {
                                  const updated = facilities.map(f =>
                                    f.id === item.id
                                      ? { ...f, images: f.images.filter((_, i) => i !== idx) }
                                      : f
                                  );
                                  setFacilities(updated);
                                }}
                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <MultiFileUpload
                        urls={item.images || []}
                        onUrlsChange={(newUrls) => {
                          const updated = facilities.map(f =>
                            f.id === item.id ? { ...f, images: newUrls } : f
                          );
                          setFacilities(updated);
                        }}
                        accept="image/*"
                        type="image"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {facilities.length === 0 && (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">시설 정보가 없습니다. 추가해주세요.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
