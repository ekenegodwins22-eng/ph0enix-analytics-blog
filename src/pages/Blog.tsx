import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BookOpen } from "lucide-react";
import { useBlogPostsByCategory } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

const SITE_URL = "https://www.senseiphoenix.name.ng";
const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";
const categories = ["All", "Guides", "Trading", "DeFi", "News", "Analysis", "Tutorials"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: posts = [], isLoading } = useBlogPostsByCategory(activeCategory);

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PHOENIX THE WEB3 SENSEI Blog",
    "description": "Web3 education, crypto trading insights, DeFi strategies, and blockchain technology guides by PHOENIX THE WEB3 SENSEI.",
    "url": `${SITE_URL}/blog`,
    "author": {
      "@type": "Person",
      "name": "PHOENIX THE WEB3 SENSEI",
      "url": `${SITE_URL}/about`,
      "sameAs": [
        "https://x.com/sensei_phoenixz",
        "https://t.me/sensei_phoenixz"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "PHOENIX THE WEB3 SENSEI",
      "logo": {
        "@type": "ImageObject",
        "url": PROFILE_IMG
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog & Insights | PHOENIX THE WEB3 SENSEI - Web3 Education Hub</title>
        <meta name="description" content="Explore Web3 education, crypto trading guides, DeFi strategies, and blockchain insights. Stay updated with PHOENIX THE WEB3 SENSEI's latest articles." />
        <meta name="keywords" content="Web3 blog, crypto trading, DeFi guides, blockchain education, cryptocurrency, sensei_phoenixz" />
        <meta name="author" content="PHOENIX THE WEB3 SENSEI" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${SITE_URL}/blog`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog & Insights | PHOENIX THE WEB3 SENSEI" />
        <meta property="og:description" content="Explore Web3 education, crypto trading guides, DeFi strategies, and blockchain insights." />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:image" content={PROFILE_IMG} />
        <meta property="og:site_name" content="PHOENIX THE WEB3 SENSEI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog & Insights | PHOENIX THE WEB3 SENSEI" />
        <meta name="twitter:description" content="Web3 education, crypto trading guides, DeFi strategies, and blockchain insights." />
        <meta name="twitter:image" content={PROFILE_IMG} />
        <meta name="twitter:site" content="@sensei_phoenixz" />
        <meta name="twitter:creator" content="@sensei_phoenixz" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(blogListSchema)}
        </script>
      </Helmet>

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

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Blog Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  date={post.created_at}
                  readTime={post.read_time || "5 min read"}
                  category={post.category}
                  image={post.image || undefined}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && posts.length === 0 && (
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
