
CREATE TABLE public.install_banner_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.install_banner_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert install banner events"
  ON public.install_banner_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No one can read install banner events from client"
  ON public.install_banner_events
  FOR SELECT
  TO authenticated
  USING (false);
