import { HeroSection } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/HeroSection";
import { AboutSection } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/AboutSection";
import { ProjectsSection } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/ProjectsSection";
import { SkillsSection } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/SkillsSection";
import { ExperienceSection } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/ExperienceSection";
import { ContactSection } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/ContactSection";
import { SmoothScroll } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/shared/SmoothScroll";
import { PhotoBridge } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/shared/PhotoBridge";

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
