import PageWrapper from "./components/PageWrapper";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import EducationSection from "./components/EducationSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <main className="min-h-screen">
        <div className="page-shell">
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <EducationSection />
        </div>
        <Footer />
      </main>
    </PageWrapper>
  );
}
