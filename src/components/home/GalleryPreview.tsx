import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Images } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  images: string[] | null;
  created_at: string;
}

export default function GalleryPreview() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_albums")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setAlbums(data || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-muted/50">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (albums.length === 0) {
    return (
      <section className="section-padding bg-muted/50">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                갤러리
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                활동 사진
              </h2>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/gallery">
                전체 보기
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            등록된 앨범이 없습니다.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              갤러리
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              활동 사진
            </h2>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/gallery">
              전체 보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {albums.map((album) => {
            const thumbnailImage = album.images && album.images.length > 0 
              ? album.images[0] 
              : "/placeholder.svg";
            const imageCount = album.images?.length || 0;

            return (
              <Link
                key={album.id}
                to={`/gallery/${album.id}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <img
                  src={thumbnailImage}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">
                    {album.title}
                  </h3>
                  <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                    <Images className="h-4 w-4" />
                    {imageCount}장
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
