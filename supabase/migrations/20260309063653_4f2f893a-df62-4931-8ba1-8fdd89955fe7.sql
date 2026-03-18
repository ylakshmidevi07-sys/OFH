
-- Referral codes table: unique code per user
CREATE TABLE public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Users can view their own referral code
CREATE POLICY "Users can view own referral code"
  ON public.referral_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own referral code
CREATE POLICY "Users can insert own referral code"
  ON public.referral_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Anyone can look up a referral code (for validation at checkout)
CREATE POLICY "Anyone can look up referral codes"
  ON public.referral_codes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Referral conversions table: tracks when referral leads to purchase
CREATE TABLE public.referral_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL,
  referee_user_id uuid,
  order_id uuid,
  referral_code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;

-- Users can view conversions where they are the referrer
CREATE POLICY "Users can view own referral conversions"
  ON public.referral_conversions FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_user_id);

-- Authenticated users can insert conversions
CREATE POLICY "Users can insert referral conversions"
  ON public.referral_conversions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can view all conversions
CREATE POLICY "Admins can view all referral conversions"
  ON public.referral_conversions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all referral codes
CREATE POLICY "Admins can view all referral codes"
  ON public.referral_codes FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
