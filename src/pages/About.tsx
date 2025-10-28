import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrustBadges } from "@/components/TrustBadges";
import { Button } from "@/components/ui/button";
import { Mail, Twitter, Send } from "lucide-react";

const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";
const X_FOLLOW = "https://x.com/intent/follow?screen_name=ph0enix_web3";
const TELEGRAM = "https://t.me/ph0enix_web";
const TELEGRAM_BOT = "https://t.me/Ph0enixadmin_bot";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
            <img 
              src={PROFILE_IMG}
              alt="PH0ENIX_WEB3 - Web3 Community Growth Ambassador and Strategist"
              className="w-32 h-32 mx-auto rounded-full border-4 border-primary shadow-glow object-cover"
            />
            
            <h1 className="text-4xl md:text-6xl font-bold">
              About{" "}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                PH0ENIX_WEB3
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Professional Web3 community builder, crypto trading expert, and passionate advocate 
              for decentralized finance. Helping traders and communities thrive in the blockchain ecosystem.
            </p>

            <div className="flex justify-center gap-3">
              <Button size="icon" variant="outline" className="hover:border-primary/50 hover:text-primary" asChild>
                <a href={X_FOLLOW} target="_blank" rel="noreferrer">
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="hover:border-primary/50 hover:text-primary" asChild>
                <a href={TELEGRAM} target="_blank" rel="noreferrer">
                  <Send className="w-5 h-5" />
                </a>
              </Button>
              <Button size="icon" variant="outline" className="hover:border-primary/50 hover:text-primary" asChild>
                <a href="mailto:support@ph0enixweb3.dpdns.org">
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Story Section */}
          <div className="max-w-3xl mx-auto mb-16 space-y-6">
            <div className="rounded-xl bg-card border border-border p-8 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">My Story</h2>
              <div className="text-muted-foreground space-y-4 leading-relaxed">
                <p>
                  My journey into Web3 began with a simple fascination with blockchain technology. 
                  What started as curiosity quickly evolved into a passion for building communities 
                  and helping others navigate the complex world of cryptocurrency trading.
                </p>
                <p>
                  Over the years, I've had the privilege of working with thousands of community members, 
                  sharing insights on crypto trading, DeFi strategies, and the latest developments in 
                  the Web3 ecosystem.
                </p>
                <p>
                  Today, as an official Bitget partner, I continue to bridge the gap between cutting-edge 
                  crypto platforms and the communities that need them, always focusing on education, 
                  transparency, and sustainable growth.
                </p>
              </div>
            </div>

            {/* Expertise */}
            <div className="rounded-xl bg-card border border-border p-8 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Areas of Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Community Building & Management",
                  "Crypto Trading & Technical Analysis",
                  "DeFi Strategies & Protocols",
                  "Web3 Ecosystem Navigation",
                  "Risk Management & Security",
                  "Content Creation & Education",
                ].map((skill, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full" />
                    <span className="text-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="rounded-xl bg-card border border-border p-8 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Core Values</h2>
              <div className="space-y-3 text-muted-foreground">
                <div>
                  <span className="font-semibold text-primary">Transparency:</span> Always providing 
                  honest insights and clear information to the community.
                </div>
                <div>
                  <span className="font-semibold text-accent">Education:</span> Empowering others 
                  through knowledge sharing and continuous learning.
                </div>
                <div>
                  <span className="font-semibold text-primary">Community First:</span> Putting the 
                  needs of the community above everything else.
                </div>
                <div>
                  <span className="font-semibold text-accent">Innovation:</span> Staying ahead of 
                  trends and embracing new technologies in Web3.
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <TrustBadges />

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto mt-16 text-center space-y-6 rounded-xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 p-8">
            <h2 className="text-3xl font-bold text-foreground">
              Let's Build Together
            </h2>
            <p className="text-muted-foreground">
              Interested in collaboration, partnership opportunities, or just want to connect? 
              I'm always open to meaningful conversations.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
              asChild
            >
              <a href="mailto:support@ph0enixweb3.dpdns.org">
                <Mail className="mr-2 w-4 h-4" />
                Get in Touch
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
