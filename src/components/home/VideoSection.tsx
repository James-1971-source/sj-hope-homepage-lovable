import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  description: string | null;
  is_featured: boolean;
  display_order: number;
}

// YouTube URL에서 비디오 ID 추출
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideoSection() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["featured-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data as Video[];
    },
  });

  if (isLoading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-video rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Play className="h-4 w-4" />
            활동 영상
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            우리의 이야기를 영상으로 만나보세요
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            S&J희망나눔의 다양한 활동과 프로그램을 영상으로 확인하실 수 있습니다.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const videoId = extractYouTubeId(video.youtube_url);
            if (!videoId) return null;

            return (
              <div
                key={video.id}
                className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Video Embed */}
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
