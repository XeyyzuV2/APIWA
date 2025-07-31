import { NavBar } from "@/components/nav-bar";
import { HeroSection } from "@/components/hero-section";
import { WhyChooseSection } from "@/components/why-choose-section";
import { PricingSection } from "@/components/pricing-section";
import { ApiDocsPreviewSection } from "@/components/api-docs-preview-section";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col">
        <HeroSection />
        <WhyChooseSection />
        <PricingSection />
        <ApiDocsPreviewSection />
      </main>
    </>
  );
}
