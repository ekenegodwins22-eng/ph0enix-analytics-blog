import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BookOpen } from "lucide-react";

// Sample blog posts data
const blogPosts = [
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
  {
    slug: "web3-ecosystem-update",
    title: "Web3 Ecosystem: Q4 2024 Update",
    description: "Latest developments in blockchain technology, new protocols, and emerging opportunities in the Web3 space.",
    date: "2025-09-01",
    readTime: "6 min read",
    category: "Announcements",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
  },
  {
    slug: "crypto-security-best-practices",
    title: "Crypto Security Best Practices",
    description: "Protect your digital assets with these essential security measures. Hardware wallets, 2FA, and more.",
    date: "2025-08-20",
    readTime: "7 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
  },
  {
    slug: "future-of-decentralized-exchanges",
    title: "The Future of Decentralized Exchanges",
    description: "Analyzing trends and innovations in DEX technology. What's next for permissionless trading?",
    date: "2025-08-10",
    readTime: "9 min read",
    category: "Insights",
    image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80",
  },
];

const categories = ["All", "Guides", "Insights", "Announcements"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Knowledge Hub</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Blog & Insights
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest in Web3, crypto trading, and community building
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>

          {/* Empty state */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No posts found in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
