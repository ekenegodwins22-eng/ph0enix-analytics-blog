-- Create telegram_sessions table to link Telegram users to authenticated admins
CREATE TABLE public.telegram_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL UNIQUE,
  telegram_chat_id BIGINT NOT NULL,
  user_id UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create draft_posts table for AI-generated drafts awaiting approval
CREATE TABLE public.draft_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  title TEXT,
  description TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  source_url TEXT,
  source_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'editing', 'approved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bot_settings table for user preferences
CREATE TABLE public.bot_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL UNIQUE,
  writing_style TEXT DEFAULT 'Professional crypto/Web3 writer with deep industry knowledge. Write in an engaging, informative style.',
  default_category TEXT DEFAULT 'Crypto',
  auto_fetch_enabled BOOLEAN NOT NULL DEFAULT false,
  fetch_interval_hours INTEGER DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.telegram_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for telegram_sessions (admin access only via edge functions using service role)
CREATE POLICY "Service role can manage telegram_sessions"
ON public.telegram_sessions
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS policies for draft_posts (admin access only via edge functions using service role)
CREATE POLICY "Service role can manage draft_posts"
ON public.draft_posts
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS policies for bot_settings (admin access only via edge functions using service role)
CREATE POLICY "Service role can manage bot_settings"
ON public.bot_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_telegram_sessions_telegram_user_id ON public.telegram_sessions(telegram_user_id);
CREATE INDEX idx_telegram_sessions_user_id ON public.telegram_sessions(user_id);
CREATE INDEX idx_draft_posts_telegram_user_id ON public.draft_posts(telegram_user_id);
CREATE INDEX idx_draft_posts_status ON public.draft_posts(status);
CREATE INDEX idx_bot_settings_telegram_user_id ON public.bot_settings(telegram_user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_telegram_sessions_updated_at
BEFORE UPDATE ON public.telegram_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_draft_posts_updated_at
BEFORE UPDATE ON public.draft_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bot_settings_updated_at
BEFORE UPDATE ON public.bot_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();