import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://www.senseiphoenix.name.ng'
const PROFILE_IMG = 'https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png'

interface BlogPost {
  slug: string
  title: string
  description: string
  image: string | null
  category: string
  tags: string[] | null
  created_at: string
  updated_at: string
  content: string
  read_time: string | null
  author: string | null
}

// Convert markdown to plain text for crawlers
function markdownToText(markdown: string): string {
  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Generate HTML with proper meta tags AND full content for crawlers
function generateHTML(meta: {
  title: string
  description: string
  image: string
  url: string
  type: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  content?: string
  readTime?: string
}) {
  const tagsHtml = meta.tags?.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n    ') || ''
  const contentHtml = meta.content ? `<article>${meta.content.split('\n').map(p => p.trim() ? `<p>${escapeHtml(p)}</p>` : '').join('\n      ')}</article>` : ''
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="${PROFILE_IMG}" type="image/png" />
  
  <!-- Primary Meta Tags -->
  <title>${escapeHtml(meta.title)}</title>
  <meta name="title" content="${escapeHtml(meta.title)}" />
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <meta name="author" content="${escapeHtml(meta.author || 'PHOENIX THE WEB3 SENSEI')}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${meta.url}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${meta.type}" />
  <meta property="og:url" content="${meta.url}" />
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="PHOENIX THE WEB3 SENSEI" />
  ${meta.publishedTime ? `<meta property="article:published_time" content="${meta.publishedTime}" />` : ''}
  ${meta.modifiedTime ? `<meta property="article:modified_time" content="${meta.modifiedTime}" />` : ''}
  ${meta.author ? `<meta property="article:author" content="${escapeHtml(meta.author)}" />` : ''}
  ${meta.section ? `<meta property="article:section" content="${escapeHtml(meta.section)}" />` : ''}
  ${tagsHtml}
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${meta.url}" />
  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
  <meta name="twitter:image" content="${meta.image}" />
  <meta name="twitter:site" content="@sensei_phoenixz" />
  <meta name="twitter:creator" content="@sensei_phoenixz" />
</head>
<body>
  <header>
    <h1>${escapeHtml(meta.title)}</h1>
    <p><strong>By:</strong> ${escapeHtml(meta.author || 'PHOENIX THE WEB3 SENSEI')}</p>
    ${meta.readTime ? `<p><strong>Read time:</strong> ${escapeHtml(meta.readTime)}</p>` : ''}
    ${meta.section ? `<p><strong>Category:</strong> ${escapeHtml(meta.section)}</p>` : ''}
    ${meta.tags?.length ? `<p><strong>Tags:</strong> ${meta.tags.map(t => escapeHtml(t)).join(', ')}</p>` : ''}
  </header>
  <main>
    <p>${escapeHtml(meta.description)}</p>
    <img src="${meta.image}" alt="${escapeHtml(meta.title)}" />
    ${contentHtml}
    <p><a href="${meta.url}">Read full article at ${meta.url}</a></p>
  </main>
  <footer>
    <p>© PHOENIX THE WEB3 SENSEI - Web3 Community Builder & Crypto Trading Expert</p>
    <p>Website: <a href="${SITE_URL}">${SITE_URL}</a></p>
  </footer>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Static page metadata
const staticPages: Record<string, { title: string; description: string; image?: string }> = {
  '/': {
    title: 'PHOENIX THE WEB3 SENSEI | Web3 Community Builder & Crypto Trading Expert',
    description: 'Professional Web3 community builder, crypto trading expert, and Bitget partner. Get trading insights, DeFi strategies, and join our growing community.',
  },
  '/about': {
    title: 'About PHOENIX THE WEB3 SENSEI | Web3 Ambassador & Crypto Expert',
    description: 'Meet PHOENIX THE WEB3 SENSEI - Professional Web3 community builder, crypto trading expert, and official Bitget partner helping traders succeed.',
  },
  '/blog': {
    title: 'Web3 & Crypto Blog | PHOENIX THE WEB3 SENSEI',
    description: 'Expert insights on Web3, DeFi, cryptocurrency trading, and blockchain technology. Educational content for crypto enthusiasts.',
  },
  '/resume': {
    title: 'Resume | PHOENIX THE WEB3 SENSEI - Web3 Professional',
    description: 'Professional experience and skills of PHOENIX THE WEB3 SENSEI in Web3 community building, crypto trading, and blockchain expertise.',
  },
  '/bitget': {
    title: 'Join Bitget | PHOENIX THE WEB3 SENSEI Partnership',
    description: 'Join Bitget through PHOENIX THE WEB3 SENSEI partnership link and get exclusive benefits for crypto trading.',
  },
  '/privacy': {
    title: 'Privacy Policy | PHOENIX THE WEB3 SENSEI',
    description: 'Privacy policy for PHOENIX THE WEB3 SENSEI website. Learn how we handle your data.',
  },
  '/terms': {
    title: 'Terms of Service | PHOENIX THE WEB3 SENSEI',
    description: 'Terms of service for using PHOENIX THE WEB3 SENSEI website and content.',
  },
  '/disclaimer': {
    title: 'Disclaimer | PHOENIX THE WEB3 SENSEI',
    description: 'Important disclaimer about PHOENIX THE WEB3 SENSEI - an independent Web3 strategist not affiliated with other entities.',
  },
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.searchParams.get('path') || '/'
    
    console.log(`OG Render request for path: ${path}`)
    
    // Check if it's a blog post
    if (path.startsWith('/blog/') && path !== '/blog') {
      const slug = path.replace('/blog/', '')
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()
      
      if (error || !post) {
        console.log(`Blog post not found: ${slug}`)
        return new Response('Not found', { status: 404, headers: corsHeaders })
      }
      
      const blogPost = post as BlogPost
      const fullUrl = `${SITE_URL}/blog/${blogPost.slug}`
      
      // Convert markdown content to plain text for AI crawlers
      const plainTextContent = markdownToText(blogPost.content || '')
      
      const html = generateHTML({
        title: `${blogPost.title} | PHOENIX THE WEB3 SENSEI Blog`,
        description: blogPost.description,
        image: blogPost.image || PROFILE_IMG,
        url: fullUrl,
        type: 'article',
        publishedTime: new Date(blogPost.created_at).toISOString(),
        modifiedTime: new Date(blogPost.updated_at).toISOString(),
        author: blogPost.author || 'PHOENIX THE WEB3 SENSEI',
        section: blogPost.category,
        tags: blogPost.tags || [],
        content: plainTextContent,
        readTime: blogPost.read_time || undefined,
      })
      
      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }
    
    // Check static pages
    const staticPage = staticPages[path]
    if (staticPage) {
      const html = generateHTML({
        title: staticPage.title,
        description: staticPage.description,
        image: staticPage.image || PROFILE_IMG,
        url: `${SITE_URL}${path === '/' ? '' : path}`,
        type: 'website',
      })
      
      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }
    
    // Default fallback
    return new Response('Not found', { status: 404, headers: corsHeaders })
    
  } catch (err) {
    const error = err as Error
    console.error('OG Render error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
