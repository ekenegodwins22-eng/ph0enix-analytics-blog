import { Button } from "@/components/ui/button";
import { BlogCard } from "./BlogCard";
import { ArrowRight, Newspaper } from "lucide-react";

// Latest blog posts data
const latestPosts = [
  {
    slug: "bitget-community-guide",
    title: "Bitget x PH0ENIX_WEB3 — Community Growth & Trading Guide",
    description: "How Bitget empowers communities and traders in Web3. Learn about seamless crypto trading, social copy features, and earning passive income.",
    date: "2025-10-09",
    readTime: "5 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  },
  {
    slug: "how-to-build-web3-communities",
    title: "How to Build Thriving Web3 Communities",
    description: "Essential strategies for community managers in the decentralized world. From engagement tactics to growth metrics.",
    date: "2025-09-25",
    readTime: "8 min read",
    category: "Insights",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
  },
  {
    slug: "defi-trading-strategies-2024",
    title: "DeFi Trading Strategies for 2024",
    description: "Advanced trading techniques and risk management in decentralized finance. Stay ahead in the crypto markets.",
    date: "2025-09-15",
    readTime: "10 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
  },
];

export const FeaturedBlogPosts = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Latest Insights</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              From the Blog
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest Web3 insights, trading strategies, and community building tips
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            onClick={() => window.location.href = '/blog'}
          >
            View All Posts
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
