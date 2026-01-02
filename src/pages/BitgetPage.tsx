import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BitgetSection } from "@/components/bitget/BitgetSection";
import { Helmet } from "react-helmet";

const SITE_URL = "https://www.senseiphoenix.name.ng";
const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";

export default function BitgetPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Join Bitget with PHOENIX THE WEB3 SENSEI | Crypto Trading Partner</title>
        <meta name="description" content="Join Bitget through PHOENIX THE WEB3 SENSEI's official partner link. Get exclusive benefits, up to 20% commission, and access to premium trading features." />
        <meta name="keywords" content="Bitget, crypto trading, cryptocurrency exchange, PHOENIX THE WEB3 SENSEI, sensei_phoenixz, affiliate" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/bitget`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Join Bitget with PHOENIX THE WEB3 SENSEI" />
        <meta property="og:description" content="Join Bitget through PHOENIX THE WEB3 SENSEI's official partner link. Get exclusive benefits and up to 20% commission." />
        <meta property="og:url" content={`${SITE_URL}/bitget`} />
        <meta property="og:image" content={PROFILE_IMG} />
        <meta property="og:site_name" content="PHOENIX THE WEB3 SENSEI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join Bitget with PHOENIX THE WEB3 SENSEI" />
        <meta name="twitter:description" content="Join Bitget through PHOENIX THE WEB3 SENSEI's official partner link." />
        <meta name="twitter:image" content={PROFILE_IMG} />
        <meta name="twitter:site" content="@sensei_phoenixz" />
        <meta name="twitter:creator" content="@sensei_phoenixz" />
      </Helmet>
      
      <Navbar />
      <main className="pt-16">
        <BitgetSection />
      </main>
      <Footer />
    </div>
  );
}
