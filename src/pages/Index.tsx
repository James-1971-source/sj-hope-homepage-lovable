import Layout from "@/components/layout/Layout";
import BannerSlider from "@/components/home/BannerSlider";
import HeroSection from "@/components/home/HeroSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import NewsSection from "@/components/home/NewsSection";
import RecruitmentSection from "@/components/home/RecruitmentSection";
import VideoSection from "@/components/home/VideoSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import SupportSection from "@/components/home/SupportSection";

export default function Index() {
  return (
    <Layout>
      <BannerSlider />
      <HeroSection />
      <ProgramsSection />
      <NewsSection />
      <RecruitmentSection />
      <VideoSection />
      <GalleryPreview />
      <SupportSection />
    </Layout>
  );
}
