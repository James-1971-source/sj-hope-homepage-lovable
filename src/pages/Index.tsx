import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import NewsSection from "@/components/home/NewsSection";
import VideoSection from "@/components/home/VideoSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import SupportSection from "@/components/home/SupportSection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <ProgramsSection />
      <NewsSection />
      <VideoSection />
      <GalleryPreview />
      <SupportSection />
    </Layout>
  );
}
