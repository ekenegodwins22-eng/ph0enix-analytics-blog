import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBadges } from "@/components/TrustBadges";
import { BitgetSection } from "@/components/bitget/BitgetSection";
import { FeaturedBlogPosts } from "@/components/blog/FeaturedBlogPosts";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Zap, Target, Heart, Lightbulb } from "lucide-react";
import { Helmet } from "react-helmet";

const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";
const BITGET = "https://partner.bitget.ng/bg/E283E7";
const SITE_URL = "https://www.senseiphoenix.name.ng";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PHOENIX THE WEB3 SENSEI | Web3 Community & Trading Insights</title>
        <meta name="description" content="PHOENIX THE WEB3 SENSEI — Web3 Community Builder, Ambassador & Strategist. Building thriving, engaged communities across Web3, DeFi, and tech ecosystems." />
        <meta name="keywords" content="Web3, community growth, Bitget, Zealy, crypto ambassador, blockchain marketing, PHOENIX THE WEB3 SENSEI, sensei_phoenixz, community building, DeFi engagement" />
        <meta name="author" content="PHOENIX THE WEB3 SENSEI" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={SITE_URL} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PHOENIX THE WEB3 SENSEI | Web3 Community & Trading Insights" />
        <meta property="og:description" content="Web3 Community Builder, Ambassador & Strategist. Building thriving, engaged communities across Web3, DeFi, and tech ecosystems." />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={PROFILE_IMG} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="PHOENIX THE WEB3 SENSEI" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PHOENIX THE WEB3 SENSEI | Web3 Community & Trading Insights" />
        <meta name="twitter:description" content="Web3 Community Builder, Ambassador & Strategist. Building thriving communities in Web3 & DeFi." />
        <meta name="twitter:image" content={PROFILE_IMG} />
        <meta name="twitter:site" content="@sensei_phoenixz" />
        <meta name="twitter:creator" content="@sensei_phoenixz" />
        
        {/* JSON-LD Person Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "PHOENIX THE WEB3 SENSEI",
            "alternateName": ["sensei_phoenixz", "Phoenix Web3", "Sensei Phoenix"],
            "url": SITE_URL,
            "image": PROFILE_IMG,
            "jobTitle": "Web3 Growth Strategist & Community Builder",
            "worksFor": {
              "@type": "Organization",
              "name": "PHOENIX THE WEB3 SENSEI"
            },
            "affiliation": {
              "@type": "Organization",
              "name": "Bitget",
              "url": BITGET
            },
            "sameAs": [
              "https://x.com/sensei_phoenixz",
              "https://twitter.com/sensei_phoenixz",
              "https://t.me/sensei_phoenixz",
              "https://t.me/Ph0enixadmin_bot"
            ],
            "email": "mail@senseiphoenix.name.ng",
            "disambiguatingDescription": "Independent professional not affiliated with any other company or project named Phoenix."
          })}
        </script>

        {/* JSON-LD Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PHOENIX THE WEB3 SENSEI",
            "url": SITE_URL,
            "logo": PROFILE_IMG,
            "description": "Independent Web3 strategist brand helping blockchain projects scale community engagement and retention.",
            "sameAs": [
              "https://x.com/sensei_phoenixz",
              "https://t.me/sensei_phoenixz"
            ],
            "founder": {
              "@type": "Person",
              "name": "PHOENIX THE WEB3 SENSEI"
            },
            "affiliation": {
              "@type": "Organization",
              "name": "Bitget",
              "url": BITGET
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Business inquiries",
              "email": "contact@senseiphoenix.name.ng",
              "url": "https://t.me/Ph0enixadmin_bot"
            }
          })}
        </script>

        {/* JSON-LD Website Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PHOENIX THE WEB3 SENSEI Official Site",
            "url": SITE_URL,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${SITE_URL}/blog?search={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <TrustBadges />

        {/* About Section */}
        <section id="about" className="py-20 bg-gradient-to-b from-background to-background/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              About <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">PHOENIX THE WEB3 SENSEI</span>
            </h2>
            <Card className="p-8 bg-card/50 backdrop-blur">
              <p className="text-muted-foreground leading-relaxed mb-4">
                I'm PHOENIX THE WEB3 SENSEI — a Web3 community growth strategist and ambassador helping blockchain projects scale and connect with their true supporters.
                My journey started with curiosity about blockchain communities and grew into a mission to make the decentralized world more human.
                I specialise in designing growth systems that convert curious users into active believers — through onboarding, ambassador programs, and creative campaigns.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Focus Areas:</strong> Community development, Ambassador programs, Zealy & Galxe optimization, Engagement systems, and Brand partnerships.
              </p>
            </Card>
          </div>
        </section>

        <FeaturedBlogPosts />

        <BitgetSection />

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Projects & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Collaborations</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <h3 className="text-lg font-bold mb-2 text-foreground">Inference Labs</h3>
                <p className="text-sm text-muted-foreground">Community engagement & meme campaigns to increase visibility.</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <h3 className="text-lg font-bold mb-2 text-foreground">Dropsy Protocol</h3>
                <p className="text-sm text-muted-foreground">Zealy sprints & community beta testing to improve retention.</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <h3 className="text-lg font-bold mb-2 text-foreground">Zealy Sprints</h3>
                <p className="text-sm text-muted-foreground">Strategy and top-ranked participation in multiple sprints.</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <h3 className="text-lg font-bold mb-2 text-foreground">Bitget</h3>
                <p className="text-sm text-muted-foreground">Official partner: affiliate onboarding & community promotions.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-gradient-to-b from-background/50 to-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Core <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Competencies</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Community Support & Management</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Community Support & Ticket Management</Badge>
                  <Badge variant="secondary">Promoting Teamwork & Collaboration</Badge>
                  <Badge variant="secondary">Strategic Consulting for Community Growth</Badge>
                  <Badge variant="secondary">Problem Solving & Communication</Badge>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold text-foreground">Community Management</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Scam Reporting & Spam Protection</Badge>
                  <Badge variant="secondary">Hosting Interactive Games & Events</Badge>
                  <Badge variant="secondary">Managing FUD & Uncertainty</Badge>
                  <Badge variant="secondary">Technical Support</Badge>
                </div>
              </Card>

              <Card className="p-8 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Tools & Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Discord, Telegram, X (Twitter)</Badge>
                  <Badge variant="secondary">Zealy (Quests, XP Systems)</Badge>
                  <Badge variant="secondary">Notion, Google Workspace</Badge>
                  <Badge variant="secondary">Community Moderation Bots</Badge>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="insights" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Community Building <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Philosophy</span>
            </h2>
            <Card className="p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Great Web3 communities aren't built overnight — they grow through connection, education,
                  and shared goals. Every successful project I've worked with started by focusing on people
                  first, not only the token or tech. A real community listens, rewards contribution, and
                  empowers members to become advocates.
                </p>
                <p>
                  My strategy blends structured growth systems with genuine storytelling. I build frameworks
                  that help projects maintain engagement even after the hype fades — whether through quests,
                  ambassador programs, or educational sprints that keep members excited to participate.
                </p>
                <p>
                  I also collaborate with teams to design transparent communication, feedback loops, and
                  reward systems that make members feel seen and valued. That's the difference between a
                  quiet group and a thriving ecosystem.
                </p>
                <p className="text-foreground font-medium">
                  The future of Web3 will belong to communities that stay human — and that's exactly what
                  PHOENIX THE WEB3 SENSEI stands for.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-b from-background/50 to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Contact & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Connect</span>
            </h2>
            <Card className="p-8">
              <p className="text-muted-foreground mb-6 text-center">
                Ready to build something great? Let's collaborate to create thriving digital communities.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-semibold min-w-[100px]">Email:</span>
                  <a href="mailto:mail@senseiphoenix.name.ng" className="text-primary hover:text-primary-glow transition-colors">
                    mail@senseiphoenix.name.ng
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-semibold min-w-[100px]">Contact:</span>
                  <a href="mailto:contact@senseiphoenix.name.ng" className="text-primary hover:text-primary-glow transition-colors">
                    contact@senseiphoenix.name.ng
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-semibold min-w-[100px]">X (Follow):</span>
                  <a href="https://x.com/intent/follow?screen_name=sensei_phoenixz" target="_blank" rel="noreferrer" className="text-primary hover:text-primary-glow transition-colors">
                    @sensei_phoenixz
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-semibold min-w-[100px]">Telegram:</span>
                  <a href="https://t.me/sensei_phoenixz" target="_blank" rel="noreferrer" className="text-primary hover:text-primary-glow transition-colors">
                    @sensei_phoenixz
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-semibold min-w-[100px]">Chat Bot:</span>
                  <a href="https://t.me/Ph0enixadmin_bot" target="_blank" rel="noreferrer" className="text-primary hover:text-primary-glow transition-colors">
                    @Ph0enixadmin_bot
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section id="disclaimer" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-8">Disclaimer</h2>
            <Card className="p-8 bg-card/50 backdrop-blur">
              <p className="text-muted-foreground leading-relaxed mb-4">
                PHOENIX THE WEB3 SENSEI is an independent community strategist and Web3 ambassador not affiliated
                with any other "Phoenix" or similarly named organizations, projects, or brands.
                All content, strategies, and partnerships presented here represent independent professional
                work for Web3 community development and education.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This website serves as a personal professional portfolio, showcasing experience,
                community growth frameworks, and collaborations across blockchain ecosystems.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background/50 to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-12 text-center bg-gradient-to-br from-card via-card to-primary/10 border-primary/20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Build Something Great?</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Let's work together to create thriving digital communities that inspire, engage, and empower every member.
              </p>
              <blockquote className="text-lg italic text-primary/80 mb-8 border-l-4 border-primary pl-4 py-2">
                "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."
                <br />
                <span className="text-sm text-muted-foreground">- Proverbs 3:5-6</span>
              </blockquote>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300" asChild>
                <a href="/resume">View Resume</a>
              </Button>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;
