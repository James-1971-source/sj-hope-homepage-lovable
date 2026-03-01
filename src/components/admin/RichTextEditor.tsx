import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Highlighter,
  Palette,
  ImagePlus,
  Youtube as YoutubeIcon,
  Link as LinkIcon,
  Unlink,
  Type,
  Table as TableIcon,
  Plus,
  Minus,
  Trash2,
  Merge,
  SplitSquareHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { compressImage } from "@/lib/imageCompression";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const COLORS = [
  "#000000", "#434343", "#666666", "#999999",
  "#E03131", "#E8590C", "#F08C00", "#2B8A3E",
  "#1971C2", "#6741D9", "#C2255C", "#0C8599",
];

const HIGHLIGHT_COLORS = [
  "#FFF3BF", "#D3F9D8", "#D0EBFF", "#FFD8E4", "#E5DBFF", "#FFE8CC",
];

const FONT_SIZES = [
  { value: "10px", label: "10" },
  { value: "12px", label: "12" },
  { value: "14px", label: "14" },
  { value: "16px", label: "16" },
  { value: "18px", label: "18" },
  { value: "20px", label: "20" },
  { value: "24px", label: "24" },
  { value: "28px", label: "28" },
  { value: "32px", label: "32" },
  { value: "36px", label: "36" },
  { value: "48px", label: "48" },
];

const FONT_FAMILIES = [
  { value: "default", label: "기본" },
  { value: "Noto Sans KR", label: "노토 산스" },
  { value: "Nanum Gothic", label: "나눔고딕" },
  { value: "Nanum Myeongjo", label: "나눔명조" },
  { value: "Gothic A1", label: "고딕 A1" },
  { value: "serif", label: "명조 (Serif)" },
  { value: "monospace", label: "고정폭" },
];

// Custom FontSize extension using TextStyle marks
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

function ToolbarButton({
  onClick,
  isActive = false,
  children,
  title,
  disabled = false,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      FontSize,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline cursor-pointer" },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  const handleImageInsert = useCallback(async () => {
    if (!editor) return;

    if (imageFile) {
      setImageUploading(true);
      try {
        const processed = await compressImage(imageFile);
        const ext = processed.name.split(".").pop();
        const path = `editor/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(path, processed);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
        editor.chain().focus().setImage({ src: publicUrl }).run();
        toast.success("이미지가 삽입되었습니다.");
      } catch (e) {
        toast.error("이미지 업로드 실패");
        console.error(e);
      } finally {
        setImageUploading(false);
      }
    } else if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    }

    setImageDialogOpen(false);
    setImageUrl("");
    setImageFile(null);
  }, [editor, imageFile, imageUrl]);

  const handleYoutubeInsert = useCallback(() => {
    if (!editor || !youtubeUrl.trim()) return;
    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl.trim() }).run();
    setYoutubeDialogOpen(false);
    setYoutubeUrl("");
  }, [editor, youtubeUrl]);

  const handleLinkInsert = useCallback(() => {
    if (!editor || !linkUrl.trim()) return;
    if (linkText.trim()) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl.trim()}" target="_blank">${linkText.trim()}</a>`)
        .run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl.trim(), target: "_blank" }).run();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
  }, [editor, linkUrl, linkText]);

  const setFontSize = useCallback(
    (size: string) => {
      if (!editor) return;
      editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
    },
    [editor]
  );

  const setFontFamilyValue = useCallback(
    (family: string) => {
      if (!editor) return;
      if (family === "default") {
        editor.chain().focus().unsetFontFamily().run();
      } else {
        editor.chain().focus().setFontFamily(family).run();
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="border border-input rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-muted/50 border-b border-input">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="되돌리기">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="다시 실행">
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Font Family */}
        <Select onValueChange={setFontFamilyValue}>
          <SelectTrigger className="h-8 w-[100px] text-xs">
            <SelectValue placeholder="폰트" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((f) => (
              <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value === "default" ? "inherit" : f.value }}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select onValueChange={setFontSize}>
          <SelectTrigger className="h-8 w-[70px] text-xs">
            <SelectValue placeholder="크기" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}pt
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="제목 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="제목 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="제목 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Bold/Italic/Underline/Strike */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="굵게"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="기울임"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="밑줄"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="취소선"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="글자 색상">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-4 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
            <button
              type="button"
              className="mt-2 text-xs text-muted-foreground hover:text-foreground w-full text-center"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              색상 초기화
            </button>
          </PopoverContent>
        </Popover>

        {/* Highlight */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="배경 색상">
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-3 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                />
              ))}
            </div>
            <button
              type="button"
              className="mt-2 text-xs text-muted-foreground hover:text-foreground w-full text-center"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              배경 초기화
            </button>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="글머리 기호"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="번호 매기기"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="왼쪽 정렬"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="가운데 정렬"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="오른쪽 정렬"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="양쪽 정렬"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const { href } = editor.getAttributes("link");
            setLinkUrl(href || "");
            setLinkText("");
            setLinkDialogOpen(true);
          }}
          isActive={editor.isActive("link")}
          title="링크 삽입"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="링크 해제"
          >
            <Unlink className="h-4 w-4" />
          </ToolbarButton>
        )}

        {/* Image */}
        <ToolbarButton
          onClick={() => {
            setImageUrl("");
            setImageFile(null);
            setImageDialogOpen(true);
          }}
          title="이미지 삽입"
        >
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>

        {/* YouTube */}
        <ToolbarButton
          onClick={() => {
            setYoutubeUrl("");
            setYoutubeDialogOpen(true);
          }}
          title="유튜브 영상 삽입"
        >
          <YoutubeIcon className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Table */}
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="표 삽입 (3×3)"
        >
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("table") && (
          <>
            <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="열 추가">
              <Plus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()} title="열 삭제">
              <Minus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} title="행 추가">
              <Plus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()} title="행 삭제">
              <Minus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().mergeCells().run()} title="셀 병합">
              <Merge className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().splitCell().run()} title="셀 분할">
              <SplitSquareHorizontal className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} title="표 삭제">
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[300px] p-4 prose prose-sm max-w-none focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_p]:my-1 [&_.ProseMirror_p.is-empty]:min-h-[1em] [&_.ProseMirror_iframe]:rounded-lg [&_.ProseMirror_iframe]:my-4 [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:my-4 [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-border [&_.ProseMirror_td]:p-2 [&_.ProseMirror_td]:min-w-[80px] [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-border [&_.ProseMirror_th]:p-2 [&_.ProseMirror_th]:bg-muted [&_.ProseMirror_th]:font-semibold [&_.ProseMirror_th]:min-w-[80px] [&_.ProseMirror_.selectedCell]:bg-primary/10"
      />

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>이미지 삽입</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>파일 업로드</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImageFile(f);
                    setImageUrl("");
                  }
                }}
              />
            </div>
            <div className="text-center text-xs text-muted-foreground">또는</div>
            <div className="space-y-2">
              <Label>이미지 URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageFile(null);
                }}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Button onClick={handleImageInsert} disabled={imageUploading || (!imageFile && !imageUrl.trim())} className="w-full">
              {imageUploading ? "업로드 중..." : "삽입"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>유튜브 영상 삽입</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>유튜브 URL</Label>
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <Button onClick={handleYoutubeInsert} disabled={!youtubeUrl.trim()} className="w-full">
              삽입
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>링크 삽입</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>표시 텍스트 (선택)</Label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="텍스트를 선택한 경우 비워두세요"
              />
            </div>
            <Button onClick={handleLinkInsert} disabled={!linkUrl.trim()} className="w-full">
              삽입
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
