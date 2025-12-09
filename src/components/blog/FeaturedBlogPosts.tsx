import { Button } from "@/components/ui/button";
import { BlogCard } from "./BlogCard";
import { ArrowRight, Newspaper } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedBlogPosts = () => {
  const { data: posts = [], isLoading } = useBlogPosts();
  const latestPosts = posts.slice(0, 3);

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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Blog Cards Grid */}
        {!isLoading && latestPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {latestPosts.map((post) => (
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

        {/* Empty State */}
        {!isLoading && latestPosts.length === 0 && (
          <div className="text-center py-12 mb-12">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        )}

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
