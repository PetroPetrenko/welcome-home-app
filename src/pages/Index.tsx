import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DealsSection from "@/components/DealsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DealsSection />
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        © 2026 InvestProp. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
