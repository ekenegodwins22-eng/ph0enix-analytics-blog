import { Twitter, Send, Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export const ShareButtons = ({ title, url, description }: ShareButtonsProps) => {
  const fullUrl = `https://www.senseiphoenix.name.ng${url}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=sensei_phoenixz`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      
      <Button
        variant="outline"
        size="icon"
        className="hover:border-primary/50 hover:text-primary h-9 w-9"
        asChild
      >
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (Twitter)"
        >
          <Twitter className="w-4 h-4" />
        </a>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="hover:border-primary/50 hover:text-primary h-9 w-9"
        asChild
      >
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Telegram"
        >
          <Send className="w-4 h-4" />
        </a>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="hover:border-primary/50 hover:text-primary h-9 w-9"
        onClick={copyToClipboard}
        aria-label="Copy link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="hover:border-primary/50 hover:text-primary h-9 w-9"
        onClick={handleShare}
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
