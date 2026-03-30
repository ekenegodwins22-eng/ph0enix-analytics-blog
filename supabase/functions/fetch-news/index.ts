import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RSS_FEEDS = [
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { name: 'Decrypt', url: 'https://decrypt.co/feed' },
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { telegram_user_id, chat_id } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const SERPAPI_KEY = Deno.env.get('SERPAPI_API_KEY');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user settings
    const { data: settings } = await supabase
      .from('bot_settings')
      .select('writing_style, default_category')
      .eq('telegram_user_id', telegram_user_id)
      .single();

    const writingStyle = settings?.writing_style || 'Professional crypto/Web3 writer';
    const defaultCategory = settings?.default_category || 'News';

    // Step 1: Fetch RSS feeds
    const articles: any[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: { 'User-Agent': 'SenseiPhoenix Blog Bot/1.0' },
        });
        const xml = await res.text();
        
        // Simple XML parsing for RSS items
        const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
        
        for (const item of items.slice(0, 3)) {
          const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] 
            || item.match(/<title>(.*?)<\/title>/)?.[1] || '';
          const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
          const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
            || item.match(/<description>(.*?)<\/description>/)?.[1] || '';
          const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

          // Only include articles from last 48 hours
          if (pubDate) {
            const articleDate = new Date(pubDate);
            const hoursDiff = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60);
            if (hoursDiff > 48) continue;
          }

          // Check if we already have a draft with this source URL
          if (link) {
            const { data: existing } = await supabase
              .from('draft_posts')
              .select('id')
              .eq('source_url', link)
              .limit(1);
            
            if (existing && existing.length > 0) continue;
          }

          articles.push({
            title: title.replace(/<[^>]*>/g, '').trim(),
            link,
            description: description.replace(/<[^>]*>/g, '').substring(0, 500),
            source: feed.name,
          });
        }
      } catch (e) {
        console.error(`RSS fetch error for ${feed.name}:`, e);
      }
    }

    // Step 2: Optionally enrich with SerpAPI trending
    let trendingContext = '';
    if (SERPAPI_KEY) {
      try {
        const searchUrl = `https://serpapi.com/search.json?q=cryptocurrency+news+today&api_key=${SERPAPI_KEY}&num=3&engine=google&tbm=nws`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        if (searchData.news_results) {
          trendingContext = searchData.news_results
            .slice(0, 3)
            .map((r: any) => `- ${r.title}: ${r.snippet || ''}`)
            .join('\n');
        }
      } catch (e) {
        console.error('SerpAPI trending error:', e);
      }
    }

    if (articles.length === 0) {
      return new Response(JSON.stringify({ drafts_created: 0, message: 'No new articles found in RSS feeds.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 3: Generate AI summaries for each article (batch max 5)
    let draftsCreated = 0;

    for (const article of articles.slice(0, 5)) {
      try {
        const systemPrompt = `You are ${writingStyle}. 
Transform the following news article into a unique, SEO-optimized blog post. 
Do NOT copy the original — rewrite with your own analysis, insights, and expanded context.
${trendingContext ? `\nTrending context:\n${trendingContext}` : ''}

Return ONLY valid JSON:
{
  "title": "Unique SEO title (60 chars max)",
  "description": "Meta description (155 chars max)",
  "content": "Full markdown blog post, at least 600 words. Include ## headers, analysis, and your perspective.",
  "category": "One of: Crypto, DeFi, NFTs, Web3, Trading, Blockchain, News",
  "tags": ["tag1", "tag2", "tag3"]
}`;

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Article from ${article.source}:\nTitle: ${article.title}\nSummary: ${article.description}\nURL: ${article.link}` },
            ],
            max_tokens: 6000,
          }),
        });

        if (!aiResponse.ok) {
          console.error(`AI error for article "${article.title}":`, await aiResponse.text());
          continue;
        }

        const aiData = await aiResponse.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '';
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) continue;

        const post = JSON.parse(jsonMatch[0]);

        await supabase.from('draft_posts').insert({
          telegram_user_id,
          title: post.title,
          description: post.description,
          content: post.content,
          category: post.category || defaultCategory,
          tags: post.tags || [],
          source_url: article.link,
          source_name: article.source,
          status: 'pending',
        });

        draftsCreated++;
      } catch (e) {
        console.error(`Error processing article "${article.title}":`, e);
      }
    }

    return new Response(JSON.stringify({ 
      drafts_created: draftsCreated,
      articles_found: articles.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Fetch news error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
