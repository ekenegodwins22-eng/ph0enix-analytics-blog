import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/LazyImage";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

export const BlogCard = ({
  slug,
  title,
  description,
  date,
  readTime,
  category,
  image,
}: BlogCardProps) => {
  const categoryColors: Record<string, string> = {
    Guides: "bg-primary/10 text-primary border-primary/20",
    Insights: "bg-accent/10 text-accent border-accent/20",
    Announcements: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <Link to={`/blog/${slug}`}>
      <article className="group h-full rounded-xl bg-card border border-border hover:border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-elegant">
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden bg-muted">
            <LazyImage
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width="400"
              height="192"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category badge */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
              categoryColors[category] || "bg-muted text-muted-foreground border-border"
            }`}
          >
            {category}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-3">{description}</p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Read more */}
          <Button
            variant="ghost"
            className="group/btn p-0 h-auto text-primary hover:text-primary-glow hover:bg-transparent"
          >
            Read Article
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </article>
    </Link>
  );
};
