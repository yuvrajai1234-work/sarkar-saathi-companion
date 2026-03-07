import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import ImpactStats from "@/components/ImpactStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <HowItWorks />
      <ImpactStats />
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p className="font-display font-semibold text-foreground mb-1">Sarkar Saathi</p>
        <p>Your AI Companion for Government Schemes</p>
      </footer>
    </div>
  );
};

export default Index;
