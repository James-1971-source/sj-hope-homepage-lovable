import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import FileUpload from "@/components/admin/FileUpload";

interface Post {
  id: string;
  title: string;
  category: string;
  content: string | null;
  cover_image: string | null;
  pinned: boolean;
  created_at: string;
}

const categories = [
  { value: "공지사항", label: "공지사항" },
  { value: "활동소식", label: "활동소식" },
  { value: "행사안내", label: "행사안내" },
];

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("공지사항");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pinned, setPinned] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCategory("공지사항");
    setContent("");
    setCoverImage("");
    setPinned(false);
    setEditingPost(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setContent(post.content || "");
    setCoverImage(post.cover_image || "");
    setPinned(post.pinned);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    setSaving(true);

    const postData = {
      title: title.trim(),
      category,
      content: content.trim() || null,
      cover_image: coverImage.trim() || null,
      pinned,
    };

    if (editingPost) {
      const { error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", editingPost.id);

      if (error) {
        toast.error("수정 중 오류가 발생했습니다.");
        console.error(error);
      } else {
        toast.success("게시글이 수정되었습니다.");
        setDialogOpen(false);
        fetchPosts();
      }
    } else {
      const { error } = await supabase.from("posts").insert(postData);

      if (error) {
        toast.error("등록 중 오류가 발생했습니다.");
        console.error(error);
      } else {
        toast.success("게시글이 등록되었습니다.");
        setDialogOpen(false);
        fetchPosts();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
      console.error(error);
    } else {
      toast.success("게시글이 삭제되었습니다.");
      fetchPosts();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">공지/소식 관리</h1>
            <p className="text-muted-foreground mt-1">공지사항, 활동소식, 행사안내를 관리합니다.</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            새 게시글
          </Button>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">분류</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-24">고정</TableHead>
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
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    등록된 게시글이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.pinned && <Badge className="bg-primary">고정</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(post.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(post)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post.id)}
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
              <DialogTitle>{editingPost ? "게시글 수정" : "새 게시글"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>분류</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox
                    id="pinned"
                    checked={pinned}
                    onCheckedChange={(checked) => setPinned(checked === true)}
                  />
                  <Label htmlFor="pinned">상단 고정</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>제목 *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="게시글 제목"
                />
              </div>
              <div className="space-y-2">
                <Label>내용</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                />
              </div>
              <div className="space-y-2">
                <Label>커버 이미지</Label>
                <FileUpload
                  onUpload={(url) => setCoverImage(url)}
                  type="image"
                />
                <p className="text-xs text-muted-foreground">또는 직접 URL 입력:</p>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {coverImage && (
                  <img src={coverImage} alt="커버 미리보기" className="max-h-48 rounded-lg mt-2" />
                )}
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
