import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LazyImage } from "@/components/LazyImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Twitter, Send, Github, Globe, Phone } from "lucide-react";
import { Helmet } from "react-helmet";

const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";
const SITE_URL = "https://www.senseiphoenix.name.ng";

const CORE_COMPETENCIES = [
  "Community Building & Management",
  "Strategic Growth Planning",
  "Engagement & Retention Design",
  "Crisis Management (FUD Control)",
  "Crypto Trading & Technical Analysis",
  "DeFi Strategies & Protocols",
  "Data Analysis & Insights",
  "AI Automation & Training",
  "Content Creation & Education",
];

const TECHNICAL_SKILLS = {
  "Programming Languages": "JavaScript, Python, TypeScript",
  "Web3 Technologies": "Smart Contracts, DeFi Protocols, NFT Standards, DAO Tools",
  "Blockchain Platforms": "Ethereum, Solana, Polygon, BSC",
  "Development Tools": "Hardhat, Foundry, Git, GitHub",
  "Data & Analytics": "Google Analytics, Data Visualization, Performance Metrics",
  "AI & Automation": "AI Training, Workflow Automation, Bot Development",
};

const TOOLS = {
  "Community Platforms": "Discord, Telegram, X (Twitter), Zealy, Galxe",
  "Productivity": "Notion, Google Workspace, Trello",
  "Automation": "Community Moderation Bots, Zapier, Custom Scripts",
  "Analytics": "Google Analytics, X Analytics, Community Metrics Dashboards",
  "Data & Freelance": "Google Docs, Google Sheets, Microsoft Excel, ChatGPT",
};

const CERTIFICATIONS = [
  "Bitget Verified Partner — Official Web3 Partner Status",
  "Web3 Certified Professional Expert",
  "GitHub Achievements: Pull Shark, YOLO, Quickdraw",
  "25+ Open Source Projects on GitHub",
];

