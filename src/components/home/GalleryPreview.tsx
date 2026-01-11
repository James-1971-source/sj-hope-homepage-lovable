import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Images } from "lucide-react";
import programEducation from "@/assets/program-education.jpg";
import programCounseling from "@/assets/program-counseling.jpg";
import programCulture from "@/assets/program-culture.jpg";

const galleryItems = [
  {
    id: 1,
    title: "2024 겨울방학 학습캠프",
    image: programEducation,
    count: 24,
  },
  {
    id: 2,
    title: "청소년 상담 프로그램",
    image: programCounseling,
    count: 18,
  },
  {
    id: 3,
    title: "문화예술 체험활동",
    image: programCulture,
    count: 32,
  },
];

export default function GalleryPreview() {
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
          {galleryItems.map((item) => (
            <Link
              key={item.id}
              to={`/gallery/${item.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-primary-foreground mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                  <Images className="h-4 w-4" />
                  {item.count}장
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
