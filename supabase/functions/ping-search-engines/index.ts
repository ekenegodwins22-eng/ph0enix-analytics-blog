import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = 'https://www.senseiphoenix.name.ng';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

interface PingResult {
  engine: string;
  success: boolean;
  status?: number;
  message?: string;
}

async function pingGoogle(url: string): Promise<PingResult> {
  try {
    // Google Ping API for sitemap updates
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const response = await fetch(pingUrl, { method: 'GET' });
    
    console.log(`Google ping response: ${response.status}`);
    
    return {
      engine: 'Google',
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Sitemap ping successful' : 'Ping failed'
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

async function pingBing(url: string): Promise<PingResult> {
  try {
    // Bing URL Submission API (IndexNow compatible)
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const response = await fetch(pingUrl, { method: 'GET' });
    
    console.log(`Bing ping response: ${response.status}`);
    
    return {
      engine: 'Bing',
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Sitemap ping successful' : 'Ping failed'
    };
  } catch (error) {
    console.error('Bing ping error:', error);
    return {
      engine: 'Bing',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function pingIndexNow(url: string): Promise<PingResult> {
  try {
    // IndexNow API - works with Bing, Yandex, and others
    // Using Bing's IndexNow endpoint
    const indexNowUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=senseiphoenix`;
    const response = await fetch(indexNowUrl, { method: 'GET' });
    
    console.log(`IndexNow ping response: ${response.status}`);
    
    return {
      engine: 'IndexNow',
      success: response.status === 200 || response.status === 202,
      status: response.status,
      message: response.status === 200 || response.status === 202 ? 'URL submitted successfully' : 'Submission pending or failed'
    };
  } catch (error) {
    console.error('IndexNow ping error:', error);
    return {
      engine: 'IndexNow',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, action } = await req.json();
    
    console.log(`Ping request received - action: ${action}, slug: ${slug}`);

    const results: PingResult[] = [];
    
    if (action === 'new_post' && slug) {
      // Ping for a specific new blog post URL
      const postUrl = `${SITE_URL}/blog/${slug}`;
      
      console.log(`Pinging search engines for new post: ${postUrl}`);
      
      // Ping all search engines in parallel
      const [googleResult, bingResult, indexNowResult] = await Promise.all([
        pingGoogle(postUrl),
        pingBing(postUrl),
        pingIndexNow(postUrl)
      ]);
      
      results.push(googleResult, bingResult, indexNowResult);
      
    } else if (action === 'sitemap_update') {
      // Just ping sitemap updates
      console.log('Pinging search engines for sitemap update');
      
      const [googleResult, bingResult] = await Promise.all([
        pingGoogle(SITEMAP_URL),
        pingBing(SITEMAP_URL)
      ]);
      
      results.push(googleResult, bingResult);
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "new_post" with slug or "sitemap_update"' }),
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
        status: allSuccessful ? 200 : 207,
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
