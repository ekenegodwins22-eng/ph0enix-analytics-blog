import matter from 'gray-matter';

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

// Import all blog posts from the content/blog directory
const blogModules = import.meta.glob('/src/content/blog/*.{md,mdx}', { 
  eager: true,
  query: '?raw',
  import: 'default'
});

export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, content] of Object.entries(blogModules)) {
    try {
      // Extract slug from filename
      const filename = path.split('/').pop() || '';
      const slug = filename.replace(/\.(md|mdx)$/, '');

      // Parse frontmatter
      const { data, content: postContent } = matter(content as string);

      // Skip unpublished posts
      if (data.published === false) continue;

      // Create blog post object
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
        content: postContent,
      };

      posts.push(post);
    } catch (error) {
      console.error(`Error parsing blog post: ${path}`, error);
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
