# 🔄 GitHub Workflow for Blog Posts

This guide explains how to add and edit blog posts directly from GitHub after connecting your Lovable project to GitHub.

---

## 📋 Prerequisites

1. **Connect your Lovable project to GitHub**
   - Click the GitHub button in Lovable
   - Authorize and create repository
   - All changes will sync automatically between Lovable and GitHub

2. **Understanding the Blog System**
   - Blog posts are stored in `src/content/blog/`
   - Supports both `.md` (Markdown) and `.mdx` (Markdown + React components)
   - All posts must be registered in `src/data/blogPosts.ts`

---

## ✏️ Adding a New Blog Post via GitHub

### Step 1: Create the Blog Post File

1. Navigate to your GitHub repository
2. Go to `src/content/blog/`
3. Click "Add file" → "Create new file"
4. Name your file: `my-awesome-post.md` (or `.mdx`)

### Step 2: Add Frontmatter and Content

Paste this template and customize:

```md
---
title: "Your Amazing Blog Post Title"
description: "A compelling description for SEO and previews (max 160 chars)"
date: "2025-01-20"
category: "Guides"
image: "https://images.unsplash.com/photo-example?w=1200&q=80"
readTime: "7 min read"
author: "PH0ENIX_WEB3"
tags: ["web3", "crypto", "trading"]
published: true
slug: "my-awesome-post"
---

# Your Amazing Blog Post Title

Your content goes here...

## Section 1

Content for section 1...

## Section 2

Content for section 2...
```

### Step 3: Register the Post

1. Open `src/data/blogPosts.ts` in GitHub
2. Click the edit (pencil) icon
3. Add your post import at the top:

```typescript
import myAwesomePostRaw from '../content/blog/my-awesome-post.md?raw';
```

4. Add your post to the `rawPosts` object:

```typescript
const rawPosts: Record<string, string> = {
  'bitget-community-guide': bitgetGuideRaw,
  'example-guide': exampleGuideRaw,
  'my-awesome-post': myAwesomePostRaw,  // ← Add this line
};
```

5. Commit the changes

### Step 4: Verify

- Changes will automatically sync to Lovable
- Visit your Lovable preview at `/blog` to see the new post
- The post will appear in the blog list and be accessible at `/blog/my-awesome-post`

---

## 🎨 Using MDX (Advanced)

MDX files (`.mdx`) allow you to use React components inside your blog posts.

### Example MDX Post:

```mdx
---
title: "Interactive Trading Guide"
date: "2025-01-20"
category: "Guides"
published: true
---

import { Button } from "@/components/ui/button"

# Interactive Trading Guide

This is a regular paragraph with Markdown.

## Try This Interactive Button

Click the button below to see MDX in action:

<Button onClick={() => alert('Hello from MDX!')}>
  Click Me!
</Button>

You can mix **Markdown** formatting with React components seamlessly.
```

---

## ✅ Editing Existing Posts via GitHub

1. Navigate to `src/content/blog/` in your GitHub repo
2. Click on the post you want to edit
3. Click the edit (pencil) icon
4. Make your changes
5. Scroll down and commit changes
6. Changes will automatically sync to Lovable

**Pro Tip**: Use GitHub's preview tab to see your Markdown formatting before committing.

---

## 🏷️ Frontmatter Fields Reference

### Required Fields:
- `title`: Post title (60 chars max for SEO)
- `description`: Brief summary (160 chars max for SEO)
- `date`: Publish date in YYYY-MM-DD format
- `category`: Must be one of: "Guides", "Insights", "Announcements"

### Optional Fields:
- `slug`: Custom URL slug (defaults to filename)
- `image`: Featured image URL (1200px width recommended)
- `readTime`: Reading time estimate (e.g., "5 min read")
- `author`: Author name (defaults to "PH0ENIX_WEB3")
- `tags`: Array of tags (e.g., `["web3", "defi"]`) - **Used for related posts!**
- `published`: Set to `false` to hide post (defaults to `true`)

---

## 🔗 Related Posts Feature

Related posts are automatically generated based on:
1. **Same category**: Posts in the same category score higher
2. **Shared tags**: Posts with matching tags are prioritized
3. **Relevance ranking**: Shows top 3 most relevant posts

