import AboutSection from "./components/AboutSection";
import CanvasBackground from "./components/CanvasBackground";
import ContactSection from "./components/ContactSection";
import CredibilityStrip from "./components/CredibilityStrip";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import PokerLab from "./components/PokerLab";
import ProjectsSection from "./components/ProjectsSection";
import VolunteerSkillsSection from "./components/VolunteerSkillsSection";

export default function Home() {
  return (
    <>
      <CanvasBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen">
        <div className="page-shell">
          <HeroSection />
          <CredibilityStrip />
          <PokerLab />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <EducationSection />
          <VolunteerSkillsSection />
          <ContactSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
