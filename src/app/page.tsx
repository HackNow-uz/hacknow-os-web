import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import TerminalSection from "@/components/TerminalSection";
import SystemRequirements from "@/components/SystemRequirements";
import DownloadSection from "@/components/DownloadSection";
import ReleasesSection from "@/components/ReleasesSection";
import DocsSection from "@/components/DocsSection";
import Footer from "@/components/Footer";
import { getLatestRelease } from "@/lib/github";

export const revalidate = 1800;

export default function Home() {
  const latestRelease = getLatestRelease();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection release={latestRelease} />
        <AboutSection />
        <FeaturesSection />
        <TerminalSection />
        <SystemRequirements />
        <DownloadSection release={latestRelease} />
        <ReleasesSection />
        <DocsSection />
      </main>
      <Footer />
    </>
  );
}
