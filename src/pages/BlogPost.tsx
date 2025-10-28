import { useParams, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Sample blog post content
const blogPostsContent: Record<string, any> = {
  "bitget-community-guide": {
    title: "Bitget x PH0ENIX_WEB3 — Community Growth & Trading Guide",
    date: "2025-10-09",
    readTime: "5 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
    content: `
# 🌐 Bitget x PH0ENIX_WEB3 — Community Growth & Trading Guide

Welcome to another insight from **PH0ENIX_WEB3**! In today's post, we'll explore how Bitget helps traders and communities thrive in the Web3 ecosystem.

---

## 📈 Why Bitget Matters

Bitget offers seamless crypto trading, social copy features, and the ability to **earn passive income** — all in one place. As one of the fastest-growing cryptocurrency exchanges globally, Bitget has become an essential platform for both beginners and professional traders.

### Key Benefits:

- **Advanced Trading Tools**: Access to spot, futures, and copy trading
- **Security First**: Industry-leading security measures and insurance fund
- **Community Features**: Social trading and community insights
- **Competitive Fees**: Low trading fees with volume discounts
- **Fast Transactions**: Quick deposits and withdrawals

---

## 🚀 Getting Started with Bitget

The registration process is simple and straightforward:

1. **Sign Up**: Visit the platform and create your account
2. **Verify Identity**: Complete KYC verification (usually takes minutes)
3. **Deposit Funds**: Add crypto or fiat to your account
4. **Start Trading**: Access all trading features immediately

### Pro Tips for New Users:

- Start with small amounts to familiarize yourself with the platform
- Enable 2FA for enhanced security
- Explore the copy trading feature to learn from experienced traders
- Join the Bitget community for tips and insights

---

## 💰 Earning Opportunities

Bitget provides multiple ways to grow your portfolio:

### 1. Spot Trading
Traditional buy and sell of cryptocurrencies with competitive fees.

### 2. Futures Trading
Leverage up to 125x on selected trading pairs (use responsibly!).

### 3. Copy Trading
Follow and automatically copy trades from top performers.

### 4. Referral Program
Earn up to 20% commission by referring new users to the platform.

---

## 🌍 Building Communities with Bitget

As a community builder, I've seen firsthand how Bitget empowers group growth:

- **Transparent Performance Tracking**: Share verified trading results
- **Educational Resources**: Access to learning materials for your community
- **Partnership Opportunities**: Official partner benefits and support
- **Community Events**: Regular competitions and rewards

> 💡 **PH0ENIX_WEB3 Insight**: "The key to successful Web3 community building is providing real value. Platforms like Bitget allow us to offer our members genuine opportunities for growth and learning."

---

## 🎯 Final Thoughts

Bitget represents more than just a trading platform—it's a comprehensive ecosystem for crypto enthusiasts. Whether you're:

- A beginner looking to start your crypto journey
- An experienced trader seeking advanced tools
- A community builder wanting to provide value to members

Bitget has something to offer.

**Ready to get started?** Join Bitget today and take advantage of the partner benefits through PH0ENIX_WEB3.

---

### 🔗 Useful Links

- [Official Bitget Website](https://partner.bitget.ng/bg/E283E7)
- [Bitget Help Center](https://www.bitget.com/en/support)
- [Join PH0ENIX_WEB3 Community](#)

---

*Disclaimer: Trading cryptocurrencies carries risk. Always do your own research and never invest more than you can afford to lose.*
    `,
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPostsContent[slug] : null;

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
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-foreground space-y-6">
              {post.content.split('\n\n').map((paragraph: string, index: number) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.replace('# ', '')}</h1>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('> ')) {
                  return (
                    <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                      {paragraph.replace('> ', '')}
                    </blockquote>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return <li key={index} className="ml-6">{paragraph.replace('- ', '')}</li>;
                }
                if (paragraph.startsWith('---')) {
                  return <hr key={index} className="my-8 border-border" />;
                }
                if (paragraph.includes('💡') || paragraph.includes('🌐') || paragraph.includes('📈') || paragraph.includes('🚀')) {
                  return <p key={index} className="text-lg leading-relaxed my-4">{paragraph}</p>;
                }
                return paragraph ? <p key={index} className="text-muted-foreground leading-relaxed my-4">{paragraph}</p> : null;
              })}
            </div>
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
        </div>
      </article>

      <Footer />
    </div>
  );
}
