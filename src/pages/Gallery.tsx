import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ChevronRight, Images, X, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import programEducation from "@/assets/program-education.jpg";
import programCounseling from "@/assets/program-counseling.jpg";
import programCulture from "@/assets/program-culture.jpg";

const albums = [
  {
    id: 1,
    title: "2024 겨울방학 학습캠프",
    date: "2024-01-15",
    thumbnail: programEducation,
    images: [programEducation, programCounseling, programCulture],
    count: 24,
  },
  {
    id: 2,
    title: "청소년 심리상담 프로그램",
    date: "2024-01-10",
    thumbnail: programCounseling,
    images: [programCounseling, programEducation, programCulture],
    count: 18,
  },
  {
    id: 3,
    title: "문화예술 체험활동",
    date: "2024-01-05",
    thumbnail: programCulture,
    images: [programCulture, programEducation, programCounseling],
    count: 32,
  },
  {
    id: 4,
    title: "진로탐색 워크숍",
    date: "2023-12-20",
    thumbnail: programEducation,
    images: [programEducation, programCulture, programCounseling],
    count: 15,
  },
  {
    id: 5,
    title: "가족상담 프로그램",
    date: "2023-12-15",
    thumbnail: programCounseling,
    images: [programCounseling, programCulture, programEducation],
    count: 12,
  },
  {
    id: 6,
    title: "연말 감사 행사",
    date: "2023-12-10",
    thumbnail: programCulture,
    images: [programCulture, programCounseling, programEducation],
    count: 28,
  },
];

export default function Gallery() {
  const [selectedAlbum, setSelectedAlbum] = useState<typeof albums[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (album: typeof albums[0], index: number = 0) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) => 
        prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => openLightbox(album)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] text-left"
              >
                <img
                  src={album.thumbnail}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-primary-foreground mb-1">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between text-primary-foreground/80 text-sm">
                    <span>{album.date}</span>
                    <div className="flex items-center gap-1">
                      <Images className="h-4 w-4" />
                      {album.count}장
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
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
              {selectedAlbum && (
                <img
                  src={selectedAlbum.images[currentImageIndex]}
                  alt={`${selectedAlbum.title} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Navigation */}
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

            {/* Info */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-primary-foreground mb-1">
                {selectedAlbum?.title}
              </h3>
              <p className="text-sm text-primary-foreground/70">
                {currentImageIndex + 1} / {selectedAlbum?.images.length}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
