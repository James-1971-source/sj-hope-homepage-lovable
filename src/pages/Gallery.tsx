import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ChevronRight, Images, X, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  images: string[] | null;
  created_at: string;
}

export default function Gallery() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_albums")
          .select("*")
          .order("created_at", { ascending: false });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const openLightbox = (album: GalleryAlbum, index: number = 0) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedAlbum && selectedAlbum.images) {
      setCurrentImageIndex((prev) =>
        prev === selectedAlbum.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedAlbum && selectedAlbum.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedAlbum.images!.length - 1 : prev - 1
      );
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <span>갤러리</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            갤러리
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            S&J희망나눔의 다양한 활동 사진을 만나보세요.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
              ))}
            </div>
          ) : albums.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => {
                const thumbnailImage = album.images && album.images.length > 0
                  ? album.images[0]
                  : "/placeholder.svg";
                const imageCount = album.images?.length || 0;

                return (
                  <button
                    key={album.id}
                    onClick={() => openLightbox(album)}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] text-left"
                    disabled={imageCount === 0}
                  >
                    <img
                      src={thumbnailImage}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-primary-foreground mb-1">
                        {album.title}
                      </h3>
                      <div className="flex items-center justify-between text-primary-foreground/80 text-sm">
                        <span>{formatDate(album.created_at)}</span>
                        <div className="flex items-center gap-1">
                          <Images className="h-4 w-4" />
                          {imageCount}장
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">등록된 앨범이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedAlbum} onOpenChange={() => closeLightbox()}>
        <DialogContent className="max-w-5xl p-0 bg-foreground/95 border-none">
          <div className="relative">
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors">
              <X className="h-6 w-6 text-primary-foreground" />
            </DialogClose>

            {/* Image */}
            <div className="relative aspect-[16/10]">
              {selectedAlbum && selectedAlbum.images && selectedAlbum.images.length > 0 && (
                <img
                  src={selectedAlbum.images[currentImageIndex]}
                  alt={`${selectedAlbum.title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Navigation */}
            {selectedAlbum && selectedAlbum.images && selectedAlbum.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-primary-foreground" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-primary-foreground" />
                </button>
              </>
            )}

            {/* Info */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-primary-foreground mb-1">
                {selectedAlbum?.title}
              </h3>
              <p className="text-sm text-primary-foreground/70">
                {currentImageIndex + 1} / {selectedAlbum?.images?.length || 0}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
