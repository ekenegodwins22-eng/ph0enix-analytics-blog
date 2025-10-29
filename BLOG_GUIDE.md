# 📝 Complete Blog Guide - How to Add Posts

## Table of Contents
1. [Overview](#overview)
2. [Blog Structure](#blog-structure)
3. [Adding a New Blog Post](#adding-a-new-blog-post)
4. [MDX vs Markdown](#mdx-vs-markdown)
5. [Frontmatter Reference](#frontmatter-reference)
6. [Writing Content](#writing-content)
7. [Images & Media](#images--media)
8. [Categories](#categories)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Your blog supports **both MDX and Markdown** files, giving you flexibility in content creation:
- **Markdown (.md)**: Simple text-based content with formatting
- **MDX (.mdx)**: Markdown + React components for interactive content

All blog posts live in the `src/content/blog/` directory.

---

## Blog Structure

```
src/content/blog/
├── example-post.mdx          # Example MDX post
├── another-post.md           # Example Markdown post
└── your-new-post.mdx         # Your new post here!
```

---

## Adding a New Blog Post

### Step 1: Create a New File

1. Navigate to `src/content/blog/`
2. Create a new file with either `.mdx` or `.md` extension
3. Name it using lowercase and hyphens (e.g., `my-awesome-post.mdx`)

### Step 2: Add Frontmatter

Every blog post **must** start with frontmatter (metadata) at the top:

```mdx
---
title: "Your Awesome Blog Post Title"
description: "A brief description of your post that appears in previews and SEO"
date: "2025-01-15"
category: "Guides"
image: "https://images.unsplash.com/photo-example?w=1200&q=80"
readTime: "5 min read"
author: "Your Name"
tags: ["web3", "crypto", "tutorial"]
published: true
---

Your content starts here...
```

### Step 3: Write Your Content

After the frontmatter, write your blog content using Markdown syntax (see [Writing Content](#writing-content) section below).

### Step 4: Save & Test

1. Save your file
2. The blog will automatically detect and display your new post
3. Visit `/blog` to see it in the list
4. Click to read the full article

**That's it!** Your post is live.

---

## MDX vs Markdown

### When to Use Markdown (.md)
- Simple blog posts with text, images, and basic formatting
- Maximum compatibility
- Easier to learn

**Example:**
```md
---
title: "My Simple Post"
date: "2025-01-15"
category: "Guides"
---

# Hello World

This is a simple **Markdown** post with *formatting*.
```

### When to Use MDX (.mdx)
- Need custom React components
- Interactive elements (buttons, forms, etc.)
- Advanced layouts

**Example:**
```mdx
---
title: "My Interactive Post"
date: "2025-01-15"
category: "Guides"
---

import { Button } from "@/components/ui/button"

# Hello World

This is an **MDX** post with a React component:

<Button onClick={() => alert('Clicked!')}>
  Click Me
</Button>
```

---

## Frontmatter Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Post title (60 chars max for SEO) | `"Complete DeFi Guide"` |
| `description` | string | Brief summary (160 chars max for SEO) | `"Learn DeFi trading strategies"` |
| `date` | string | Publish date (YYYY-MM-DD) | `"2025-01-15"` |
| `category` | string | Post category | `"Guides"` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `image` | string | Featured image URL | `"https://..."` or `"/images/hero.jpg"` |
| `readTime` | string | Estimated reading time | `"5 min read"` |
| `author` | string | Author name | `"PH0ENIX_WEB3"` |
| `tags` | array | Post tags | `["web3", "crypto"]` |
| `published` | boolean | Show post (default: true) | `true` or `false` |
| `slug` | string | Custom URL (auto-generated if omitted) | `"my-custom-url"` |

### Complete Example

```yaml
---
title: "The Ultimate Web3 Trading Guide"
description: "Master Web3 trading with proven strategies, risk management, and community insights from PH0ENIX_WEB3"
date: "2025-01-15"
category: "Guides"
image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80"
readTime: "12 min read"
author: "PH0ENIX_WEB3"
tags: ["web3", "trading", "defi", "crypto"]
published: true
slug: "ultimate-web3-trading-guide"
---
```

---

## Writing Content

### Basic Markdown Syntax

#### Headings
```md
# H1 - Main Title
## H2 - Section
### H3 - Subsection
#### H4 - Minor Section
```

#### Text Formatting
```md
**bold text**
*italic text*
~~strikethrough~~
`inline code`
```

#### Lists
```md
Unordered list:
- Item 1
- Item 2
  - Nested item

Ordered list:
1. First
2. Second
3. Third
```

#### Links & Images
```md
[Link text](https://example.com)
![Image alt text](https://image-url.com/image.jpg)
```

#### Blockquotes
```md
> This is a quote or important note
> It can span multiple lines
```

#### Code Blocks
````md
```javascript
const greeting = "Hello, World!";
console.log(greeting);
```
````

#### Horizontal Rule
```md
---
```

#### Tables
```md
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Advanced Features (MDX Only)

#### Import Components
```mdx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

#### Use Components
```mdx
<Button variant="default" size="lg">
  Click Me
</Button>

<Card className="p-6">
  Custom content in a card
</Card>
```

#### Custom Styling
```mdx
<div className="bg-primary/10 p-4 rounded-lg">
  This content has custom styling
</div>
```

---

## Images & Media

### Using External Images (Recommended)
```md
![Alt text](https://images.unsplash.com/photo-id?w=1200&q=80)
```

**Best sources:**
- Unsplash: `https://images.unsplash.com/`
- Pexels: `https://images.pexels.com/`
- Custom URLs

### Using Local Images
1. Add images to `public/images/blog/`
2. Reference them:
```md
![Alt text](/images/blog/my-image.jpg)
```

### Image Best Practices
- **Size**: Use 1200px width for featured images
- **Format**: JPEG for photos, PNG for graphics, WebP for best compression
- **Alt text**: Always include descriptive alt text for SEO and accessibility
- **Optimization**: Use query parameters for resizing (`?w=1200&q=80`)

### Videos (MDX Only)
```mdx
<video controls width="100%">
  <source src="/videos/demo.mp4" type="video/mp4" />
</video>
```

---

## Categories

Available categories (defined in `src/pages/Blog.tsx`):
- **Guides** - How-to articles, tutorials
- **Insights** - Analysis, opinions, thought leadership
- **Announcements** - News, updates, launches

### Adding New Categories

1. Open `src/pages/Blog.tsx`
2. Find the `categories` array:
```typescript
const categories = ["All", "Guides", "Insights", "Announcements"];
```
3. Add your new category:
```typescript
const categories = ["All", "Guides", "Insights", "Announcements", "Your Category"];
```
4. Use the new category in your post frontmatter

---

## Best Practices

### SEO Optimization
✅ **Do:**
- Keep titles under 60 characters
- Write descriptions between 120-160 characters
- Include target keywords naturally
- Use descriptive headings (H2, H3)
- Add alt text to all images
- Use semantic HTML structure

❌ **Don't:**
- Keyword stuff
- Use clickbait titles
- Forget meta descriptions
- Skip heading hierarchy

### Content Quality
- **Clear structure**: Use headings to organize content
- **Scannable**: Use lists, bold text, and short paragraphs
- **Visual**: Include images, code blocks, and spacing
- **Actionable**: Provide clear takeaways and next steps
- **Engaging**: Write in active voice, use examples

### Performance
- **Optimize images**: Use proper dimensions and compression
- **Lazy loading**: Images load automatically as users scroll
- **Code splitting**: Each post loads independently

### Writing Style
```md
✅ Good Example:
## Getting Started with DeFi

DeFi (Decentralized Finance) lets you trade without intermediaries. 
Here's how to start:

1. **Choose a wallet** - MetaMask is beginner-friendly
2. **Get some ETH** - You'll need it for gas fees
3. **Connect to a DEX** - Uniswap is the most popular

❌ Bad Example:
## defi guide

defi is good you should use it here is how...
```

---

## Troubleshooting

### Post Not Showing Up?

**Check:**
1. ✅ File is in `src/content/blog/` directory
2. ✅ File has `.mdx` or `.md` extension
3. ✅ Frontmatter is properly formatted (YAML syntax)
4. ✅ `published: true` in frontmatter (or field omitted)
5. ✅ No syntax errors in frontmatter
6. ✅ Date is valid format (YYYY-MM-DD)

### Build Errors?

**Common issues:**
```md
❌ Wrong: Date without quotes
date: 2025-01-15

✅ Right: Date with quotes
date: "2025-01-15"

❌ Wrong: Frontmatter not closed
---
title: "My Post"

✅ Right: Frontmatter properly closed
---
title: "My Post"
---
```

### Images Not Loading?

**Solutions:**
1. Check URL is valid and accessible
2. Use HTTPS URLs (not HTTP)
3. Verify image exists at path
4. Check for typos in path/URL

### MDX Components Not Working?

**Solutions:**
1. Ensure file has `.mdx` extension (not `.md`)
2. Check component import path is correct
3. Verify component is exported from its file
4. Use proper JSX syntax (self-closing tags, etc.)

---

## Quick Reference Checklist

Creating a new post? Use this checklist:

```md
□ Created file in src/content/blog/
□ Used .mdx or .md extension
□ Added complete frontmatter with all required fields
□ Wrote clear, engaging title (under 60 chars)
□ Wrote compelling description (under 160 chars)
□ Selected appropriate category
□ Added featured image (1200px wide)
□ Structured content with headings
□ Included images with alt text
□ Proofread for typos and clarity
□ Tested post appears on /blog
□ Tested post opens correctly
□ Verified all links work
□ Checked mobile responsiveness
```

---

## Example Templates

### Template 1: Tutorial Post
```mdx
---
title: "How to [Achieve Specific Goal]"
description: "Step-by-step guide to [outcome] with [tool/method]"
date: "2025-01-15"
category: "Guides"
image: "https://images.unsplash.com/photo-id?w=1200&q=80"
readTime: "8 min read"
author: "Your Name"
tags: ["tutorial", "guide"]
published: true
---

# How to [Achieve Goal]

## Introduction
Brief intro explaining what readers will learn and why it matters.

## Prerequisites
- Thing 1 you need
- Thing 2 you need

## Step 1: [First Step]
Detailed explanation with examples.

## Step 2: [Second Step]
More details...

## Conclusion
Summary and next steps.
```

### Template 2: Insight Post
```mdx
---
title: "Understanding [Topic]: What You Need to Know"
description: "Deep dive into [topic] and its impact on [area]"
date: "2025-01-15"
category: "Insights"
image: "https://images.unsplash.com/photo-id?w=1200&q=80"
readTime: "10 min read"
author: "Your Name"
tags: ["analysis", "insights"]
published: true
---

# Understanding [Topic]

## The Current Landscape
Context and background...

## Key Trends
1. Trend 1
2. Trend 2

## What This Means for You
Practical implications...

## Looking Ahead
Future predictions...
```

### Template 3: Announcement
```mdx
---
title: "Announcing [New Feature/Update]"
description: "Exciting news: [brief description of announcement]"
date: "2025-01-15"
category: "Announcements"
image: "https://images.unsplash.com/photo-id?w=1200&q=80"
readTime: "3 min read"
author: "Your Name"
tags: ["news", "updates"]
published: true
---

# Announcing [Feature]

## What's New
Description of the announcement...

## Why It Matters
Benefits and impact...

## How to Get Started
Instructions...

## What's Next
Future plans...
```

---

## Need Help?

- **Documentation**: Review this guide
- **Examples**: Check existing posts in `src/content/blog/`
- **Community**: Reach out to PH0ENIX_WEB3
- **Markdown Guide**: [markdownguide.org](https://www.markdownguide.org/)
- **MDX Documentation**: [mdxjs.com](https://mdxjs.com/)

---

**Happy blogging! 🚀**
