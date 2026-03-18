
-- Tighten referral_conversions insert: only allow inserting where referee is the current user
DROP POLICY "Users can insert referral conversions" ON public.referral_conversions;
CREATE POLICY "Users can insert referral conversions"
  ON public.referral_conversions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referee_user_id);
