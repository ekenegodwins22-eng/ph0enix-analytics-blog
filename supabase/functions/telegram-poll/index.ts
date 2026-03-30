import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';
const MAX_RUNTIME_MS = 55_000;
const MIN_REMAINING_MS = 5_000;

Deno.serve(async () => {
  const startTime = Date.now();

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), { status: 500 });

  const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
  if (!TELEGRAM_API_KEY) return new Response(JSON.stringify({ error: 'TELEGRAM_API_KEY not configured' }), { status: 500 });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let totalProcessed = 0;

  // Read initial offset
  const { data: state, error: stateErr } = await supabase
    .from('telegram_bot_state')
    .select('update_offset')
    .eq('id', 1)
    .single();

  if (stateErr) {
    return new Response(JSON.stringify({ error: stateErr.message }), { status: 500 });
  }

  let currentOffset = state.update_offset;

  while (true) {
    const elapsed = Date.now() - startTime;
    const remainingMs = MAX_RUNTIME_MS - elapsed;
    if (remainingMs < MIN_REMAINING_MS) break;

    const timeout = Math.min(50, Math.floor(remainingMs / 1000) - 5);
    if (timeout < 1) break;

    const response = await fetch(`${GATEWAY_URL}/getUpdates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offset: currentOffset,
        timeout,
        allowed_updates: ['message'],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), { status: 502 });
    }

    const updates = data.result ?? [];
    if (updates.length === 0) continue;

    // Store messages
    const rows = updates
      .filter((u: any) => u.message)
      .map((u: any) => ({
        update_id: u.update_id,
        chat_id: u.message.chat.id,
        user_id: u.message.from?.id ?? null,
        text: u.message.text ?? null,
        raw_update: u,
        processed: false,
      }));

    if (rows.length > 0) {
      const { error: insertErr } = await supabase
        .from('telegram_messages')
        .upsert(rows, { onConflict: 'update_id' });

      if (insertErr) {
        console.error('Insert error:', insertErr.message);
      }
    }

    // Process commands for each message
    for (const update of updates) {
      if (!update.message?.text) continue;
      
      const chatId = update.message.chat.id;
      const userId = update.message.from?.id;
      const text = update.message.text.trim();

      try {
        await processCommand(supabase, chatId, userId, text, LOVABLE_API_KEY, TELEGRAM_API_KEY);
        
        // Mark as processed
        await supabase
          .from('telegram_messages')
          .update({ processed: true })
          .eq('update_id', update.update_id);
      } catch (err) {
        console.error(`Error processing update ${update.update_id}:`, err);
      }

      totalProcessed++;
    }

    // Advance offset
    const newOffset = Math.max(...updates.map((u: any) => u.update_id)) + 1;
    await supabase
      .from('telegram_bot_state')
      .update({ update_offset: newOffset, updated_at: new Date().toISOString() })
      .eq('id', 1);

    currentOffset = newOffset;
  }

  return new Response(JSON.stringify({ ok: true, processed: totalProcessed, finalOffset: currentOffset }));
});

async function sendTelegramMessage(chatId: number, text: string, lovableKey: string, telegramKey: string, parseMode = 'HTML') {
  await fetch(`${GATEWAY_URL}/sendMessage`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableKey}`,
      'X-Connection-Api-Key': telegramKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.substring(0, 4096),
      parse_mode: parseMode,
    }),
  });
}

