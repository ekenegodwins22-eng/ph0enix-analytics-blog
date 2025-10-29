# 📝 Blog Guide - How to Add Posts (UPDATED)

## Quick Start - Adding a New Blog Post

### Step 1: Create Your Content File

1. Navigate to `src/content/blog/`
2. Create a new file: `your-post-name.md` (or `.mdx` for React components)
3. Add frontmatter and content:

```md
---
title: "Your Post Title"
description: "Brief description for SEO and previews"
date: "2025-01-20"
category: "Guides"
image: "https://images.unsplash.com/photo-example?w=1200&q=80"
readTime: "5 min read"
author: "PH0ENIX_WEB3"
tags: ["web3", "crypto"]
published: true
slug: "your-custom-slug"
---

# Your Content Here

Write your blog post content using Markdown...
```

### Step 2: Register the Post

Open `src/data/blogPosts.ts` and add your post:

1. **Import the post** (add at the top with other imports):
```typescript
import yourPostRaw from '../content/blog/your-post-name.md?raw';
```

2. **Add to the rawPosts object** (around line 18):
```typescript
const rawPosts: Record<string, string> = {
  'bitget-community-guide': bitgetGuideRaw,
  'example-guide': exampleGuideRaw,
  'your-custom-slug': yourPostRaw,  // <- Add this line
};
```

### Step 3: Save and Test

1. Save both files
2. Visit `/blog` to see your post in the list
3. Click to read the full post

**That's it! Your post is now live.**

---

## Detailed Guide

### Frontmatter Fields

#### Required:
- `title`: Post title (60 chars max for SEO)
- `description`: Brief summary (160 chars max)
- `date`: Publish date (YYYY-MM-DD format)
- `category`: One of: "Guides", "Insights", "Announcements"

#### Optional:
- `slug`: Custom URL (defaults to filename)
- `image`: Featured image URL
- `readTime`: Estimated time (e.g., "5 min read")
- `author`: Author name (defaults to "PH0ENIX_WEB3")
- `tags`: Array of tags (e.g., `["web3", "crypto"]`)
- `published`: Set to `false` to hide (defaults to `true`)

### Writing Content

Use standard Markdown syntax:

```md
# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*

- Bullet list
- Item 2

1. Numbered list
2. Item 2

[Link text](https://example.com)
![Image alt](https://image-url.com/image.jpg)

> Blockquote or important note

---

Horizontal rule above
```

#### Code Blocks:
````md
```javascript
const example = "code block";
console.log(example);
```
````

#### Tables:
```md
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### Using MDX (Advanced)

For interactive content, use `.mdx` extension:

```mdx
---
title: "Interactive Post"
date: "2025-01-20"
category: "Guides"
---

import { Button } from "@/components/ui/button"

# Interactive Content

Click this button:

<Button onClick={() => alert('Hello!')}>
  Click Me
</Button>
```

### Images

**External Images (Recommended):**
```md
![Description](https://images.unsplash.com/photo-id?w=1200&q=80)
```

**Local Images:**
1. Add to `public/images/blog/`
2. Reference: `![Description](/images/blog/image.jpg)`

**Best practices:**
- Use 1200px width for featured images
- Always include descriptive alt text
- Use Unsplash or Pexels for free stock photos

### Categories

Current categories:
- **Guides**: Tutorials, how-tos
- **Insights**: Analysis, opinions
- **Announcements**: News, updates

**To add a new category:**
1. Open `src/pages/Blog.tsx`
2. Find: `const categories = ["All", "Guides", "Insights", "Announcements"];`
3. Add your category: `const categories = ["All", "Guides", "Insights", "Announcements", "Your Category"];`

---

## Complete Example

### File: `src/content/blog/defi-guide.md`

```md
---
title: "DeFi Trading for Beginners"
description: "Learn the basics of decentralized finance trading with this comprehensive guide"
date: "2025-01-20"
category: "Guides"
image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80"
readTime: "7 min read"
author: "PH0ENIX_WEB3"
tags: ["defi", "trading", "beginner"]
published: true
slug: "defi-trading-beginners"
---

# DeFi Trading for Beginners

## Introduction

DeFi (Decentralized Finance) is revolutionizing how we think about money...

## What is DeFi?

DeFi refers to financial services built on blockchain technology...

### Key Benefits

- **No intermediaries**: Trade directly peer-to-peer
- **24/7 access**: Markets never close
- **Transparency**: All transactions are public

## Getting Started

1. Set up a wallet
2. Get some crypto
3. Connect to a DEX

...rest of your content...
```

### File: `src/data/blogPosts.ts` (add these lines)

```typescript
// At the top with imports:
import defiGuideRaw from '../content/blog/defi-guide.md?raw';

// In the rawPosts object:
const rawPosts: Record<string, string> = {
  'bitget-community-guide': bitgetGuideRaw,
  'example-guide': exampleGuideRaw,
  'defi-trading-beginners': defiGuideRaw,  // <- Add this
};
```

---

## Troubleshooting

### Post Not Showing?

**Checklist:**
- ✅ File exists in `src/content/blog/`
- ✅ File has `.md` or `.mdx` extension
- ✅ Frontmatter is properly formatted (YAML)
- ✅ Post is imported in `src/data/blogPosts.ts`
- ✅ Post is added to `rawPosts` object
- ✅ `published: true` (or field omitted)
- ✅ Valid date format (YYYY-MM-DD)

### Common Errors

**Error: "Cannot find module"**
- Check import path is correct
- Ensure file name matches import
- Include `?raw` at end of import

**Error: "Unexpected token"**
- Check YAML frontmatter syntax
- Ensure frontmatter is between `---` markers
- Quote string values with special characters

**Images not loading:**
- Verify URL is accessible
- Use HTTPS (not HTTP)
- Check for typos in path

---

## SEO Best Practices

✅ **Do:**
- Keep titles under 60 characters
- Write descriptions 120-160 characters
- Use descriptive headings (H2, H3)
- Include alt text on all images
- Use target keywords naturally

❌ **Don't:**
- Keyword stuff
- Use clickbait titles
- Skip meta descriptions
- Forget heading hierarchy

---

## Quick Reference

### Creating a Post Checklist

```
□ Created .md/.mdx file in src/content/blog/
□ Added frontmatter with required fields
□ Wrote clear title (under 60 chars)
□ Wrote description (under 160 chars)
□ Selected appropriate category
□ Added featured image (1200px wide)
□ Imported in src/data/blogPosts.ts
□ Added to rawPosts object
□ Tested post appears on /blog
□ Tested post opens correctly
□ Verified images load
□ Checked mobile responsiveness
```

---

## Need Help?

- **Review existing posts**: Check `src/content/blog/` for examples
- **Markdown reference**: [markdownguide.org](https://www.markdownguide.org/)
- **MDX docs**: [mdxjs.com](https://mdxjs.com/)

---

**Happy blogging! 🚀**
