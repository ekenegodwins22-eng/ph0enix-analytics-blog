import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ADMIN_TELEGRAM_UID = 7444500411;
const MAX_RUNTIME_MS = 55_000;
const MIN_REMAINING_MS = 5_000;

Deno.serve(async () => {
  const startTime = Date.now();

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), { status: 500 });

  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!BOT_TOKEN) return new Response(JSON.stringify({ error: 'TELEGRAM_BOT_TOKEN not configured' }), { status: 500 });

  const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let totalProcessed = 0;

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

    const response = await fetch(`${TELEGRAM_API}/getUpdates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      await supabase
        .from('telegram_messages')
        .upsert(rows, { onConflict: 'update_id' });
    }

    // Process commands
    for (const update of updates) {
      if (!update.message?.text) continue;
      
      const chatId = update.message.chat.id;
      const userId = update.message.from?.id;
      const text = update.message.text.trim();

      try {
        await processCommand(supabase, chatId, userId, text, TELEGRAM_API, LOVABLE_API_KEY);
        await supabase
          .from('telegram_messages')
          .update({ processed: true })
          .eq('update_id', update.update_id);
      } catch (err) {
        console.error(`Error processing update ${update.update_id}:`, err);
      }

      totalProcessed++;
    }

    const newOffset = Math.max(...updates.map((u: any) => u.update_id)) + 1;
    await supabase
      .from('telegram_bot_state')
      .update({ update_offset: newOffset, updated_at: new Date().toISOString() })
      .eq('id', 1);

    currentOffset = newOffset;
  }

  return new Response(JSON.stringify({ ok: true, processed: totalProcessed, finalOffset: currentOffset }));
});

async function sendTg(telegramApi: string, chatId: number, text: string, parseMode = 'HTML') {
  const res = await fetch(`${telegramApi}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.substring(0, 4096),
      parse_mode: parseMode,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('sendMessage error:', err);
  }
}

