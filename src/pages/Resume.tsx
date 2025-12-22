import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LazyImage } from "@/components/LazyImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Twitter, Send } from "lucide-react";
import { Helmet } from "react-helmet";

const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";
const SITE_URL = "https://www.senseiphoenix.name.ng";

export default function Resume() {
  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'PHOENIX_THE_WEB3_SENSEI_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>PHOENIX THE WEB3 SENSEI — Professional Resume & Portfolio</title>
        <meta name="description" content="PHOENIX THE WEB3 SENSEI — Professional Web3 Community Manager & Growth Strategist with proven success in ambassador programs, Zealy campaigns, and Web3 community expansion." />
        <meta name="keywords" content="Web3 resume, community manager, Bitget, Zealy, crypto marketing, blockchain growth strategist, sensei_phoenixz" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/resume`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="PHOENIX THE WEB3 SENSEI — Web3 Community Manager Resume" />
        <meta property="og:description" content="Experienced Web3 strategist helping blockchain projects grow and scale through authentic engagement." />
        <meta property="og:image" content={PROFILE_IMG} />
        <meta property="og:url" content={`${SITE_URL}/resume`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sensei_phoenixz" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Header */}
            <Card className="p-8 mb-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <LazyImage 
                  src={PROFILE_IMG} 
                  alt="PHOENIX THE WEB3 SENSEI - Professional Web3 Community Manager and Ambassador" 
                  className="w-32 h-32 rounded-full border-4 border-primary shadow-lg"
                  width="128"
                  height="128"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                    PHOENIX THE WEB3 SENSEI
                  </h1>
                  <p className="text-sm text-muted-foreground mb-1">@sensei_phoenixz</p>
                  <p className="text-xl text-muted-foreground mb-2">
                    Community Growth Ambassador • Web3 Strategist
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    DOB: 2002-05-15 • Age: 23 • Timezone: GMT +1
                  </p>
                  <Button onClick={downloadResume} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Resume (PDF)
                  </Button>
                </div>
              </div>
            </Card>

            {/* About Me */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">About Me</h2>
              <Card className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I'm <strong className="text-foreground">PHOENIX THE WEB3 SENSEI</strong> — a Web3 community growth strategist and ambassador
                  helping projects scale through authentic engagement, educational campaigns, and community psychology.
                  I build sustainable ecosystems that turn users into long-term believers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  My approach blends <strong className="text-foreground">strategy, empathy, and structure</strong> — using Zealy, Galxe,
                  and creative community systems to design engagement that truly lasts.
                </p>
              </Card>
            </section>

            {/* Experience */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Experience (Impact-Focused)</h2>
              <Card className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Grew project participation by <strong className="text-foreground">200%+</strong> across multiple Zealy sprints and ambassador challenges.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Optimized campaign structures for <strong className="text-foreground">Dropsy Protocol</strong> and <strong className="text-foreground">Inference Labs</strong> to retain members post-launch.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Built internal team systems to train moderators and ambassadors on engagement best practices.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Deployed automated reward and onboarding funnels, cutting manual work by 60%.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Partnered with <strong className="text-foreground">Bitget</strong> as an official Web3 partner — focusing on secure user onboarding and loyalty growth.</span>
                  </li>
                </ul>
              </Card>
            </section>

            {/* Core Competencies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Core Competencies</h2>
              <Card className="p-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Community Support & Ticket Systems",
                    "Strategic Growth Planning",
                    "Engagement & Retention Design",
                    "Leadership & Team Collaboration",
                    "Scam Reporting & Spam Protection",
                    "Creative Campaign Planning",
                    "Crisis Management (FUD Control)",
                    "Technical Support & Education"
                  ].map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            </section>

            {/* Tools & Tech Stack */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Tools & Tech Stack</h2>
              <Card className="p-6">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-accent">→</span>
                    <span>Discord, Telegram, X (Twitter)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">→</span>
                    <span>Zealy (Quests, XP, Sprints), Galxe, Notion</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">→</span>
                    <span>Google Workspace & Analytics</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">→</span>
                    <span>Community Moderation Bots & Automation</span>
                  </li>
                </ul>
              </Card>
            </section>

            {/* Connect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Connect & Collaborate</h2>
              <Card className="p-6">
                <p className="text-muted-foreground mb-4">
                  Open to collaborations with Web3 projects, protocols, and marketing teams.
                  Let's create communities that last beyond the hype.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="mailto:mail@senseiphoenix.name.ng">
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="https://x.com/intent/follow?screen_name=sensei_phoenixz" target="_blank" rel="noreferrer">
                      <Twitter className="w-4 h-4" />
                      @sensei_phoenixz
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="https://t.me/sensei_phoenixz" target="_blank" rel="noreferrer">
                      <Send className="w-4 h-4" />
                      Telegram
                    </a>
                  </Button>
                </div>
              </Card>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
