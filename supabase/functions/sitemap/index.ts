import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://www.senseiphoenix.name.ng'

interface BlogPost {
  slug: string
  updated_at: string
  image: string | null
  title: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, image, title')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    const today = new Date().toISOString().split('T')[0]

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Main Pages -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png</image:loc>
      <image:title>PHOENIX THE WEB3 SENSEI Profile</image:title>
    </image:image>
  </url>
  
  <url>
    <loc>${SITE_URL}/resume</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/bitget</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE_URL}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>${SITE_URL}/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>${SITE_URL}/disclaimer</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Blog Posts (Auto-generated from database) -->
`

    // Add each blog post
    for (const post of posts as BlogPost[]) {
      const lastmod = new Date(post.updated_at).toISOString().split('T')[0]
      sitemap += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
`
      if (post.image) {
        sitemap += `    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
    </image:image>
`
      }
      sitemap += `  </url>
`
    }

    sitemap += `</urlset>`

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (err) {
    const error = err as Error
    console.error('Sitemap generation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
