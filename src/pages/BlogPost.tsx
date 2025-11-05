import { useParams, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogPost } from "@/data/blogPosts";
import { MarkdownContent } from "@/components/blog/MarkdownContent";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : null;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleBitgetClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'button',
        event_label: 'Blog Post Bitget Link',
      });
    }
    window.open('https://partner.bitget.ng/bg/E283E7', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Link to="/blog">
            <Button variant="ghost" className="mb-8 -ml-4 hover:text-primary">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Blog
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8 space-y-6">
            {/* Category badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/20">
              {post.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="mb-12">
            <MarkdownContent content={post.content || ''} />
          </div>

          {/* CTA Card */}
          <div className="mb-12 rounded-xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 p-8 space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to Start Your Crypto Journey?
            </h3>
            <p className="text-muted-foreground">
              Join Bitget today through PH0ENIX_WEB3's partnership link and get access to exclusive benefits.
            </p>
            <Button
              size="lg"
              onClick={handleBitgetClick}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
            >
              Join Bitget & Earn Up to 20% Commission
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Author Bio */}
          <AuthorBio />

          {/* Related Posts */}
          <RelatedPosts currentPost={post} />
        </div>
      </article>

      <Footer />
    </div>
  );
}
