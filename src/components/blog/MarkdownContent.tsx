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
      // Handle links [text](url)
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      // Handle bold **text**
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
      
      // Handle italic *text*
      text = text.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
      
      // Handle inline code `code`
      text = text.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">$1</code>');
      
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
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
