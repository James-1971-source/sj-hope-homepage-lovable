import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  link_url: string | null;
  slide_interval: number;
  display_order: number;
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      setBanners(data || []);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  const slideInterval = banners.length > 0 ? (banners[0]?.slide_interval || 5) * 1000 : 5000;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(goNext, slideInterval);
    return () => clearInterval(timer);
  }, [banners.length, slideInterval, goNext]);

  if (loading || banners.length === 0) return null;

  const handleClick = (banner: Banner) => {
    if (banner.link_url) {
      window.open(banner.link_url, "_blank");
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-muted">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full cursor-pointer"
            onClick={() => handleClick(banner)}
          >
            <img
              src={banner.image_url}
              alt={banner.title || "배너"}
              className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-contain"
            />
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/60 hover:bg-background/80 rounded-full p-2 transition-colors"
            aria-label="이전 배너"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/60 hover:bg-background/80 rounded-full p-2 transition-colors"
            aria-label="다음 배너"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentIndex ? "bg-primary" : "bg-background/60"
                }`}
                aria-label={`배너 ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
