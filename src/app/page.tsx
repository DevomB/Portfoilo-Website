import PageWrapper from "./components/PageWrapper";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import SideQuestsSection from "./components/SideQuestsSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SideQuestsSection />
        </div>
        <Footer />
      </main>
    </PageWrapper>
  );
}
