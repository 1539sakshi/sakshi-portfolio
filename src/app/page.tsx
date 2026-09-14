import { HeroSection } from "@/components/sites/sakshi-portfolio/root/HeroSection";
import { AboutSection } from "@/components/sites/sakshi-portfolio/root/AboutSection";
import { ProjectsSection } from "@/components/sites/sakshi-portfolio/root/ProjectsSection";
import { SkillsSection } from "@/components/sites/sakshi-portfolio/root/SkillsSection";
import { ExperienceSection } from "@/components/sites/sakshi-portfolio/root/ExperienceSection";
import { ContactSection } from "@/components/sites/sakshi-portfolio/root/ContactSection";
import { SmoothScroll } from "@/components/sites/sakshi-portfolio/shared/SmoothScroll";
import { PhotoBridge } from "@/components/sites/sakshi-portfolio/shared/PhotoBridge";

export const metadata = {
  title: "Sakshi Singh — Frontend Engineer",
  description: "Portfolio of Sakshi Singh, frontend engineer building for the web.",
};

export default function Home() {
  return (
    <main className="site-sakshi">
      <SmoothScroll />
      <PhotoBridge />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </main>
  );
}
