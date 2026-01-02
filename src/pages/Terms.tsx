import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service | PHOENIX THE WEB3 SENSEI</title>
        <meta name="description" content="Terms of Service for PHOENIX THE WEB3 SENSEI website. Read our terms and conditions for using our services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.senseiphoenix.name.ng/terms" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Terms of Service | PHOENIX THE WEB3 SENSEI" />
        <meta property="og:description" content="Terms of Service for PHOENIX THE WEB3 SENSEI website. Read our terms and conditions." />
        <meta property="og:url" content="https://www.senseiphoenix.name.ng/terms" />
        <meta property="og:image" content="https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png" />
        <meta property="og:site_name" content="PHOENIX THE WEB3 SENSEI" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms of Service | PHOENIX THE WEB3 SENSEI" />
        <meta name="twitter:description" content="Terms of Service for PHOENIX THE WEB3 SENSEI website." />
        <meta name="twitter:site" content="@sensei_phoenixz" />
        <meta name="twitter:creator" content="@sensei_phoenixz" />
      </Helmet>

      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <p className="text-lg">
              <strong className="text-foreground">Last updated:</strong> January 21, 2025
            </p>
            
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the PHOENIX THE WEB3 SENSEI website (senseiphoenix.name.ng), you 
                accept and agree to be bound by these Terms of Service. If you do not agree to these terms, 
                please do not use our website.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Description of Services</h2>
              <p>
                PHOENIX THE WEB3 SENSEI provides educational content, blog articles, trading insights, and 
                information about Web3, cryptocurrency, DeFi, and blockchain technology. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Educational blog posts and articles</li>
                <li>Trading analysis and market insights</li>
                <li>Web3 community resources</li>
                <li>Affiliate links to third-party platforms (including Bitget)</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. No Financial Advice</h2>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-foreground font-semibold">
                  IMPORTANT DISCLAIMER:
                </p>
                <p className="mt-2">
                  The content provided on this website is for <strong className="text-foreground">educational and informational purposes only</strong>. 
                  It does NOT constitute financial advice, investment advice, trading advice, or any other 
                  form of professional advice.
                </p>
              </div>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>We are not licensed financial advisors or investment professionals</li>
                <li>Trading cryptocurrencies involves substantial risk of loss</li>
                <li>Past performance does not guarantee future results</li>
                <li>You should consult with a qualified financial advisor before making investment decisions</li>
                <li>Never invest more than you can afford to lose</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Affiliate Disclosure</h2>
              <p>
                This website contains affiliate links to third-party websites and services, including but 
                not limited to Bitget. When you click on these links and make purchases or sign up for 
                services, we may earn a commission at no additional cost to you.
              </p>
              <p>
                Our affiliate relationships do not influence the objectivity of our content. However, we 
                encourage you to conduct your own research before using any third-party service.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Intellectual Property</h2>
              <p>
                All content on this website, including but not limited to text, graphics, logos, images, 
                and software, is the property of PHOENIX THE WEB3 SENSEI or its content creators and is 
                protected by intellectual property laws.
              </p>
              <p>You may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, reproduce, or distribute our content without permission</li>
                <li>Modify or create derivative works from our content</li>
                <li>Use our content for commercial purposes without authorization</li>
                <li>Remove any copyright or proprietary notices from our content</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. User Conduct</h2>
              <p>When using our website, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information when communicating with us</li>
                <li>Not engage in any unlawful or harmful activities</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not interfere with the proper functioning of our website</li>
                <li>Not use automated systems to access our website without permission</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the 
                content, privacy policies, or practices of these external sites. Visiting third-party 
                links is at your own risk.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, PHOENIX THE WEB3 SENSEI shall not be liable for 
                any direct, indirect, incidental, special, consequential, or punitive damages resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or inability to use our website</li>
                <li>Any trading or investment decisions based on our content</li>
                <li>Any errors or omissions in our content</li>
                <li>Unauthorized access to or use of our servers</li>
                <li>Any third-party content or conduct on our website</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless PHOENIX THE WEB3 SENSEI and its affiliates from 
                any claims, damages, losses, or expenses arising from your use of our website or violation 
                of these Terms of Service.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be effective 
                immediately upon posting on this page. Your continued use of our website after changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">11. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with applicable 
                international laws. Any disputes shall be resolved through good faith negotiation.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">12. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us:</p>
              <ul className="list-none space-y-2">
                <li>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <a href="mailto:support@senseiphoenix.name.ng" className="text-primary hover:underline">
                    support@senseiphoenix.name.ng
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Website:</strong>{" "}
                  <a href="https://www.senseiphoenix.name.ng" className="text-primary hover:underline">
                    www.senseiphoenix.name.ng
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}