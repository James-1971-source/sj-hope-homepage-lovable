import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Loader2, FileIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  type?: "image" | "file";
  className?: string;
}

export default function FileUpload({
  onUpload,
  accept = "*/*",
  maxSize = 10,
  type = "file",
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${type === "image" ? "images" : "files"}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      onUpload(urlData.publicUrl);
      toast.success("파일이 업로드되었습니다.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 transition-colors",
        dragActive ? "border-primary bg-primary/5" : "border-border",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />
      <div className="flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">업로드 중...</p>
          </>
        ) : (
          <>
            {type === "image" ? (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            ) : (
              <FileIcon className="h-8 w-8 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              클릭하거나 파일을 여기에 드래그하세요
            </p>
            <p className="text-xs text-muted-foreground">
              최대 {maxSize}MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export interface MultiFileUploadProps {
  urls?: string[];
  onUrlsChange?: (urls: string[]) => void;
  onUpload?: (urls: string[]) => void;
  accept?: string;
  maxSize?: number;
  type?: "image" | "file";
  folder?: string;
  label?: string;
}

export function MultiFileUpload({
  urls = [],
  onUrlsChange,
  onUpload,
  accept = "image/*",
  maxSize = 10,
  type = "image",
}: MultiFileUploadProps) {
  const handleUpload = (url: string) => {
    if (onUrlsChange) {
      onUrlsChange([...urls, url]);
    }
    if (onUpload) {
      onUpload([...urls, url]);
    }
  };

  const handleRemove = (index: number) => {
    if (onUrlsChange) {
      onUrlsChange(urls.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <FileUpload
        onUpload={handleUpload}
        accept={accept}
        maxSize={maxSize}
        type={type}
      />
      
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {urls.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              {type === "image" ? (
                <img
                  src={url}
                  alt={`업로드된 이미지 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
