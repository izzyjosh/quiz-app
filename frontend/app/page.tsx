import Header from "@/components/header";
import LandingBackground from "./_components/LandingBackground";
import LandingBenefits from "./_components/LandingBenefits";
import LandingCta from "./_components/LandingCta";
import LandingHero from "./_components/LandingHero";
import LandingHowItWorks from "./_components/LandingHowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <LandingBackground />

      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <LandingHero />
        <LandingBenefits />
        <LandingHowItWorks />
        <LandingCta />
      </main>
    </div>
  );
}
