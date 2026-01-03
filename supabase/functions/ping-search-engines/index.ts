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

// Create JWT for Google Service Account authentication
async function createGoogleJWT(): Promise<string> {
  const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
  if (!serviceAccountKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
  }

  // Handle potential escaped JSON string (double-encoded)
  let credentials;
  try {
    credentials = JSON.parse(serviceAccountKey);
    // If the result is still a string, it was double-encoded
    if (typeof credentials === 'string') {
      credentials = JSON.parse(credentials);
    }
  } catch (e) {
    console.error('Failed to parse service account key:', e);
    throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format. Ensure it is valid JSON.');
  }
  
  console.log('Service account email:', credentials.client_email);
  const now = Math.floor(Date.now() / 1000);
  
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };
  
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600 // 1 hour
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signatureInput = `${headerB64}.${payloadB64}`;

  // Import the private key and sign
  const pemContents = credentials.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signatureInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${signatureInput}.${signatureB64}`;
}

async function getGoogleAccessToken(): Promise<string> {
  const jwt = await createGoogleJWT();
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Google OAuth error:', error);
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function pingGoogleIndexingAPI(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<PingResult> {
  try {
    const accessToken = await getGoogleAccessToken();
    
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        type: type
      })
    });

    const responseText = await response.text();
    console.log(`Google Indexing API response for ${url}: ${response.status} - ${responseText}`);

    return {
      engine: 'Google Indexing API',
      success: response.status === 200,
      status: response.status,
      message: response.status === 200 ? 'URL submitted for instant indexing' : responseText
    };
  } catch (error) {
    console.error('Google Indexing API error:', error);
    return {
      engine: 'Google Indexing API',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function pingGoogleSitemap(): Promise<PingResult> {
  try {
    // Legacy sitemap ping (still works as backup)
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const response = await fetch(pingUrl, { method: 'GET' });
    
    console.log(`Google sitemap ping response: ${response.status}`);
    
    return {
      engine: 'Google Sitemap Ping',
      success: response.status === 200 || response.status === 204,
      status: response.status,
      message: 'Sitemap ping sent'
    };
  } catch (error) {
    console.error('Google sitemap ping error:', error);
    return {
      engine: 'Google Sitemap Ping',
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
      
      // Ping all search engines in parallel - use Google Indexing API for instant indexing
      const [googleIndexingResult, googleSitemapResult, indexNowResult] = await Promise.all([
        pingGoogleIndexingAPI(postUrl),
        pingGoogleSitemap(),
        pingBingIndexNow([postUrl])
      ]);
      
      results.push(googleIndexingResult, googleSitemapResult, indexNowResult);
      
    } else if (action === 'sitemap_update' || action === 'weekly_ping') {
      // Ping sitemap updates with all URLs
      console.log('Pinging search engines for sitemap update');
      
      const allUrls = await getAllBlogUrls();
      console.log(`Submitting ${allUrls.length} URLs to search engines`);
      
      // For bulk updates, ping Google Indexing API for each blog URL (limit to 200/day)
      const blogUrls = allUrls.filter(url => url.includes('/blog/'));
      const googleIndexingPromises = blogUrls.slice(0, 50).map(url => pingGoogleIndexingAPI(url));
      
      const [googleSitemapResult, indexNowResult, ...googleIndexingResults] = await Promise.all([
        pingGoogleSitemap(),
        pingBingIndexNow(allUrls),
        ...googleIndexingPromises
      ]);
      
      // Summarize Google Indexing API results
      const successCount = googleIndexingResults.filter(r => r.success).length;
      const googleIndexingSummary: PingResult = {
        engine: 'Google Indexing API',
        success: successCount > 0,
        message: `${successCount}/${googleIndexingResults.length} URLs submitted for instant indexing`
      };
      
      results.push(googleIndexingSummary, googleSitemapResult, indexNowResult);
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
