import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, telegram_user_id, chat_id } = await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), { 
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
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

    const writingStyle = settings?.writing_style || 'Professional crypto/Web3 writer with deep industry knowledge. Write in an engaging, informative style.';
    const defaultCategory = settings?.default_category || 'Crypto';

    // Step 1: Search for latest info using SerpAPI
    let searchContext = '';
    if (SERPAPI_KEY) {
      try {
        const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(topic + ' latest news 2025 2026')}&api_key=${SERPAPI_KEY}&num=5&engine=google`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        if (searchData.organic_results) {
          searchContext = searchData.organic_results
            .slice(0, 5)
            .map((r: any) => `- ${r.title}: ${r.snippet || ''}`)
            .join('\n');
        }
      } catch (e) {
        console.error('SerpAPI error:', e);
      }
    }

    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

    // Step 2: Generate blog post with Lovable AI
    const systemPrompt = `You are ${writingStyle}

Generate a comprehensive, SEO-optimized blog post about the given topic.
Use the provided search results for the LATEST real-time information and data.

TODAY'S DATE IS: ${currentDate}
CRITICAL DATE RULES:
- Always use the correct current date when referring to "today", "yesterday", "this week", etc.
- If referencing past events, use accurate relative or absolute dates.
- NEVER say "today is March 31" if today is actually a different date.

Return ONLY valid JSON with these fields:
{
  "title": "SEO-optimized title (60 chars max)",
  "description": "Meta description (155 chars max)",
  "content": "Full markdown content with headers, paragraphs, lists. At least 1000 words. Include an introduction, main sections with ## headers, and conclusion.",
  "category": "One of: Crypto, DeFi, NFTs, Web3, Trading, Blockchain, Guides, News, World News, Technology, Science, Finance, AI & Innovation",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Rules:
- Use real data and statistics from the search results
- Include relevant links and references
- Write in an engaging, authoritative tone
- Include practical insights and actionable advice
- Format with proper markdown (##, ###, **, -, etc.)
- Make it comprehensive and well-structured
- Naturally mention "CryptoPhoenixz" or "Phoenix the web3 sensei" once in the article body`;

    const userPrompt = `Write a blog post about: ${topic}

${searchContext ? `Latest search results for context:\n${searchContext}` : 'No search results available - use your general knowledge.'}

Default category: ${defaultCategory}`;

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
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 8000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI generation failed: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '';

    // Parse JSON from AI response
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI did not return valid JSON');

    const post = JSON.parse(jsonMatch[0]);

    // Always add branding tags
    const brandingTags = ['CryptoPhoenixz', 'Phoenix the web3 sensei', 'sensei_phoenixz'];
    const mergedTags = [...new Set([...(post.tags || []), ...brandingTags])];

    const slug = (post.title || topic)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
    const uniqueSlug = slug + '-' + Date.now().toString(36);
    const wordCount = (post.content || '').split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    // Save as draft for manual review (NOT auto-publish)
    const { data: draft, error: draftErr } = await supabase
      .from('draft_posts')
      .insert({
        telegram_user_id,
        title: post.title,
        description: post.description,
        content: post.content,
        category: post.category || defaultCategory,
        tags: mergedTags,
        status: 'pending',
      })
      .select('id')
      .single();

    if (draftErr) throw new Error(`Draft save failed: ${draftErr.message}`);

    return new Response(JSON.stringify({
      draft_id: draft.id,
      title: post.title,
      category: post.category,
      tags: post.tags,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Generate post error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
