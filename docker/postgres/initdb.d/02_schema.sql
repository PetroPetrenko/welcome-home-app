-- ============================================================
-- 02_schema.sql — Core tables, RLS-equivalent constraints, triggers
-- ============================================================

-- -----------------------------------------------
-- Utility: updated_at trigger function
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------
-- Table: deals
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.deals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  price         NUMERIC NOT NULL DEFAULT 0,
  currency      TEXT NOT NULL DEFAULT 'Dhs',
  ticket        NUMERIC NOT NULL DEFAULT 0,
  yield_percent NUMERIC DEFAULT 0,
  sold_percent  NUMERIC DEFAULT 0,
  days_left     INTEGER,
  image_url     TEXT,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------
-- Table: profiles
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------
-- Table: messages (chat)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id     UUID NOT NULL,
  recipient_id  UUID NOT NULL,
  content       TEXT NOT NULL,
  read          BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender    ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages (recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created   ON public.messages (created_at);

-- -----------------------------------------------
-- Table: notifications
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  type        TEXT NOT NULL DEFAULT 'info',
  read        BOOLEAN NOT NULL DEFAULT false,
  deal_id     UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications (user_id, read);
