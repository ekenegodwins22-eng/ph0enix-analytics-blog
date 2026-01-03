import { Button } from "@/components/ui/button";
import { ArrowRight, Send, Twitter } from "lucide-react";

const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";
const BITGET = "https://partner.bitget.ng/bg/E283E7";
const X_FOLLOW = "https://x.com/intent/follow?screen_name=sensei_phoenixz";
const TELEGRAM = "https://t.me/sensei_phoenixz";
const TELEGRAM_BOT = "https://t.me/Ph0enixadmin_bot";

export const Hero = () => {
  const handleAnalyticsClick = (label: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'button',
        event_label: label,
      });
    }
  };

  const handleBitgetClick = () => {
    handleAnalyticsClick('Bitget Hero CTA');
    window.open(BITGET, '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img 
                src={PROFILE_IMG}
                alt="PHOENIX THE WEB3 SENSEI - Web3 Community Growth Ambassador and Strategist"
                className="w-64 h-64 rounded-full border-4 border-primary shadow-glow object-cover animate-scale-in"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="256"
                height="256"
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                I'm <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  PHOENIX THE WEB3 SENSEI
                </span>
                <br />
                <span className="text-foreground text-3xl md:text-5xl">
                  Building Engaged Web3 Communities That Thrive.
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                I help Web3 projects grow strong, engaged, and loyal communities that last.
                From onboarding systems to ambassador programs — I design growth that converts
                curious users into committed members.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
                  onClick={() => {
                    handleAnalyticsClick('View Resume Hero');
                    window.location.href = '/resume';
                  }}
                >
                  View Resume
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  onClick={() => {
                    handleAnalyticsClick('Blog Hero');
                    window.location.href = '/blog';
                  }}
                >
                  Blog
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  onClick={handleBitgetClick}
                >
                  Join Bitget
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button 
                  variant="ghost"
                  className="gap-2 text-muted-foreground hover:text-primary"
                  onClick={() => {
                    handleAnalyticsClick('X Follow Hero');
                    window.open(X_FOLLOW, '_blank');
                  }}
                >
                  <Twitter className="w-4 h-4" />
                  Follow @sensei_phoenixz
                </Button>
                <Button 
                  variant="ghost"
                  className="gap-2 text-muted-foreground hover:text-accent"
                  onClick={() => {
                    handleAnalyticsClick('Telegram Hero');
                    window.open(TELEGRAM, '_blank');
                  }}
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </Button>
                <Button 
                  variant="ghost"
                  className="gap-2 text-muted-foreground hover:text-primary"
                  onClick={() => {
                    handleAnalyticsClick('Chat Bot Hero');
                    window.open(TELEGRAM_BOT, '_blank');
                  }}
                >
                  <Send className="w-4 h-4" />
                  Chat Bot
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
