import PageWrapper from "@/app/(home)/PageWrapper";
import Navbar from "@/app/(chrome)/Navbar";
import HeroSection from "@/app/(home)/HeroSection";
import AboutSection from "@/app/(home)/AboutSection";
import ProjectsSection from "@/app/(home)/ProjectsSection";
import TectonixSection from "@/app/(home)/TectonixSection";
import SideQuestsSection from "@/app/(home)/SideQuestsSection";
import Footer from "@/app/(chrome)/Footer";

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <TectonixSection />
          <SideQuestsSection />
        </div>
        <Footer />
      </main>
    </PageWrapper>
  );
}
