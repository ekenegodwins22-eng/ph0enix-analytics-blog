import { useParams, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

const SITE_URL = "https://www.senseiphoenix.name.ng";
const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const postUrl = `/blog/${post.slug}`;
  const fullUrl = `${SITE_URL}${postUrl}`;
  const publishDate = new Date(post.created_at).toISOString();
  const modifiedDate = new Date(post.updated_at).toISOString();

  // Structured data for the blog post
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.image || PROFILE_IMG,
    "datePublished": publishDate,
    "dateModified": modifiedDate,
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
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "keywords": post.tags?.join(", ") || post.category,
    "articleSection": post.category,
    "wordCount": post.content?.split(/\s+/).length || 0,
    "inLanguage": "en"
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${SITE_URL}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": fullUrl
      }
    ]
  };

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
      <Helmet>
        <title>{post.title} | PHOENIX THE WEB3 SENSEI Blog</title>
        <meta name="description" content={post.description} />
        <meta name="author" content="PHOENIX THE WEB3 SENSEI" />
        <meta name="keywords" content={post.tags?.join(", ") || post.category} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:image" content={post.image || PROFILE_IMG} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="PHOENIX THE WEB3 SENSEI" />
        <meta property="article:published_time" content={publishDate} />
        <meta property="article:modified_time" content={modifiedDate} />
        <meta property="article:author" content="PHOENIX THE WEB3 SENSEI" />
        <meta property="article:section" content={post.category} />
        {post.tags?.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={post.image || PROFILE_IMG} />
        <meta name="twitter:site" content="@sensei_phoenixz" />
        <meta name="twitter:creator" content="@sensei_phoenixz" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

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
          <header className="mb-8 space-y-6">
            {/* Category badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/20">
              {post.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground">
              {post.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={publishDate}>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time}</span>
              </div>
            </div>

            {/* Share buttons */}
            <ShareButtons 
              title={post.title} 
              url={postUrl} 
              description={post.description} 
            />
          </header>

          {/* Featured Image */}
          {post.image && (
            <figure className="mb-12 rounded-xl overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto"
                loading="eager"
              />
            </figure>
          )}

          {/* Table of Contents */}
          <TableOfContents content={post.content || ''} />

          {/* Content */}
          <div className="mb-12">
            <MarkdownContent content={post.content || ''} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share buttons bottom */}
          <div className="mb-12 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Found this helpful? Share it!</p>
            <ShareButtons 
              title={post.title} 
              url={postUrl} 
              description={post.description} 
            />
          </div>

          {/* CTA Card */}
          <div className="mb-12 rounded-xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 p-8 space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to Start Your Crypto Journey?
            </h3>
            <p className="text-muted-foreground">
              Join Bitget today through PHOENIX THE WEB3 SENSEI's partnership link and get access to exclusive benefits.
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
          <RelatedPosts currentPost={post} maxPosts={3} />
        </div>
      </article>

      <Footer />
    </div>
  );
}
