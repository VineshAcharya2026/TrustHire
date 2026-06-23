import { LandingHeader } from "@/components/home/LandingHeader";
import { LandingHero } from "@/components/home/LandingHero";
import { QuickStartForm } from "@/components/home/QuickStartForm";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { RolePlanSection } from "@/components/home/RolePlanSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FAQSection } from "@/components/home/FAQSection";
import { LandingFooter } from "@/components/home/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <LandingHero />
        <QuickStartForm />
        <BenefitsSection />
        <RolePlanSection />
        <HowItWorksSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}