async function processCommand(supabase: any, chatId: number, userId: number, text: string, lovableKey: string, telegramKey: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

  // Check if user is in editing mode
  const { data: convState } = await supabase
    .from('telegram_conversation_state')
    .select('*')
    .eq('telegram_user_id', userId)
    .single();

  // If in editing mode and not a command, treat as edit instruction
  if (convState?.mode === 'editing' && !text.startsWith('/')) {
    await handleEditChat(supabase, chatId, userId, text, convState.current_draft_id, lovableKey, telegramKey);
    return;
  }

  if (text === '/start') {
    await sendTelegramMessage(chatId, 
      `🚀 <b>SenseiPhoenix Blog Bot</b>\n\n` +
      `Welcome! I help you create and manage blog posts.\n\n` +
      `<b>Commands:</b>\n` +
      `/login - Authenticate (magic link)\n` +
      `/newpost &lt;topic&gt; - Generate AI blog post\n` +
      `/fetch - Fetch latest crypto news\n` +
      `/drafts - View pending drafts\n` +
      `/preview &lt;id&gt; - Preview a draft\n` +
      `/edit &lt;id&gt; - Enter edit mode for a draft\n` +
      `/approve &lt;id&gt; - Publish a draft\n` +
      `/delete &lt;id&gt; - Delete a draft\n` +
      `/settings - View/update bot settings\n` +
      `/chat &lt;message&gt; - Chat with AI\n` +
      `/help - Show this message`,
      lovableKey, telegramKey
    );
    return;
  }

  if (text === '/help') {
    await processCommand(supabase, chatId, userId, '/start', lovableKey, telegramKey);
    return;
  }

  if (text.startsWith('/login')) {
    await handleLogin(supabase, chatId, userId, text, lovableKey, telegramKey);
    return;
  }

  // All other commands require authentication
  const { data: session } = await supabase
    .from('telegram_sessions')
    .select('*')
    .eq('telegram_user_id', userId)
    .eq('is_active', true)
    .single();

  if (!session) {
    await sendTelegramMessage(chatId, '🔒 Please authenticate first with /login your@email.com', lovableKey, telegramKey);
    return;
  }

  // Check admin role
  const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: session.user_id, _role: 'admin' });
  if (!isAdmin) {
    await sendTelegramMessage(chatId, '⛔ You need admin privileges to use this bot.', lovableKey, telegramKey);
    return;
  }

  if (text.startsWith('/newpost')) {
    const topic = text.replace('/newpost', '').trim();
    if (!topic) {
      await sendTelegramMessage(chatId, '❌ Please provide a topic: /newpost Bitcoin ETF latest news', lovableKey, telegramKey);
      return;
    }
    await sendTelegramMessage(chatId, `⏳ Generating post about: <b>${topic}</b>\nThis may take a minute...`, lovableKey, telegramKey);
    
    // Call generate-post function
    const res = await fetch(`${supabaseUrl}/functions/v1/generate-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}` },
      body: JSON.stringify({ topic, telegram_user_id: userId, chat_id: chatId }),
    });
    const result = await res.json();
    
    if (result.draft_id) {
      await sendTelegramMessage(chatId,
        `✅ <b>Draft Created!</b>\n\n` +
        `📝 <b>${result.title}</b>\n` +
        `📂 ${result.category}\n` +
        `🏷️ ${result.tags?.join(', ') || 'none'}\n\n` +
        `Use /preview ${result.draft_id.substring(0, 8)} to see full content\n` +
        `Use /edit ${result.draft_id.substring(0, 8)} to refine it\n` +
        `Use /approve ${result.draft_id.substring(0, 8)} to publish`,
        lovableKey, telegramKey
      );
    } else {
      await sendTelegramMessage(chatId, `❌ Error generating post: ${result.error || 'Unknown error'}`, lovableKey, telegramKey);
    }
    return;
  }

  if (text === '/fetch') {
    await sendTelegramMessage(chatId, '⏳ Fetching latest crypto news from RSS feeds and search...\nThis may take a few minutes.', lovableKey, telegramKey);
    
    const res = await fetch(`${supabaseUrl}/functions/v1/fetch-news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}` },
      body: JSON.stringify({ telegram_user_id: userId, chat_id: chatId }),
    });
    const result = await res.json();
    
    if (result.drafts_created > 0) {
      await sendTelegramMessage(chatId,
        `✅ <b>${result.drafts_created} new draft(s) created!</b>\n\n` +
        `Use /drafts to see them all.`,
        lovableKey, telegramKey
      );
    } else {
      await sendTelegramMessage(chatId, `ℹ️ ${result.message || 'No new articles found.'}`, lovableKey, telegramKey);
    }
    return;
  }

  if (text === '/drafts') {
    const { data: drafts } = await supabase
      .from('draft_posts')
      .select('id, title, status, created_at, source_name')
      .eq('telegram_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!drafts || drafts.length === 0) {
      await sendTelegramMessage(chatId, '📭 No drafts found. Use /newpost or /fetch to create some!', lovableKey, telegramKey);
      return;
    }

    let msg = '📋 <b>Your Drafts:</b>\n\n';
    for (const d of drafts) {
      const shortId = d.id.substring(0, 8);
      const status = d.status === 'pending' ? '🟡' : d.status === 'editing' ? '✏️' : '✅';
      const source = d.source_name ? ` (${d.source_name})` : '';
      msg += `${status} <code>${shortId}</code> - ${d.title || 'Untitled'}${source}\n`;
    }
    msg += `\nUse /preview &lt;id&gt; to view a draft`;
    await sendTelegramMessage(chatId, msg, lovableKey, telegramKey);
    return;
  }

  if (text.startsWith('/preview')) {
    const shortId = text.replace('/preview', '').trim();
    if (!shortId) {
      await sendTelegramMessage(chatId, '❌ Provide draft ID: /preview abc12345', lovableKey, telegramKey);
      return;
    }
    
    const { data: drafts } = await supabase
      .from('draft_posts')
      .select('*')
      .eq('telegram_user_id', userId)
      .ilike('id', `${shortId}%`)
      .limit(1);

    if (!drafts || drafts.length === 0) {
      await sendTelegramMessage(chatId, '❌ Draft not found.', lovableKey, telegramKey);
      return;
    }

    const d = drafts[0];
    const preview = d.content ? d.content.substring(0, 3000) : 'No content';
    await sendTelegramMessage(chatId,
      `📝 <b>${d.title || 'Untitled'}</b>\n\n` +
      `📂 Category: ${d.category || 'Uncategorized'}\n` +
      `🏷️ Tags: ${d.tags?.join(', ') || 'none'}\n` +
      `📰 Source: ${d.source_name || 'Original'}\n\n` +
      `<b>Description:</b>\n${d.description || 'None'}\n\n` +
      `<b>Content Preview:</b>\n${preview}${d.content?.length > 3000 ? '\n\n... (truncated)' : ''}`,
      lovableKey, telegramKey
    );
    return;
  }

  if (text.startsWith('/edit')) {
    const shortId = text.replace('/edit', '').trim();
    if (!shortId) {
      await sendTelegramMessage(chatId, '❌ Provide draft ID: /edit abc12345', lovableKey, telegramKey);
      return;
    }

    const { data: drafts } = await supabase
      .from('draft_posts')
      .select('id, title')
      .eq('telegram_user_id', userId)
      .ilike('id', `${shortId}%`)
      .limit(1);

    if (!drafts || drafts.length === 0) {
      await sendTelegramMessage(chatId, '❌ Draft not found.', lovableKey, telegramKey);
      return;
    }

    // Set conversation state to editing mode
    await supabase
      .from('telegram_conversation_state')
      .upsert({
        telegram_user_id: userId,
        current_draft_id: drafts[0].id,
        mode: 'editing',
      }, { onConflict: 'telegram_user_id' });

    await supabase
      .from('draft_posts')
      .update({ status: 'editing' })
      .eq('id', drafts[0].id);

    await sendTelegramMessage(chatId,
      `✏️ <b>Edit Mode Active</b>\n\n` +
      `Editing: <b>${drafts[0].title || 'Untitled'}</b>\n\n` +
      `Just type your edit instructions naturally:\n` +
      `• "Make the title more catchy"\n` +
      `• "Add a section about DeFi risks"\n` +
      `• "Make it more concise"\n` +
      `• "Change category to DeFi"\n\n` +
      `Type /done to exit edit mode.`,
      lovableKey, telegramKey
    );
    return;
  }

  if (text === '/done') {
    await supabase
      .from('telegram_conversation_state')
      .upsert({ telegram_user_id: userId, mode: 'idle', current_draft_id: null }, { onConflict: 'telegram_user_id' });

    await sendTelegramMessage(chatId, '✅ Exited edit mode.', lovableKey, telegramKey);
    return;
  }

  if (text.startsWith('/approve')) {
    const shortId = text.replace('/approve', '').trim();
    if (!shortId) {
      await sendTelegramMessage(chatId, '❌ Provide draft ID: /approve abc12345', lovableKey, telegramKey);
      return;
    }

    const { data: drafts } = await supabase
      .from('draft_posts')
      .select('*')
      .eq('telegram_user_id', userId)
      .ilike('id', `${shortId}%`)
      .limit(1);

    if (!drafts || drafts.length === 0) {
      await sendTelegramMessage(chatId, '❌ Draft not found.', lovableKey, telegramKey);
      return;
    }

    const d = drafts[0];
    if (!d.title || !d.content || !d.description) {
      await sendTelegramMessage(chatId, '❌ Draft is incomplete. Use /edit to add missing content.', lovableKey, telegramKey);
      return;
    }

    // Generate slug
    const slug = d.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 80);

    // Publish to blog_posts
    const { error: pubErr } = await supabase.from('blog_posts').insert({
      title: d.title,
      description: d.description,
      content: d.content,
      slug: slug,
      category: d.category || 'Crypto',
      tags: d.tags || [],
      image: d.image_url,
      published: true,
      author: 'PH0ENIX_WEB3',
      read_time: `${Math.max(1, Math.ceil(d.content.split(/\s+/).length / 200))} min read`,
    });

    if (pubErr) {
      await sendTelegramMessage(chatId, `❌ Failed to publish: ${pubErr.message}`, lovableKey, telegramKey);
      return;
    }

    // Update draft status
    await supabase.from('draft_posts').update({ status: 'approved' }).eq('id', d.id);

    // Ping search engines
    try {
      await fetch(`${supabaseUrl}/functions/v1/ping-search-engines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}` },
        body: JSON.stringify({ slug }),
      });
    } catch (e) {
      console.error('Ping search engines error:', e);
    }

    await sendTelegramMessage(chatId,
      `🎉 <b>Published!</b>\n\n` +
      `📝 ${d.title}\n` +
      `🔗 https://www.senseiphoenix.name.ng/blog/${slug}\n\n` +
      `Search engines have been notified.`,
      lovableKey, telegramKey
    );
    return;
  }

  if (text.startsWith('/delete')) {
    const shortId = text.replace('/delete', '').trim();
    if (!shortId) {
      await sendTelegramMessage(chatId, '❌ Provide draft ID: /delete abc12345', lovableKey, telegramKey);
      return;
    }

    const { error } = await supabase
      .from('draft_posts')
      .delete()
      .eq('telegram_user_id', userId)
      .ilike('id', `${shortId}%`);

    if (error) {
      await sendTelegramMessage(chatId, `❌ Error: ${error.message}`, lovableKey, telegramKey);
    } else {
      await sendTelegramMessage(chatId, '🗑️ Draft deleted.', lovableKey, telegramKey);
    }
    return;
  }

  if (text.startsWith('/settings')) {
    const { data: settings } = await supabase
      .from('bot_settings')
      .select('*')
      .eq('telegram_user_id', userId)
      .single();

    const s = settings || { writing_style: 'Default', default_category: 'Crypto', auto_fetch_enabled: false, fetch_interval_hours: 12 };
    
    await sendTelegramMessage(chatId,
      `⚙️ <b>Bot Settings</b>\n\n` +
      `✍️ Writing Style: ${s.writing_style}\n` +
      `📂 Default Category: ${s.default_category}\n` +
      `🔄 Auto-fetch: ${s.auto_fetch_enabled ? 'ON' : 'OFF'}\n` +
      `⏰ Fetch Interval: ${s.fetch_interval_hours}h\n\n` +
      `To update, use:\n` +
      `/setstyle &lt;style description&gt;\n` +
      `/setcategory &lt;category&gt;`,
      lovableKey, telegramKey
    );
    return;
  }

  if (text.startsWith('/setstyle')) {
    const style = text.replace('/setstyle', '').trim();
    if (!style) {
      await sendTelegramMessage(chatId, '❌ Provide a style: /setstyle Casual and witty crypto analyst', lovableKey, telegramKey);
      return;
    }
    await supabase
      .from('bot_settings')
      .upsert({ telegram_user_id: userId, writing_style: style }, { onConflict: 'telegram_user_id' });
    await sendTelegramMessage(chatId, `✅ Writing style updated to: ${style}`, lovableKey, telegramKey);
    return;
  }

  if (text.startsWith('/setcategory')) {
    const cat = text.replace('/setcategory', '').trim();
    if (!cat) {
      await sendTelegramMessage(chatId, '❌ Provide a category: /setcategory DeFi', lovableKey, telegramKey);
      return;
    }
    await supabase
      .from('bot_settings')
      .upsert({ telegram_user_id: userId, default_category: cat }, { onConflict: 'telegram_user_id' });
    await sendTelegramMessage(chatId, `✅ Default category updated to: ${cat}`, lovableKey, telegramKey);
    return;
  }

  if (text.startsWith('/chat')) {
    const message = text.replace('/chat', '').trim();
    if (!message) {
      await sendTelegramMessage(chatId, '❌ Provide a message: /chat What is DeFi?', lovableKey, telegramKey);
      return;
    }

    await sendTelegramMessage(chatId, '💭 Thinking...', lovableKey, telegramKey);

    const aiResponse = await callLovableAI(
      [{ role: 'system', content: 'You are a helpful crypto and Web3 expert assistant. Be concise and informative.' },
       { role: 'user', content: message }],
      lovableKey
    );

    await sendTelegramMessage(chatId, aiResponse || '❌ AI did not return a response.', lovableKey, telegramKey, 'Markdown');
    return;
  }

  // Unknown command
  if (text.startsWith('/')) {
    await sendTelegramMessage(chatId, '❓ Unknown command. Type /help to see available commands.', lovableKey, telegramKey);
  }
}

