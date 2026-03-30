
-- Polling state table (singleton)
CREATE TABLE public.telegram_bot_state (
  id int PRIMARY KEY CHECK (id = 1),
  update_offset bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.telegram_bot_state (id, update_offset) VALUES (1, 0);

ALTER TABLE public.telegram_bot_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for bot_state"
ON public.telegram_bot_state FOR ALL TO public
USING (true) WITH CHECK (true);

-- Telegram messages table
CREATE TABLE public.telegram_messages (
  update_id bigint PRIMARY KEY,
  chat_id bigint NOT NULL,
  user_id bigint,
  text text,
  raw_update jsonb NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_telegram_messages_chat_id ON public.telegram_messages (chat_id);
CREATE INDEX idx_telegram_messages_processed ON public.telegram_messages (processed);

ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for telegram_messages"
ON public.telegram_messages FOR ALL TO public
USING (true) WITH CHECK (true);

-- Conversation state for chat-based editing
CREATE TABLE public.telegram_conversation_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id bigint NOT NULL UNIQUE,
  current_draft_id uuid REFERENCES public.draft_posts(id) ON DELETE SET NULL,
  mode text NOT NULL DEFAULT 'idle',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_conversation_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for conversation_state"
ON public.telegram_conversation_state FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE TRIGGER update_conversation_state_updated_at
  BEFORE UPDATE ON public.telegram_conversation_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
