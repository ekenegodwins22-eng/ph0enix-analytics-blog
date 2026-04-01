import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RSS_FEEDS = [
  // Crypto & Web3
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'Crypto' },
  { name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'Crypto' },
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'Crypto' },
  // World News
  { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World News' },
  { name: 'Reuters', url: 'https://www.reutersagency.com/feed/', category: 'World News' },
  // Tech
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Technology' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Technology' },
  // Science & Health
  { name: 'Science Daily', url: 'https://www.sciencedaily.com/rss/all.xml', category: 'Science' },
  // Business & Finance
  { name: 'CNBC', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', category: 'Finance' },
  // AI & Innovation
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'AI & Innovation' },
];

// Rotate topics daily so we get variety
const SERPAPI_TOPICS = [
  'world statistics today',
  'global economy news today',
  'technology breakthrough today',
  'artificial intelligence news today',
  'climate change statistics',
  'space exploration news',
  'cryptocurrency market analysis',
  'cybersecurity threats today',
  'renewable energy news',
  'global health statistics',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let telegram_user_id: number;
    let auto_mode = false;

    try {
      const body = await req.json();
      telegram_user_id = body.telegram_user_id;
      auto_mode = body.auto_mode || false;
    } catch {
      telegram_user_id = 7444500411; // fallback for cron
      auto_mode = true;
    }

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

    const writingStyle = settings?.writing_style || 'Professional writer covering crypto, tech, world news, science, and finance';

    // Step 1: Fetch from diverse RSS feeds
    const articles: any[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: { 'User-Agent': 'SenseiPhoenix Blog Bot/1.0' },
        });
        const xml = await res.text();

        const items = xml.match(/<item>[\s\S]*?<\/item>/gi)
          || xml.match(/<entry>[\s\S]*?<\/entry>/gi)
          || [];

        for (const item of items.slice(0, 2)) {
          const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
            || item.match(/<title[^>]*>(.*?)<\/title>/)?.[1] || '';
          const link = item.match(/<link>(.*?)<\/link>/)?.[1]
            || item.match(/<link[^>]*href="([^"]+)"/)?.[1] || '';
          const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
            || item.match(/<description>(.*?)<\/description>/)?.[1]
            || item.match(/<summary[^>]*>(.*?)<\/summary>/)?.[1] || '';
          const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]
            || item.match(/<published>(.*?)<\/published>/)?.[1] || '';

          if (pubDate) {
            const articleDate = new Date(pubDate);
            const hoursDiff = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60);
            if (hoursDiff > 48) continue;
          }

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
            category: feed.category,
          });
        }
      } catch (e) {
        console.error(`RSS fetch error for ${feed.name}:`, e);
      }
    }

    // Step 2: Enrich with SerpAPI trending across diverse topics
    let trendingContext = '';
    if (SERPAPI_KEY) {
      try {
        const dayIndex = new Date().getDay();
        const topic = SERPAPI_TOPICS[dayIndex % SERPAPI_TOPICS.length];
        const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(topic)}&api_key=${SERPAPI_KEY}&num=5&engine=google&tbm=nws`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.news_results) {
          trendingContext = searchData.news_results
            .slice(0, 5)
            .map((r: any) => `- ${r.title}: ${r.snippet || ''}`)
            .join('\n');
        }
      } catch (e) {
        console.error('SerpAPI trending error:', e);
      }
    }

    if (articles.length === 0) {
      return new Response(JSON.stringify({ drafts_created: 0, message: 'No new articles found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 3: Pick 10 diverse articles (spread across categories)
    const byCategory: Record<string, any[]> = {};
    for (const a of articles) {
      if (!byCategory[a.category]) byCategory[a.category] = [];
      byCategory[a.category].push(a);
    }

    const selected: any[] = [];
    const categories = Object.keys(byCategory);
    let round = 0;
    while (selected.length < 10 && round < 5) {
      for (const cat of categories) {
        if (selected.length >= 10) break;
        const pool = byCategory[cat];
        if (pool.length > round) {
          selected.push(pool[round]);
        }
      }
      round++;
    }

    // Step 4: Generate AI posts for each selected article
    let draftsCreated = 0;
    let draftsPublished = 0;

    for (const article of selected) {
      try {
        const systemPrompt = `You are ${writingStyle}.
Transform the following news article into a unique, SEO-optimized blog post.
Do NOT copy the original — rewrite with your own analysis, insights, and expanded context.
The article is from the "${article.category}" category.
${trendingContext ? `\nTrending context:\n${trendingContext}` : ''}

Return ONLY valid JSON:
{
  "title": "Unique SEO title (60 chars max)",
  "description": "Meta description (155 chars max)",
  "content": "Full markdown blog post, at least 600 words. Include ## headers, analysis, and your perspective.",
  "category": "${article.category}",
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
          console.error(`AI error for "${article.title}":`, await aiResponse.text());
          continue;
        }

        const aiData = await aiResponse.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '';
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) continue;

        const post = JSON.parse(jsonMatch[0]);

        if (auto_mode) {
          // Auto-publish directly to blog_posts
          const slug = (post.title || article.title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 80);

          const wordCount = (post.content || '').split(/\s+/).length;
          const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

          const { error: pubErr } = await supabase.from('blog_posts').insert({
            title: post.title,
            slug: slug + '-' + Date.now().toString(36),
            description: post.description,
            content: post.content,
            category: post.category || article.category,
            tags: post.tags || [],
            author: 'PH0ENIX_WEB3',
            read_time: readTime,
            published: true,
          });

          if (!pubErr) {
            draftsPublished++;
            // Also save to drafts for record
            await supabase.from('draft_posts').insert({
              telegram_user_id,
              title: post.title,
              description: post.description,
              content: post.content,
              category: post.category || article.category,
              tags: post.tags || [],
              source_url: article.link,
              source_name: article.source,
              status: 'published',
            });
          } else {
            console.error('Auto-publish error:', pubErr);
          }
        } else {
          // Save as draft for manual approval
          await supabase.from('draft_posts').insert({
            telegram_user_id,
            title: post.title,
            description: post.description,
            content: post.content,
            category: post.category || article.category,
            tags: post.tags || [],
            source_url: article.link,
            source_name: article.source,
            status: 'pending',
          });
          draftsCreated++;
        }
      } catch (e) {
        console.error(`Error processing "${article.title}":`, e);
      }
    }

    return new Response(JSON.stringify({
      drafts_created: draftsCreated,
      posts_published: draftsPublished,
      articles_found: articles.length,
      selected: selected.length,
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