async function handleLogin(supabase: any, chatId: number, userId: number, text: string, lovableKey: string, telegramKey: string) {
  const email = text.replace('/login', '').trim();
  
  if (!email || !email.includes('@')) {
    await sendTelegramMessage(chatId, '📧 Please provide your admin email:\n/login your@email.com', lovableKey, telegramKey);
    return;
  }

  // Check if user exists and is admin
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users?.find((u: any) => u.email === email);

  if (!user) {
    await sendTelegramMessage(chatId, '❌ No account found with this email.', lovableKey, telegramKey);
    return;
  }

  const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
  if (!isAdmin) {
    await sendTelegramMessage(chatId, '⛔ This account does not have admin privileges.', lovableKey, telegramKey);
    return;
  }

  // Create/update session
  await supabase
    .from('telegram_sessions')
    .upsert({
      telegram_user_id: userId,
      telegram_chat_id: chatId,
      user_id: user.id,
      is_active: true,
    }, { onConflict: 'telegram_user_id' });

  await sendTelegramMessage(chatId,
    `✅ <b>Authenticated!</b>\n\nLinked to: ${email}\nYou now have full access to bot commands.`,
    lovableKey, telegramKey
  );
}

async function handleEditChat(supabase: any, chatId: number, userId: number, instruction: string, draftId: string, lovableKey: string, telegramKey: string) {
  await sendTelegramMessage(chatId, '✏️ Applying changes...', lovableKey, telegramKey);

  // Get current draft
  const { data: draft } = await supabase
    .from('draft_posts')
    .select('*')
    .eq('id', draftId)
    .single();

  if (!draft) {
    await sendTelegramMessage(chatId, '❌ Draft not found. Use /done to exit edit mode.', lovableKey, telegramKey);
    return;
  }

  const aiResponse = await callLovableAI(
    [
      {
        role: 'system',
        content: `You are editing a blog post. Apply the user's instruction to the current content.
Return ONLY valid JSON with these fields: title, description, content (markdown), category, tags (array).
Keep the existing structure and improve based on the instruction. Do not add commentary outside JSON.`
      },
      {
        role: 'user',
        content: `Current post:\nTitle: ${draft.title}\nDescription: ${draft.description}\nCategory: ${draft.category}\nTags: ${draft.tags?.join(', ')}\nContent:\n${draft.content}\n\nInstruction: ${instruction}`
      }
    ],
    lovableKey
  );

  try {
    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    
    const updated = JSON.parse(jsonMatch[0]);

    await supabase
      .from('draft_posts')
      .update({
        title: updated.title || draft.title,
        description: updated.description || draft.description,
        content: updated.content || draft.content,
        category: updated.category || draft.category,
        tags: updated.tags || draft.tags,
      })
      .eq('id', draftId);

    await sendTelegramMessage(chatId,
      `✅ <b>Updated!</b>\n\n` +
      `📝 Title: ${updated.title || draft.title}\n` +
      `📂 Category: ${updated.category || draft.category}\n\n` +
      `Continue editing or type /done to exit.\n` +
      `Use /preview ${draftId.substring(0, 8)} to see full content.`,
      lovableKey, telegramKey
    );
  } catch (e) {
    console.error('Edit parse error:', e);
    await sendTelegramMessage(chatId, '❌ Failed to apply edit. Try being more specific with your instruction.', lovableKey, telegramKey);
  }
}

async function callLovableAI(messages: any[], lovableKey: string): Promise<string> {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Lovable AI error:', errText);
    return 'AI service temporarily unavailable.';
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}
