import { BlogCard } from "./BlogCard";
import { useBlogPosts, BlogPost } from "@/hooks/useBlogPosts";
import { Newspaper } from "lucide-react";

interface RelatedPostsProps {
  currentPost: BlogPost;
  maxPosts?: number;
}

export const RelatedPosts = ({ currentPost, maxPosts = 3 }: RelatedPostsProps) => {
  const { data: allPosts = [] } = useBlogPosts();
  
  // Calculate relevance score for each post
  const scoredPosts = allPosts
    .filter(post => post.slug !== currentPost.slug) // Exclude current post
    .map(post => {
      let score = 0;
      
      // Same category gets high score
      if (post.category === currentPost.category) {
        score += 10;
      }
      
      // Shared tags get points
      const sharedTags = post.tags?.filter(tag => 
        currentPost.tags?.includes(tag)
      ) || [];
      score += sharedTags.length * 5;
      
      return { post, score };
    })
    .filter(({ score }) => score > 0) // Only show posts with some relevance
    .sort((a, b) => b.score - a.score) // Sort by relevance
    .slice(0, maxPosts); // Limit number of posts

  if (scoredPosts.length === 0) {
    return null; // Don't show section if no related posts
  }

  return (
    <section className="py-12 border-t border-border">
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Newspaper className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Related Articles</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          You Might Also Like
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scoredPosts.map(({ post }) => (
          <BlogCard 
            key={post.slug} 
            slug={post.slug}
            title={post.title}
            description={post.description}
            date={post.created_at}
            category={post.category}
            image={post.image || undefined}
            readTime={post.read_time || undefined}
          />
        ))}
      </div>
    </section>
  );
};
