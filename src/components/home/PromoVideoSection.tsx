import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "lucide-react";

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

export default function PromoVideoSection() {
  const { settings, loading } = useSiteSettings();

  const videoUrl = settings.promo_video_url;
  const title = settings.promo_video_title || "기관 홍보영상";
  const subtitle = settings.promo_video_subtitle || "";

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container-wide">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="aspect-video max-w-4xl mx-auto rounded-2xl" />
        </div>
      </section>
    );
  }

  if (!videoUrl) return null;

  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) return null;

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-secondary-foreground/10 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Film className="h-4 w-4" />
            홍보영상
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Video */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg ring-1 ring-secondary-foreground/10">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