async function processCommand(supabase: any, chatId: number, userId: number, text: string, telegramApi: string, lovableKey: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

  // Check editing mode
  const { data: convState } = await supabase
    .from('telegram_conversation_state')
    .select('*')
    .eq('telegram_user_id', userId)
    .single();

  if (convState?.mode === 'editing' && !text.startsWith('/')) {
    await handleEditChat(supabase, chatId, userId, text, convState.current_draft_id, telegramApi, lovableKey);
    return;
  }

  if (text === '/start' || text === '/help') {
    await sendTg(telegramApi, chatId,
      `🚀 <b>SenseiPhoenix Blog Bot</b>\n\n` +
      `<b>Commands:</b>\n` +
      `/login &lt;email&gt; - Authenticate\n` +
      `/newpost &lt;topic&gt; - Generate AI blog post\n` +
      `/fetch - Fetch latest crypto news\n` +
      `/drafts - View pending drafts\n` +
      `/preview &lt;id&gt; - Preview a draft\n` +
      `/edit &lt;id&gt; - Enter edit mode\n` +
      `/approve &lt;id&gt; - Publish a draft\n` +
      `/delete &lt;id&gt; - Delete a draft\n` +
      `/settings - View bot settings\n` +
      `/setstyle &lt;style&gt; - Set writing style\n` +
      `/setcategory &lt;cat&gt; - Set default category\n` +
      `/chat &lt;message&gt; - Chat with AI\n` +
      `/done - Exit edit mode`
    );
    return;
  }

  if (text.startsWith('/login')) {
    await handleLogin(supabase, chatId, userId, text, telegramApi);
    return;
  }

  // Auth check
  const { data: session } = await supabase
    .from('telegram_sessions')
    .select('*')
    .eq('telegram_user_id', userId)
    .eq('is_active', true)
    .single();

  if (!session) {
    await sendTg(telegramApi, chatId, '🔒 Please authenticate first: /login your@email.com');
    return;
  }

  const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: session.user_id, _role: 'admin' });
  if (!isAdmin) {
    await sendTg(telegramApi, chatId, '⛔ Admin privileges required.');
    return;
  }

  if (text.startsWith('/newpost')) {
    const topic = text.replace('/newpost', '').trim();
    if (!topic) {
      await sendTg(telegramApi, chatId, '❌ Usage: /newpost Bitcoin ETF latest news');
      return;
    }
    await sendTg(telegramApi, chatId, `⏳ Generating post about: <b>${topic}</b>\nThis may take a minute...`);
    
    const res = await fetch(`${supabaseUrl}/functions/v1/generate-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}` },
      body: JSON.stringify({ topic, telegram_user_id: userId, chat_id: chatId }),
    });
    const result = await res.json();
    
    if (result.draft_id) {
      const sid = result.draft_id.substring(0, 8);
      await sendTg(telegramApi, chatId,
        `✅ <b>Draft Created!</b>\n\n📝 <b>${result.title}</b>\n📂 ${result.category}\n🏷️ ${result.tags?.join(', ')}\n\n` +
        `/preview ${sid} - View\n/edit ${sid} - Edit\n/approve ${sid} - Publish`
      );
    } else {
      await sendTg(telegramApi, chatId, `❌ Error: ${result.error || 'Unknown'}`);
    }
    return;
  }

  if (text === '/fetch') {
    await sendTg(telegramApi, chatId, '⏳ Fetching latest crypto news...\nThis may take a few minutes.');
    
    const res = await fetch(`${supabaseUrl}/functions/v1/fetch-news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}` },
      body: JSON.stringify({ telegram_user_id: userId, chat_id: chatId }),
    });
    const result = await res.json();
    
    if (result.drafts_created > 0) {
      await sendTg(telegramApi, chatId, `✅ <b>${result.drafts_created} new draft(s) created!</b>\n\nUse /drafts to see them.`);
    } else {
      await sendTg(telegramApi, chatId, `ℹ️ ${result.message || 'No new articles found.'}`);
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

    if (!drafts?.length) {
      await sendTg(telegramApi, chatId, '📭 No drafts. Use /newpost or /fetch to create some!');
      return;
    }

    let msg = '📋 <b>Your Drafts:</b>\n\n';
    for (const d of drafts) {
      const s = d.status === 'pending' ? '🟡' : d.status === 'editing' ? '✏️' : '✅';
      const src = d.source_name ? ` (${d.source_name})` : '';
      msg += `${s} <code>${d.id.substring(0, 8)}</code> ${d.title || 'Untitled'}${src}\n`;
    }
    msg += `\n/preview &lt;id&gt; to view`;
    await sendTg(telegramApi, chatId, msg);
    return;
  }

  if (text.startsWith('/preview')) {
    const shortId = text.replace('/preview', '').trim();
    if (!shortId) { await sendTg(telegramApi, chatId, '❌ Usage: /preview abc12345'); return; }
    
    const { data: drafts } = await supabase.from('draft_posts').select('*')
      .eq('telegram_user_id', userId).ilike('id', `${shortId}%`).limit(1);

    if (!drafts?.length) { await sendTg(telegramApi, chatId, '❌ Draft not found.'); return; }
    const d = drafts[0];
    const preview = d.content?.substring(0, 3000) || 'No content';
    await sendTg(telegramApi, chatId,
      `📝 <b>${d.title || 'Untitled'}</b>\n📂 ${d.category}\n🏷️ ${d.tags?.join(', ')}\n📰 ${d.source_name || 'Original'}\n\n` +
      `<b>Description:</b>\n${d.description || 'None'}\n\n<b>Content:</b>\n${preview}${d.content?.length > 3000 ? '\n...(truncated)' : ''}`
    );
    return;
  }

  if (text.startsWith('/edit')) {
    const shortId = text.replace('/edit', '').trim();
    if (!shortId) { await sendTg(telegramApi, chatId, '❌ Usage: /edit abc12345'); return; }

    const { data: drafts } = await supabase.from('draft_posts').select('id, title')
      .eq('telegram_user_id', userId).ilike('id', `${shortId}%`).limit(1);

    if (!drafts?.length) { await sendTg(telegramApi, chatId, '❌ Draft not found.'); return; }

    await supabase.from('telegram_conversation_state')
      .upsert({ telegram_user_id: userId, current_draft_id: drafts[0].id, mode: 'editing' }, { onConflict: 'telegram_user_id' });
    await supabase.from('draft_posts').update({ status: 'editing' }).eq('id', drafts[0].id);

    await sendTg(telegramApi, chatId,
      `✏️ <b>Edit Mode: ${drafts[0].title || 'Untitled'}</b>\n\nType your edits naturally:\n• "Make title more catchy"\n• "Add DeFi risks section"\n• "Make it shorter"\n\n/done to exit`
    );
    return;
  }

  if (text === '/done') {
    await supabase.from('telegram_conversation_state')
      .upsert({ telegram_user_id: userId, mode: 'idle', current_draft_id: null }, { onConflict: 'telegram_user_id' });
    await sendTg(telegramApi, chatId, '✅ Exited edit mode.');
    return;
  }

  if (text.startsWith('/approve')) {
    const shortId = text.replace('/approve', '').trim();
    if (!shortId) { await sendTg(telegramApi, chatId, '❌ Usage: /approve abc12345'); return; }

    const { data: drafts } = await supabase.from('draft_posts').select('*')
      .eq('telegram_user_id', userId).ilike('id', `${shortId}%`).limit(1);

    if (!drafts?.length) { await sendTg(telegramApi, chatId, '❌ Draft not found.'); return; }
    const d = drafts[0];
    if (!d.title || !d.content || !d.description) {
      await sendTg(telegramApi, chatId, '❌ Draft incomplete. Use /edit to add missing content.');
      return;
    }

    const slug = d.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 80);

    const { error: pubErr } = await supabase.from('blog_posts').insert({
      title: d.title, description: d.description, content: d.content, slug,
      category: d.category || 'Crypto', tags: d.tags || [], image: d.image_url,
      published: true, author: 'PH0ENIX_WEB3',
      read_time: `${Math.max(1, Math.ceil(d.content.split(/\s+/).length / 200))} min read`,
    });

    if (pubErr) { await sendTg(telegramApi, chatId, `❌ Publish failed: ${pubErr.message}`); return; }

    await supabase.from('draft_posts').update({ status: 'approved' }).eq('id', d.id);

    try {
      await fetch(`${supabaseUrl}/functions/v1/ping-search-engines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}` },
        body: JSON.stringify({ slug }),
      });
    } catch (e) { console.error('Ping error:', e); }

    await sendTg(telegramApi, chatId,
      `🎉 <b>Published!</b>\n\n📝 ${d.title}\n🔗 https://www.senseiphoenix.name.ng/blog/${slug}\n\nSearch engines notified.`
    );
    return;
  }

  if (text.startsWith('/delete')) {
    const shortId = text.replace('/delete', '').trim();
    if (!shortId) { await sendTg(telegramApi, chatId, '❌ Usage: /delete abc12345'); return; }
    await supabase.from('draft_posts').delete().eq('telegram_user_id', userId).ilike('id', `${shortId}%`);
    await sendTg(telegramApi, chatId, '🗑️ Draft deleted.');
    return;
  }

  if (text.startsWith('/settings')) {
    const { data: s } = await supabase.from('bot_settings').select('*').eq('telegram_user_id', userId).single();
    const cfg = s || { writing_style: 'Default', default_category: 'Crypto', auto_fetch_enabled: false, fetch_interval_hours: 12 };
    await sendTg(telegramApi, chatId,
      `⚙️ <b>Settings</b>\n\n✍️ Style: ${cfg.writing_style}\n📂 Category: ${cfg.default_category}\n🔄 Auto-fetch: ${cfg.auto_fetch_enabled ? 'ON' : 'OFF'}\n⏰ Interval: ${cfg.fetch_interval_hours}h`
    );
    return;
  }

  if (text.startsWith('/setstyle')) {
    const style = text.replace('/setstyle', '').trim();
    if (!style) { await sendTg(telegramApi, chatId, '❌ Usage: /setstyle Casual crypto analyst'); return; }
    await supabase.from('bot_settings').upsert({ telegram_user_id: userId, writing_style: style }, { onConflict: 'telegram_user_id' });
    await sendTg(telegramApi, chatId, `✅ Style: ${style}`);
    return;
  }

  if (text.startsWith('/setcategory')) {
    const cat = text.replace('/setcategory', '').trim();
    if (!cat) { await sendTg(telegramApi, chatId, '❌ Usage: /setcategory DeFi'); return; }
    await supabase.from('bot_settings').upsert({ telegram_user_id: userId, default_category: cat }, { onConflict: 'telegram_user_id' });
    await sendTg(telegramApi, chatId, `✅ Category: ${cat}`);
    return;
  }

  if (text.startsWith('/chat')) {
    const message = text.replace('/chat', '').trim();
    if (!message) { await sendTg(telegramApi, chatId, '❌ Usage: /chat What is DeFi?'); return; }

    await sendTg(telegramApi, chatId, '💭 Thinking...');
    const aiResp = await callLovableAI(
      [{ role: 'system', content: 'You are a helpful crypto/Web3 expert. Be concise.' },
       { role: 'user', content: message }],
      lovableKey
    );
    // Send as plain text to avoid HTML parse issues
    await sendTg(telegramApi, chatId, aiResp || '❌ No response.', 'Markdown');
    return;
  }

  if (text.startsWith('/')) {
    await sendTg(telegramApi, chatId, '❓ Unknown command. /help for list.');
  }
}

