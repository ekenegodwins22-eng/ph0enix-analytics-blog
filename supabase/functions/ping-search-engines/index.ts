import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = 'https://www.senseiphoenix.name.ng';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_KEY = 'senseiphoenix';

interface PingResult {
  engine: string;
  success: boolean;
  status?: number;
  message?: string;
}

async function pingGoogle(): Promise<PingResult> {
  try {
    // Google Indexing API ping (sitemap submission)
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const response = await fetch(pingUrl, { method: 'GET' });
    
    console.log(`Google ping response: ${response.status}`);
    
    // Google returns 200 even if sitemap isn't immediately processed
    return {
      engine: 'Google',
      success: response.status === 200 || response.status === 204,
      status: response.status,
      message: 'Sitemap ping sent'
    };
  } catch (error) {
    console.error('Google ping error:', error);
    return {
      engine: 'Google',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function pingBingIndexNow(urls: string[]): Promise<PingResult> {
  try {
    // IndexNow API for Bing, Yandex, and other participating search engines
    const body = {
      host: 'www.senseiphoenix.name.ng',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls
    };
    
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    });
    
    console.log(`IndexNow ping response: ${response.status}`);
    
    // IndexNow returns 200 (OK), 202 (Accepted), or 200 with no body
    return {
      engine: 'IndexNow (Bing/Yandex)',
      success: response.status === 200 || response.status === 202,
      status: response.status,
      message: response.status === 200 || response.status === 202 ? 'URLs submitted successfully' : 'Submission pending'
    };
  } catch (error) {
    console.error('IndexNow ping error:', error);
    return {
      engine: 'IndexNow (Bing/Yandex)',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function getAllBlogUrls(): Promise<string[]> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true);
  
  const urls = [
    SITE_URL,
    `${SITE_URL}/blog`,
    `${SITE_URL}/about`,
    `${SITE_URL}/bitget`
  ];
  
  if (posts) {
    posts.forEach(post => {
      urls.push(`${SITE_URL}/blog/${post.slug}`);
    });
  }
  
  return urls;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, action } = await req.json().catch(() => ({ action: 'sitemap_update' }));
    
    console.log(`Ping request received - action: ${action}, slug: ${slug || 'N/A'}`);

    const results: PingResult[] = [];
    
    if (action === 'new_post' && slug) {
      // Ping for a specific new blog post URL
      const postUrl = `${SITE_URL}/blog/${slug}`;
      
      console.log(`Pinging search engines for new post: ${postUrl}`);
      
      // Ping all search engines in parallel
      const [googleResult, indexNowResult] = await Promise.all([
        pingGoogle(),
        pingBingIndexNow([postUrl])
      ]);
      
      results.push(googleResult, indexNowResult);
      
    } else if (action === 'sitemap_update' || action === 'weekly_ping') {
      // Ping sitemap updates with all URLs
      console.log('Pinging search engines for sitemap update');
      
      const allUrls = await getAllBlogUrls();
      console.log(`Submitting ${allUrls.length} URLs to search engines`);
      
      const [googleResult, indexNowResult] = await Promise.all([
        pingGoogle(),
        pingBingIndexNow(allUrls)
      ]);
      
      results.push(googleResult, indexNowResult);
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "new_post" with slug, "sitemap_update", or "weekly_ping"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allSuccessful = results.every(r => r.success);
    
    console.log('Ping results:', JSON.stringify(results));

    return new Response(
      JSON.stringify({
        success: allSuccessful,
        results,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Ping search engines error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
