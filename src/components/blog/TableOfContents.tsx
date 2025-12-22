import { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    // Parse markdown headings from content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      
      matches.push({ id, text, level });
    }

    setHeadings(matches);
  }, [content]);

  if (headings.length < 3) return null; // Only show ToC for posts with 3+ headings

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="mb-8 rounded-xl bg-card border border-border p-4">
      <Button
        variant="ghost"
        className="w-full justify-between p-0 h-auto hover:bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-foreground">Table of Contents</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>

      {isOpen && (
        <ul className="mt-4 space-y-2">
          {headings.map((heading, index) => (
            <li
              key={index}
              style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className="text-left text-sm text-muted-foreground hover:text-primary transition-colors w-full py-1"
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};