async function handleLogin(supabase: any, chatId: number, userId: number, text: string, telegramApi: string) {
  const email = text.replace('/login', '').trim();
  if (!email?.includes('@')) {
    await sendTg(telegramApi, chatId, '📧 Usage: /login your@email.com');
    return;
  }

  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users?.find((u: any) => u.email === email);
  if (!user) { await sendTg(telegramApi, chatId, '❌ No account with this email.'); return; }

  const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
  if (!isAdmin) { await sendTg(telegramApi, chatId, '⛔ Not an admin account.'); return; }

  await supabase.from('telegram_sessions')
    .upsert({ telegram_user_id: userId, telegram_chat_id: chatId, user_id: user.id, is_active: true }, { onConflict: 'telegram_user_id' });

  await sendTg(telegramApi, chatId, `✅ <b>Authenticated!</b>\nLinked to: ${email}`);
}

async function handleEditChat(supabase: any, chatId: number, userId: number, instruction: string, draftId: string, telegramApi: string, lovableKey: string) {
  await sendTg(telegramApi, chatId, '✏️ Applying changes...');

  const { data: draft } = await supabase.from('draft_posts').select('*').eq('id', draftId).single();
  if (!draft) { await sendTg(telegramApi, chatId, '❌ Draft not found. /done to exit.'); return; }

  const aiResp = await callLovableAI([
    { role: 'system', content: `Edit this blog post per the user's instruction. Return ONLY JSON: {title, description, content (markdown), category, tags (array)}.` },
    { role: 'user', content: `Current:\nTitle: ${draft.title}\nDescription: ${draft.description}\nCategory: ${draft.category}\nTags: ${draft.tags?.join(', ')}\nContent:\n${draft.content}\n\nInstruction: ${instruction}` }
  ], lovableKey);

  try {
    const jsonMatch = aiResp.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON');
    const updated = JSON.parse(jsonMatch[0]);

    await supabase.from('draft_posts').update({
      title: updated.title || draft.title,
      description: updated.description || draft.description,
      content: updated.content || draft.content,
      category: updated.category || draft.category,
      tags: updated.tags || draft.tags,
    }).eq('id', draftId);

    const sid = draftId.substring(0, 8);
    await sendTg(telegramApi, chatId,
      `✅ <b>Updated!</b>\n📝 ${updated.title || draft.title}\n\nContinue editing or /done\n/preview ${sid} to see full content`
    );
  } catch (e) {
    console.error('Edit parse error:', e);
    await sendTg(telegramApi, chatId, '❌ Edit failed. Try more specific instructions.');
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
    console.error('AI error:', await response.text());
    return 'AI service temporarily unavailable.';
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}
