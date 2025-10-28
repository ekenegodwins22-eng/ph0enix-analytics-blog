import { Shield, Award, CheckCircle, Users } from "lucide-react";

export const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: "Bitget Verified",
      description: "Official Partner",
    },
    {
      icon: Award,
      title: "Web3 Certified",
      description: "Professional Expert",
    },
    {
      icon: CheckCircle,
      title: "Trusted by 10K+",
      description: "Community Members",
    },
    {
      icon: Users,
      title: "Active Network",
      description: "Growing Daily",
    },
  ];

  return (
    <section className="py-16 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Web3 Community
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partnered with leading platforms and backed by a thriving community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {badge.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Partner Logos Section */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-8 uppercase tracking-wider">
            Partnered With
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
              <span className="font-semibold text-lg text-foreground">Bitget</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-card border border-border hover:border-accent/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary" />
              <span className="font-semibold text-lg text-foreground">Web3 Network</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-accent to-primary" />
              <span className="font-semibold text-lg text-foreground">PH0ENIX Community</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
