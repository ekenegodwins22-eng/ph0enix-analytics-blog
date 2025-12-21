import { ReactNode } from "react";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const renderContent = (): ReactNode[] => {
    const lines = content.split('\n');
    const elements: ReactNode[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let codeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListTag = listType;
        elements.push(
          <ListTag key={`list-${elements.length}`} className="my-4 ml-6 list-disc space-y-2">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-muted-foreground leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    const flushCodeBlock = () => {
      if (codeBlock.length > 0) {
        elements.push(
          <pre key={`code-${elements.length}`} className="my-4 p-4 bg-muted rounded-lg overflow-x-auto">
            <code className={`language-${codeLanguage} text-sm`}>
              {codeBlock.join('\n')}
            </code>
          </pre>
        );
        codeBlock = [];
        codeLanguage = '';
      }
    };

    const renderInlineFormatting = (text: string): ReactNode => {
      // Split by patterns and build an array of elements
      const parts: ReactNode[] = [];
      let remaining = text;
      let keyIndex = 0;

      while (remaining.length > 0) {
        // Check for clickable image: [![alt](img-url)](link-url)
        const clickableImageMatch = remaining.match(/^\[\!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/);
        if (clickableImageMatch) {
          const [fullMatch, alt, imgUrl, linkUrl] = clickableImageMatch;
          parts.push(
            <a 
              key={`clickable-img-${keyIndex++}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block my-4"
            >
              <img 
                src={imgUrl} 
                alt={alt} 
                className="rounded-lg max-w-full h-auto hover:opacity-90 transition-opacity cursor-pointer"
                loading="lazy"
              />
            </a>
          );
          remaining = remaining.slice(fullMatch.length);
          continue;
        }

        // Check for standalone image: ![alt](url)
        const imageMatch = remaining.match(/^\!\[([^\]]*)\]\(([^)]+)\)/);
        if (imageMatch) {
          const [fullMatch, alt, url] = imageMatch;
          parts.push(
            <img 
              key={`img-${keyIndex++}`}
              src={url} 
              alt={alt} 
              className="rounded-lg max-w-full h-auto my-4"
              loading="lazy"
            />
          );
          remaining = remaining.slice(fullMatch.length);
          continue;
        }

        // Check for link: [text](url)
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [fullMatch, linkText, url] = linkMatch;
          parts.push(
            <a 
              key={`link-${keyIndex++}`}
              href={url}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </a>
          );
          remaining = remaining.slice(fullMatch.length);
          continue;
        }

        // Check for bold: **text**
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          const [fullMatch, boldText] = boldMatch;
          parts.push(
            <strong key={`bold-${keyIndex++}`} className="font-bold">
              {boldText}
            </strong>
          );
          remaining = remaining.slice(fullMatch.length);
          continue;
        }

        // Check for italic: *text*
        const italicMatch = remaining.match(/^\*([^*]+)\*/);
        if (italicMatch) {
          const [fullMatch, italicText] = italicMatch;
          parts.push(
            <em key={`italic-${keyIndex++}`} className="italic">
              {italicText}
            </em>
          );
          remaining = remaining.slice(fullMatch.length);
          continue;
        }

        // Check for inline code: `code`
        const codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
          const [fullMatch, codeText] = codeMatch;
          parts.push(
            <code key={`code-${keyIndex++}`} className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">
              {codeText}
            </code>
          );
          remaining = remaining.slice(fullMatch.length);
          continue;
        }

        // No special pattern found, add the next character as plain text
        // Find the next special character or end of string
        const nextSpecialIndex = remaining.slice(1).search(/[\[\!\*`]/);
        const endIndex = nextSpecialIndex === -1 ? remaining.length : nextSpecialIndex + 1;
        parts.push(remaining.slice(0, endIndex));
        remaining = remaining.slice(endIndex);
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          flushList();
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        } else {
          inCodeBlock = false;
          flushCodeBlock();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlock.push(line);
        return;
      }

      // Empty lines
      if (!line.trim()) {
        flushList();
        return;
      }

      // Horizontal rule
      if (line.trim() === '---') {
        flushList();
        elements.push(<hr key={`hr-${index}`} className="my-8 border-border" />);
        return;
      }

      // Headings
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${index}`} className="text-4xl font-bold mt-8 mb-4 text-foreground">
            {renderInlineFormatting(line.slice(2))}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="text-3xl font-bold mt-8 mb-4 text-foreground">
            {renderInlineFormatting(line.slice(3))}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="text-2xl font-bold mt-6 mb-3 text-foreground">
            {renderInlineFormatting(line.slice(4))}
          </h3>
        );
        return;
      }

      if (line.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={`h4-${index}`} className="text-xl font-bold mt-4 mb-2 text-foreground">
            {renderInlineFormatting(line.slice(5))}
          </h4>
        );
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={`quote-${index}`} className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-primary/5 rounded-r">
            {renderInlineFormatting(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Unordered lists
      if (line.match(/^[\s]*[-*+]\s/)) {
        const content = line.replace(/^[\s]*[-*+]\s/, '');
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(content);
        return;
      }

      // Ordered lists
      if (line.match(/^[\s]*\d+\.\s/)) {
        const content = line.replace(/^[\s]*\d+\.\s/, '');
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(content);
        return;
      }

      // Regular paragraphs
      flushList();
      elements.push(
        <p key={`p-${index}`} className="text-muted-foreground leading-relaxed my-4">
          {renderInlineFormatting(line)}
        </p>
      );
    });

    flushList();
    flushCodeBlock();

    return elements;
  };

  return <div className="prose prose-lg max-w-none">{renderContent()}</div>;
}