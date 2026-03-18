CREATE POLICY "Admins can read install banner events"
  ON public.install_banner_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));