
-- Create application logs table
CREATE TABLE public.app_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  source TEXT DEFAULT 'frontend',
  user_id UUID,
  session_id TEXT,
  url TEXT,
  user_agent TEXT,
  stack_trace TEXT,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast queries
CREATE INDEX idx_app_logs_created_at ON public.app_logs (created_at DESC);
CREATE INDEX idx_app_logs_level ON public.app_logs (level);
CREATE INDEX idx_app_logs_archived ON public.app_logs (archived);

-- Enable RLS
ALTER TABLE public.app_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert logs (including anonymous/unauthenticated)
CREATE POLICY "Anyone can insert logs"
  ON public.app_logs FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read logs
CREATE POLICY "Authenticated users can read logs"
  ON public.app_logs FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Auto-archive: mark logs older than the latest 3 as archived
CREATE OR REPLACE FUNCTION public.auto_archive_logs()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.app_logs
  SET archived = true
  WHERE archived = false
    AND id NOT IN (
      SELECT id FROM public.app_logs
      ORDER BY created_at DESC
      LIMIT 3
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_auto_archive_logs
  AFTER INSERT ON public.app_logs
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.auto_archive_logs();

-- Enable realtime for logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_logs;