**To maximize related posts effectiveness:**
- Use consistent, descriptive tags across posts
- Keep tags specific (e.g., "defi-trading" not just "trading")
- Use 3-5 tags per post for best results

---

## 🖼️ Adding Images

### Option 1: External Images (Recommended)
Use image hosting services:

```md
![Description](https://images.unsplash.com/photo-id?w=1200&q=80)
```

**Recommended sources:**
- [Unsplash](https://unsplash.com) - Free high-quality photos
- [Pexels](https://pexels.com) - Free stock photos

### Option 2: GitHub Repository
1. Add images to `public/images/blog/` in GitHub
2. Reference in your post:

```md
![Description](/images/blog/my-image.jpg)
```

---

## 📝 Markdown Syntax Quick Reference

```md
# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*
~~strikethrough~~

- Bullet list
- Item 2
  - Nested item

1. Numbered list
2. Item 2

[Link text](https://example.com)

![Image alt text](https://image-url.com/image.jpg)

> Blockquote or important note

---

`inline code`

```javascript
// Code block
const example = "code";
```

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

---

## 🔄 Typical GitHub Workflow

### Creating a New Post:
```
1. Create new .md file in src/content/blog/
2. Write content with frontmatter
3. Commit the new file
4. Edit src/data/blogPosts.ts
5. Add import and register post
6. Commit changes
7. Check Lovable preview (auto-syncs)
```

### Editing an Existing Post:
```
1. Navigate to src/content/blog/[your-post].md
2. Click edit (pencil icon)
3. Make changes
4. Commit changes
5. Check Lovable preview (auto-syncs)
```

---

## 🚨 Troubleshooting

### Post not showing on blog?

**Checklist:**
- ✅ File is in `src/content/blog/`
- ✅ File has `.md` or `.mdx` extension
- ✅ Frontmatter is properly formatted (between `---` markers)
- ✅ Post is imported in `src/data/blogPosts.ts`
- ✅ Post is added to `rawPosts` object
- ✅ `published: true` (or field omitted)
- ✅ Date is valid YYYY-MM-DD format
- ✅ Category matches one of: "Guides", "Insights", "Announcements"

### Images not loading?
- Verify the URL is accessible and uses HTTPS
- Check for typos in the image path
- For external images, ensure the service allows hotlinking

### Formatting looks wrong?
- Check that code blocks use three backticks (\`\`\`)
- Ensure there's a blank line before and after lists
- Verify frontmatter YAML syntax is correct
- Use GitHub's preview tab to check before committing

---

## 🎯 Best Practices

### SEO Optimization:
- ✅ Keep titles under 60 characters
- ✅ Write descriptions 120-160 characters
- ✅ Use descriptive H2 and H3 headings
- ✅ Include alt text for all images
- ✅ Use keywords naturally in content

### Content Quality:
- ✅ Start with a clear introduction
- ✅ Use headings to organize content
- ✅ Break up long paragraphs
- ✅ Add images or code examples
- ✅ End with actionable conclusions

### Tag Strategy:
- ✅ Use 3-5 tags per post
- ✅ Keep tags consistent across related posts
- ✅ Use specific tags (e.g., "defi-trading" vs "trading")
- ✅ Consider tag reusability for related posts feature

---

## 🔐 GitHub Collaboration

### Multiple Authors:
1. Invite collaborators to your GitHub repo
2. They can create branches for new posts
3. Submit pull requests for review
4. Merge approved posts to main branch
5. Changes auto-sync to Lovable

### Review Workflow:
```
Author Branch → Pull Request → Review → Merge → Live on Blog
```

---

## 📱 Mobile Editing

You can edit blog posts from GitHub mobile:
1. Open GitHub app or mobile browser
2. Navigate to your repository
3. Find the post in `src/content/blog/`
4. Tap the edit icon
5. Make changes and commit

Changes sync automatically to Lovable!

---

## 🎉 Summary

**The GitHub workflow is simple:**

1. **Create/Edit** `.md` or `.mdx` files in `src/content/blog/`
2. **Register** new posts in `src/data/blogPosts.ts`
3. **Commit** changes to GitHub
4. **Preview** automatically updates in Lovable

Your blog is now fully manageable from GitHub! 🚀

---

**Need help?** Check the main [BLOG_GUIDE_UPDATED.md](./BLOG_GUIDE_UPDATED.md) for more details.