export default function Resume() {
  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.docx';
    link.download = 'ANJORIN_DAMILOLA_PHOENIX_Resume.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>ANJORIN DAMILOLA — PHOENIX THE WEB3 SENSEI | Resume</title>
        <meta name="description" content="ANJORIN DAMILOLA IYANUOLUWA — Web3 Community Growth Ambassador, Bitget Partner, AI Automation Specialist. Based in Lagos, Nigeria." />
        <meta name="keywords" content="Web3 resume, community manager, Bitget, Zealy, crypto marketing, blockchain growth strategist, Phoenix, Anjorin Damilola" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/resume`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="ANJORIN DAMILOLA — PHOENIX THE WEB3 SENSEI Resume" />
        <meta property="og:description" content="Web3 Community Growth Ambassador | Bitget Partner | AI Automation Specialist" />
        <meta property="og:image" content={PROFILE_IMG} />
        <meta property="og:url" content={`${SITE_URL}/resume`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CryptoPhoenixz" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">

            {/* Header */}
            <Card className="p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <LazyImage
                  src={PROFILE_IMG}
                  alt="ANJORIN DAMILOLA IYANUOLUWA - PHOENIX THE WEB3 SENSEI"
                  className="w-32 h-32 rounded-full border-4 border-primary shadow-lg"
                  width="128"
                  height="128"
                />
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-1">Anjorin Damilola Iyanuoluwa</p>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                    PHOENIX THE WEB3 SENSEI
                  </h1>
                  <p className="text-lg text-muted-foreground mb-1">
                    Web3 Community Growth Ambassador • Bitget Partner • AI Automation Specialist
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Lagos, Nigeria • GMT +1 • DOB: 2002-05-15
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
                    <Button onClick={downloadResume} className="gap-2">
                      <Download className="w-4 h-4" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Professional Summary */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Professional Summary</h2>
              <Card className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Results-driven <strong className="text-foreground">Web3 Community Growth Ambassador and Strategist</strong> with extensive experience building engaged, loyal communities for blockchain projects. Proven track record of growing project participation by <strong className="text-foreground">200%+</strong> through strategic campaign design, ambassador programs, and automated engagement systems. Official <strong className="text-foreground">Bitget Partner</strong> with deep expertise in DeFi protocols, crypto trading, and community psychology. Combines technical proficiency in <strong className="text-foreground">AI automation and data analysis</strong> with strong interpersonal skills to convert curious users into committed community members.
                </p>
              </Card>
            </section>

            {/* Core Competencies */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Core Competencies</h2>
              <Card className="p-6">
                <div className="flex flex-wrap gap-2">
                  {CORE_COMPETENCIES.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-sm">{skill}</Badge>
                  ))}
                </div>
              </Card>
            </section>

            {/* Professional Experience */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Professional Experience</h2>
              <div className="space-y-4">
                {/* Role 1 */}
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Web3 Community Growth Ambassador</h3>
                    <span className="text-sm text-muted-foreground">2023 – Present</span>
                  </div>
                  <p className="text-sm text-primary mb-3">Freelance / Multiple Web3 Projects</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "Grew project participation by 200%+ across multiple Zealy sprints and ambassador challenges for Dropsy Protocol and Inference Labs",
                      "Designed and optimized campaign structures to retain members post-launch, increasing long-term community engagement",
                      "Built internal team systems to train moderators and ambassadors on engagement best practices",
                      "Deployed automated reward and onboarding funnels, reducing manual work by 60%",
                      "Partnered with Bitget as an official Web3 partner — secure user onboarding and loyalty growth",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2"><span className="text-primary mt-1">•</span><span>{item}</span></li>
                    ))}
                  </ul>
                </Card>

                {/* Role 2 */}
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Content Creator & Community Builder</h3>
                    <span className="text-sm text-muted-foreground">2022 – Present</span>
                  </div>
                  <p className="text-sm text-primary mb-3">Self-Employed / X (Twitter)</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "Built and manage @CryptoPhoenixz with 1,747+ followers and 4,294+ posts focused on Web3 education",
                      "Help crypto creators grow active, verified audiences on X using organic engagement strategies",
                      "Create daily insights and educational content on DeFi strategies, crypto trading, and Web3 navigation",
                      "Developed PH0ENIX Community — a thriving network of Web3 enthusiasts and traders",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2"><span className="text-primary mt-1">•</span><span>{item}</span></li>
                    ))}
                  </ul>
                </Card>

                {/* Role 3 */}
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Bot Developer & Automation Specialist</h3>
                    <span className="text-sm text-muted-foreground">2021 – Present</span>
                  </div>
                  <p className="text-sm text-primary mb-3">Freelance Projects</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "Developed PHOENIX-MD, a WhatsApp bot with 700+ features including audio/video editing, image/logo making, and account management",
                      "Created Telegram automation bots with premium membership features, online streaming, and fast download capabilities",
                      "Built bitcoin-platform-upgrade project using TypeScript for cryptocurrency platform enhancements",
                      "Implemented AI automation workflows for community management and data analysis tasks",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2"><span className="text-primary mt-1">•</span><span>{item}</span></li>
                    ))}
                  </ul>
                </Card>
              </div>
            </section>

            {/* Freelance Services */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Freelance Services</h2>
              <Card className="p-6">
                <div className="flex flex-wrap gap-2">
                  {["Data Entry (Excel, Google Sheets)", "Lead Generation", "Web Research", "Document Formatting", "Social Media Posting", "Virtual Assistant Tasks"].map((s, i) => (
                    <Badge key={i} variant="outline" className="text-sm">{s}</Badge>
                  ))}
                </div>
              </Card>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Technical Skills</h2>
              <Card className="p-6">
                <ul className="space-y-2 text-muted-foreground">
                  {Object.entries(TECHNICAL_SKILLS).map(([category, skills]) => (
                    <li key={category} className="flex gap-2">
                      <span className="text-accent">→</span>
                      <span><strong className="text-foreground">{category}:</strong> {skills}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            {/* Tools & Platforms */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Tools & Platforms</h2>
              <Card className="p-6">
                <ul className="space-y-2 text-muted-foreground">
                  {Object.entries(TOOLS).map(([category, tools]) => (
                    <li key={category} className="flex gap-2">
                      <span className="text-accent">→</span>
                      <span><strong className="text-foreground">{category}:</strong> {tools}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            {/* Notable Projects */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Notable Projects</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">PHOENIX-MD WhatsApp Bot</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Feature-rich WhatsApp bot with 700+ capabilities including audio/video editing, image/logo making, downloading, and account management.
                  </p>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="https://github.com/Phoenix1185/PHOENIX-MD" target="_blank" rel="noreferrer">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  </Button>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Bitcoin Platform Upgrade</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cryptocurrency platform enhancement built with TypeScript, focusing on improving UX and platform functionality for Bitcoin services.
                  </p>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="https://github.com/Phoenix1185/bitcoin-platform-upgrade" target="_blank" rel="noreferrer">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  </Button>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">PH0ENIX Community</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Personal brand and community platform — Web3 education, crypto trading insights, blog, portfolio, and Bitget partnership.
                  </p>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="https://senseiphoenix.name.ng" target="_blank" rel="noreferrer">
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  </Button>
                </Card>
              </div>
            </section>

            {/* Education & Certifications */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Education & Certifications</h2>
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-1">Self-Taught Web3 Professional</h3>
                <p className="text-sm text-muted-foreground mb-4">Continuous Learning through Online Courses, Certifications, and Hands-on Experience • 2021 – Present</p>
                <ul className="space-y-2 text-muted-foreground">
                  {CERTIFICATIONS.map((cert, i) => (
                    <li key={i} className="flex gap-2"><span className="text-primary mt-1">•</span><span>{cert}</span></li>
                  ))}
                </ul>
              </Card>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Languages</h2>
              <Card className="p-6">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary">English (Professional Working Proficiency)</Badge>
                  <Badge variant="secondary">Yoruba (Native)</Badge>
                </div>
              </Card>
            </section>

            {/* Connect */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Connect & Collaborate</h2>
              <Card className="p-6">
                <p className="text-muted-foreground mb-4">
                  Open to collaborations with Web3 projects, protocols, and marketing teams. Let's create communities that last beyond the hype.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="mailto:anjoriniyanuoluwa08@gmail.com">
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="https://x.com/CryptoPhoenixz" target="_blank" rel="noreferrer">
                      <Twitter className="w-4 h-4" /> @CryptoPhoenixz
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="https://t.me/sensei_phoenixz" target="_blank" rel="noreferrer">
                      <Send className="w-4 h-4" /> Telegram
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a href="https://github.com/Phoenix1185" target="_blank" rel="noreferrer">
                      <Github className="w-4 h-4" /> GitHub
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
