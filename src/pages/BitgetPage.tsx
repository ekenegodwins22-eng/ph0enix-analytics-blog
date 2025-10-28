import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BitgetSection } from "@/components/bitget/BitgetSection";

export default function BitgetPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <BitgetSection />
      </main>
      <Footer />
    </div>
  );
}
