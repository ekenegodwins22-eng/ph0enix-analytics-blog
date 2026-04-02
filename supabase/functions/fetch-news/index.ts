import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RSS_FEEDS = [
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'Crypto' },
  { name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'Crypto' },
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'Crypto' },
  { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World News' },
  { name: 'Reuters', url: 'https://www.reutersagency.com/feed/', category: 'World News' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Technology' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Technology' },
  { name: 'Science Daily', url: 'https://www.sciencedaily.com/rss/all.xml', category: 'Science' },
  { name: 'CNBC', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', category: 'Finance' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'AI & Innovation' },
];

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

async function generateAndUploadImage(
  title: string,
  category: string,
  slug: string,
  LOVABLE_API_KEY: string,
  supabase: any,
): Promise<string | null> {
  try {
    const prompt = `Create a professional, modern blog header image for an article titled "${title}" in the ${category} category. The image should be visually striking, editorial-quality, with bold colors and clean composition. No text in the image. Photorealistic digital art style.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-image-preview',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text'],
      }),
    });

    if (!aiResponse.ok) {
      console.error('Image generation failed:', aiResponse.status);
      return null;
    }

    const aiData = await aiResponse.json();
    const imageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) return null;

    // Extract base64 data
    const base64Match = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) return null;

    const ext = base64Match[1] === 'jpeg' ? 'jpg' : base64Match[1];
    const base64Data = base64Match[2];

    // Decode base64 to Uint8Array
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const filePath = `${slug}.${ext}`;
    const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('blog-images')
      .upload(filePath, bytes, { contentType, upsert: true });

    if (uploadErr) {
      console.error('Upload error:', uploadErr);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrl?.publicUrl || null;
  } catch (e) {
    console.error('Image gen/upload error:', e);
    return null;
  }
}

async function sendTelegramNotification(
  botToken: string,
  chatId: number,
  message: string,
) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.substring(0, 4096),
        parse_mode: 'HTML',
      }),
    });
  } catch (e) {
    console.error('Telegram notification error:', e);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let telegram_user_id: number;
    let auto_mode = false;
    let batch_size = 2;

    try {
      const body = await req.json();
      telegram_user_id = body.telegram_user_id || 7444500411;
      auto_mode = body.auto_mode || false;
      batch_size = body.batch_size || 2;
    } catch {
      telegram_user_id = 7444500411;
      auto_mode = true;
      batch_size = 2;
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const SERPAPI_KEY = Deno.env.get('SERPAPI_API_KEY');
    const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: settings } = await supabase
      .from('bot_settings')
      .select('writing_style, default_category')
      .eq('telegram_user_id', telegram_user_id)
      .single();

    const writingStyle = settings?.writing_style || 'Professional writer covering crypto, tech, world news, science, and finance';

    // Fetch RSS feeds
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

          // Also check blog_posts to avoid duplicates
          const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
          if (cleanTitle) {
            const { data: existingPost } = await supabase
              .from('blog_posts')
              .select('id')
              .ilike('title', `%${cleanTitle.substring(0, 30)}%`)
              .limit(1);
            if (existingPost && existingPost.length > 0) continue;
          }

          articles.push({
            title: cleanTitle,
            link,
            description: description.replace(/<[^>]*>/g, '').substring(0, 500),
            source: feed.name,
            category: feed.category,
          });
        }
      } catch (e) {
        console.error(`RSS error ${feed.name}:`, e);
      }
    }

    // Enrich with SerpAPI
    let trendingContext = '';
    if (SERPAPI_KEY) {
      try {
        const dayIndex = new Date().getDay();
        const hourIndex = new Date().getHours();
        const topicIdx = (dayIndex * 3 + Math.floor(hourIndex / 8)) % SERPAPI_TOPICS.length;
        const topic = SERPAPI_TOPICS[topicIdx];
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
        console.error('SerpAPI error:', e);
      }
    }

    if (articles.length === 0) {
      return new Response(JSON.stringify({ drafts_created: 0, posts_published: 0, message: 'No new articles found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Pick diverse articles for this batch
    const byCategory: Record<string, any[]> = {};
    for (const a of articles) {
      if (!byCategory[a.category]) byCategory[a.category] = [];
      byCategory[a.category].push(a);
    }

    // Shuffle within categories for variety
    for (const cat of Object.keys(byCategory)) {
      byCategory[cat].sort(() => Math.random() - 0.5);
    }

    const selected: any[] = [];
    const categories = Object.keys(byCategory);
    let round = 0;
    while (selected.length < batch_size && round < 5) {
      for (const cat of categories) {
        if (selected.length >= batch_size) break;
        const pool = byCategory[cat];
        if (pool.length > round) {
          selected.push(pool[round]);
        }
      }
      round++;
    }

    // Generate posts
    let draftsCreated = 0;
    let draftsPublished = 0;

    for (const article of selected) {
      try {
        const systemPrompt = `You are ${writingStyle}.
Transform the following news article into a unique, SEO-optimized blog post.
Do NOT copy the original — rewrite with your own analysis, insights, and expanded context.
The article is from the "${article.category}" category.
${trendingContext ? `\nTrending context:\n${trendingContext}` : ''}

IMPORTANT SEO RULES:
- Naturally mention "CryptoPhoenixz" or "Phoenix the web3 sensei" once in the article body.
- Include relevant internal links using markdown format: [related topic](https://www.senseiphoenix.name.ng/blog) where appropriate.
- Use semantic headers (##, ###) for better SEO structure.
- End with a brief call-to-action encouraging readers to explore more on senseiphoenix.name.ng.

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

        const slug = (post.title || article.title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 80);

        const uniqueSlug = slug + '-' + Date.now().toString(36);
        const wordCount = (post.content || '').split(/\s+/).length;
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        // Always include branding tags for SEO
        const brandingTags = ['CryptoPhoenixz', 'Phoenix the web3 sensei', 'sensei_phoenixz'];
        const rawTags: string[] = post.tags || [];
        const mergedTags = [...new Set([...rawTags, ...brandingTags])];

        // Generate featured image
        let imageUrl: string | null = null;
        try {
          imageUrl = await generateAndUploadImage(
            post.title || article.title,
            article.category,
            uniqueSlug,
            LOVABLE_API_KEY,
            supabase,
          );
        } catch (imgErr) {
          console.error('Image generation failed, continuing without image:', imgErr);
        }

        if (auto_mode) {
          const { error: pubErr } = await supabase.from('blog_posts').insert({
            title: post.title,
            slug: uniqueSlug,
            description: post.description,
            content: post.content,
            category: post.category || article.category,
            tags: mergedTags,
            author: 'CryptoPhoenixz',
            read_time: readTime,
            published: true,
            image: imageUrl,
          });

          if (!pubErr) {
            draftsPublished++;
            await supabase.from('draft_posts').insert({
              telegram_user_id,
              title: post.title,
              description: post.description,
              content: post.content,
              category: post.category || article.category,
              tags: mergedTags,
              source_url: article.link,
              source_name: article.source,
              status: 'published',
              image_url: imageUrl,
            });
          } else {
            console.error('Auto-publish error:', pubErr);
          }
        } else {
          await supabase.from('draft_posts').insert({
            telegram_user_id,
            title: post.title,
            description: post.description,
            content: post.content,
            category: post.category || article.category,
            tags: mergedTags,
            source_url: article.link,
            source_name: article.source,
            status: 'pending',
            image_url: imageUrl,
          });
          draftsCreated++;
        }

        // Small delay between posts to avoid rate limits
        await new Promise(r => setTimeout(r, 3000));
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
