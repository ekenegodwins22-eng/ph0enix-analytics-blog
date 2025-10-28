import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Zap, ArrowRight, ExternalLink } from "lucide-react";

export const BitgetSection = () => {
  const handleBitgetClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'button',
        event_label: 'Bitget Partnership Link',
      });
    }
    window.open('https://partner.bitget.ng/bg/E283E7', '_blank');
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Trade & Earn",
      description: "Access professional trading tools and earn up to 20% commission",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "World-class security with advanced protection for your assets",
    },
    {
      icon: Zap,
      title: "Fast KYC",
      description: "Simple signup process with quick verification",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Official Partnership</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold">
            Trade Smarter with{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Bitget
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the fastest-growing crypto exchange. Simple signup, fast KYC, and world-class security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 p-8 md:p-12 space-y-6">
          <div className="space-y-4 text-center">
            <h3 className="text-3xl font-bold text-foreground">
              Start Trading with Bitget Today
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sign up now and get access to advanced trading features, competitive fees, 
              and exclusive partner benefits. Earn up to 20% commission on referrals.
            </p>
          </div>

          {/* Benefits list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Simple registration process",
              "Fast KYC verification",
              "World-class security measures",
              "24/7 customer support",
              "Competitive trading fees",
              "Up to 20% referral commission",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-3 h-3 text-accent" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleBitgetClick}
              className="group bg-gradient-to-r from-primary via-primary-glow to-accent hover:shadow-glow transition-all duration-300 text-lg px-8"
            >
              Join Bitget & Start Earning
              <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="text-center text-sm text-muted-foreground">
            Trusted by millions of traders worldwide • Secure • Regulated • Professional
          </p>
        </div>
      </div>
    </section>
  );
};
