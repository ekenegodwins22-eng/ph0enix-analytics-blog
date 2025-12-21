import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { AlertTriangle } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Disclaimer | PHOENIX THE WEB3 SENSEI</title>
        <meta name="description" content="Important disclaimer about the content and information provided on PHOENIX THE WEB3 SENSEI website regarding cryptocurrency and trading." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.senseiphoenix.name.ng/disclaimer" />
      </Helmet>

      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Disclaimer
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <p className="text-lg">
              <strong className="text-foreground">Last updated:</strong> January 21, 2025
            </p>
            
            {/* Risk Warning Banner */}
            <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-6 flex gap-4">
              <AlertTriangle className="w-8 h-8 text-destructive shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-destructive mb-2">HIGH RISK WARNING</h2>
                <p className="text-foreground">
                  Trading cryptocurrencies and digital assets carries a <strong>HIGH LEVEL OF RISK</strong> and 
                  may not be suitable for all investors. You could lose some or all of your invested capital. 
                  Never invest money you cannot afford to lose.
                </p>
              </div>
            </div>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. General Disclaimer</h2>
              <p>
                The information provided on PHOENIX THE WEB3 SENSEI (senseiphoenix.name.ng) is for 
                general informational and educational purposes only. All information on the website 
                is provided in good faith, however, we make no representation or warranty of any kind, 
                express or implied, regarding the accuracy, adequacy, validity, reliability, availability, 
                or completeness of any information on the website.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Not Financial Advice</h2>
              <p>
                <strong className="text-foreground">UNDER NO CIRCUMSTANCES</strong> shall any information 
                presented on this website be construed as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Financial advice or investment recommendation</li>
                <li>Trading advice or signals</li>
                <li>Legal, tax, or accounting advice</li>
                <li>Professional advice of any kind</li>
              </ul>
              <p className="mt-4">
                Before making any financial decisions, you should consult with a qualified financial 
                advisor, accountant, or legal professional who is licensed in your jurisdiction.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Investment Risks</h2>
              <p>
                Cryptocurrency trading and investing involves substantial risk of loss and is not 
                suitable for every investor. The valuation of cryptocurrencies and digital assets 
                may fluctuate, and you may lose some or all of your investment.
              </p>
              <p>Key risks include but are not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Market Volatility:</strong> Crypto prices can change dramatically in short periods</li>
                <li><strong className="text-foreground">Regulatory Risk:</strong> Laws and regulations may change</li>
                <li><strong className="text-foreground">Technology Risk:</strong> Smart contracts and platforms may have vulnerabilities</li>
                <li><strong className="text-foreground">Liquidity Risk:</strong> Some assets may be difficult to sell</li>
                <li><strong className="text-foreground">Security Risk:</strong> Hacks, scams, and theft are prevalent in the crypto space</li>
                <li><strong className="text-foreground">Loss of Access:</strong> Losing private keys means permanent loss of funds</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Past Performance</h2>
              <p>
                <strong className="text-foreground">Past performance is not indicative of future results.</strong> Any 
                references to historical returns or past performance of any investments, trading 
                strategies, or markets are provided for illustrative purposes only and should not be 
                relied upon as an indication or guarantee of future performance.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Affiliate Relationships</h2>
              <p>
                This website participates in affiliate marketing programs. This means we may receive 
                compensation when you click on links to products or services and make a purchase or 
                sign up for a service.
              </p>
              <p>
                Our affiliate partners include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Bitget:</strong> Cryptocurrency exchange platform</li>
              </ul>
              <p className="mt-4">
                While we strive to provide honest and objective information, our affiliate relationships 
                may create a conflict of interest. We encourage you to conduct your own independent 
                research before using any products or services we recommend.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Third-Party Content</h2>
              <p>
                This website may contain links to external websites, references to third-party products, 
                services, or content that are not owned or controlled by us. We have no control over 
                and assume no responsibility for the content, privacy policies, or practices of any 
                third-party websites or services.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. No Guarantees</h2>
              <p>
                We make no guarantees regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The accuracy or reliability of any information on this website</li>
                <li>Any specific results from using strategies or techniques discussed</li>
                <li>The performance of any cryptocurrency, token, or digital asset</li>
                <li>The availability or uptime of this website</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Personal Responsibility</h2>
              <p>
                You are solely responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conducting your own research and due diligence</li>
                <li>Making your own investment and trading decisions</li>
                <li>Understanding the risks involved in cryptocurrency trading</li>
                <li>Securing your own wallets and private keys</li>
                <li>Complying with all applicable laws and regulations in your jurisdiction</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. Limitation of Liability</h2>
              <p>
                In no event shall PHOENIX THE WEB3 SENSEI, its owner, employees, partners, or affiliates 
                be liable for any direct, indirect, incidental, special, consequential, or punitive 
                damages, including but not limited to loss of profits, data, use, or other intangible 
                losses, resulting from your access to or use of (or inability to access or use) this 
                website or any content therein.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">10. Contact</h2>
              <p>
                If you have any questions about this Disclaimer, please contact us at{" "}
                <a href="mailto:support@senseiphoenix.name.ng" className="text-primary hover:underline">
                  support@senseiphoenix.name.ng
                </a>
              </p>
            </section>

            {/* Final Warning */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
              <p className="text-foreground font-semibold text-lg">
                By using this website, you acknowledge that you have read, understood, and agree to 
                be bound by this Disclaimer.
              </p>
              <p className="mt-2">
                <strong className="text-primary">DYOR - Do Your Own Research. Stay Safe.</strong>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}