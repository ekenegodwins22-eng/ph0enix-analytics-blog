import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | PHOENIX THE WEB3 SENSEI</title>
        <meta name="description" content="Privacy Policy for PHOENIX THE WEB3 SENSEI website. Learn how we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.senseiphoenix.name.ng/privacy" />
      </Helmet>

      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <p className="text-lg">
              <strong className="text-foreground">Last updated:</strong> January 21, 2025
            </p>
            
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
              <p>
                Welcome to PHOENIX THE WEB3 SENSEI ("we," "our," or "us"). We are committed to protecting your 
                privacy and personal information. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you visit our website at senseiphoenix.name.ng.
              </p>
              <p>
                By using our website, you agree to the collection and use of information in accordance with 
                this policy. If you do not agree with this policy, please do not use our website.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-foreground">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address (when you contact us or subscribe)</li>
                <li>Name (when provided voluntarily)</li>
                <li>Messages and correspondence you send to us</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and general location data</li>
                <li>Browser type and version</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referral sources and exit pages</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground">2.3 Cookies and Tracking</h3>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Essential cookies:</strong> Required for website functionality</li>
                <li><strong className="text-foreground">Analytics cookies:</strong> Google Analytics to understand user behavior</li>
                <li><strong className="text-foreground">Advertising cookies:</strong> Google AdSense for personalized advertising</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our website</li>
                <li>To respond to your inquiries and communications</li>
                <li>To analyze website usage and improve our content</li>
                <li>To display relevant advertisements through Google AdSense</li>
                <li>To send you updates and newsletters (with your consent)</li>
                <li>To detect and prevent fraudulent or malicious activity</li>
              </ul>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Third-Party Services</h2>
              <p>We work with the following third-party services:</p>
              
              <h3 className="text-xl font-semibold text-foreground">4.1 Google Analytics</h3>
              <p>
                We use Google Analytics to analyze website traffic. Google Analytics collects data through 
                cookies. You can opt out by installing the Google Analytics Opt-out Browser Add-on.
              </p>

              <h3 className="text-xl font-semibold text-foreground">4.2 Google AdSense</h3>
              <p>
                We display advertisements through Google AdSense. Google may use cookies to serve ads based 
                on your prior visits to our website or other websites. You can opt out of personalized 
                advertising at Google's Ad Settings.
              </p>

              <h3 className="text-xl font-semibold text-foreground">4.3 Affiliate Links</h3>
              <p>
                We participate in affiliate programs, including with Bitget. When you click on affiliate 
                links and make purchases, we may earn a commission. These third-party sites have their own 
                privacy policies.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, 
                no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a href="mailto:privacy@senseiphoenix.name.ng" className="text-primary hover:underline">
                  privacy@senseiphoenix.name.ng
                </a>
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Children's Privacy</h2>
              <p>
                Our website is not intended for children under 18 years of age. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a child, 
                please contact us immediately.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <a href="mailto:privacy@senseiphoenix.name.ng" className="text-primary hover:underline">
                    privacy@senseiphoenix.name.ng
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Website:</strong>{" "}
                  <a href="https://www.senseiphoenix.name.ng" className="text-primary hover:underline">
                    www.senseiphoenix.name.ng
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Twitter:</strong>{" "}
                  <a href="https://x.com/sensei_phoenixx" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    @sensei_phoenixx
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