import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import SiteSettingsAdmin from "./pages/admin/SiteSettingsAdmin";
import BannersAdmin from "./pages/admin/BannersAdmin";
import PageContentsAdmin from "./pages/admin/PageContentsAdmin";
import PostsAdmin from "./pages/admin/PostsAdmin";
import ProgramsAdmin from "./pages/admin/ProgramsAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import VideosAdmin from "./pages/admin/VideosAdmin";
import ResourcesAdmin from "./pages/admin/ResourcesAdmin";
import DonationsAdmin from "./pages/admin/DonationsAdmin";
import VolunteersAdmin from "./pages/admin/VolunteersAdmin";
import MessagesAdmin from "./pages/admin/MessagesAdmin";
import NotFound from "./pages/NotFound";
import HomepageProgramsAdmin from "./pages/admin/HomepageProgramsAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/*" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<ProgramDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<News />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:id" element={<Gallery />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<SiteSettingsAdmin />} />
            <Route path="/admin/banners" element={<BannersAdmin />} />
            <Route path="/admin/pages" element={<PageContentsAdmin />} />
            <Route path="/admin/homepage-programs" element={<HomepageProgramsAdmin />} />
            <Route path="/admin/posts" element={<PostsAdmin />} />
            <Route path="/admin/programs" element={<ProgramsAdmin />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />
            <Route path="/admin/videos" element={<VideosAdmin />} />
            <Route path="/admin/resources" element={<ResourcesAdmin />} />
            <Route path="/admin/donations" element={<DonationsAdmin />} />
            <Route path="/admin/volunteers" element={<VolunteersAdmin />} />
            <Route path="/admin/messages" element={<MessagesAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
