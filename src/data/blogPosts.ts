import matter from 'gray-matter';

// Import blog posts as raw strings
import bitgetGuideRaw from '../content/blog/bitget-guide.md?raw';
import exampleGuideRaw from '../content/blog/example-guide.mdx?raw';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  readTime?: string;
  author?: string;
  tags?: string[];
  published?: boolean;
  content?: string;
}

// Parse all blog posts
const rawPosts: Record<string, string> = {
  'bitget-community-guide': bitgetGuideRaw,
  'example-guide': exampleGuideRaw,
};

export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [slug, rawContent] of Object.entries(rawPosts)) {
    try {
      const { data, content } = matter(rawContent);

      // Skip unpublished posts
      if (data.published === false) continue;

      const post: BlogPost = {
        slug: data.slug || slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'Uncategorized',
        image: data.image,
        readTime: data.readTime || '5 min read',
        author: data.author || 'PH0ENIX_WEB3',
        tags: data.tags || [],
        published: data.published !== false,
        content: content,
      };

      posts.push(post);
    } catch (error) {
      console.error(`Error parsing blog post: ${slug}`, error);
    }
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  const posts = getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  const posts = getAllBlogPosts();
  if (category === 'All') return posts;
  return posts.filter(post => post.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.filter(post => post.tags?.includes(tag));
}
