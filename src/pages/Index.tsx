import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBadges } from "@/components/TrustBadges";
import { BitgetSection } from "@/components/bitget/BitgetSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBadges />
      <BitgetSection />
      <Footer />
    </div>
  );
};

export default Index;
