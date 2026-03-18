
-- Fix profiles table: drop RESTRICTIVE policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix saved_payment_methods table
DROP POLICY IF EXISTS "Users can view their own payment methods" ON public.saved_payment_methods;
DROP POLICY IF EXISTS "Users can insert their own payment methods" ON public.saved_payment_methods;
DROP POLICY IF EXISTS "Users can update their own payment methods" ON public.saved_payment_methods;
DROP POLICY IF EXISTS "Users can delete their own payment methods" ON public.saved_payment_methods;

CREATE POLICY "Users can view their own payment methods" ON public.saved_payment_methods FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payment methods" ON public.saved_payment_methods FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payment methods" ON public.saved_payment_methods FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payment methods" ON public.saved_payment_methods FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix addresses table
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;

CREATE POLICY "Users can view their own addresses" ON public.addresses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses" ON public.addresses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON public.addresses FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON public.addresses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix role_audit_log table
DROP POLICY IF EXISTS "Admins can view audit log" ON public.role_audit_log;

CREATE POLICY "Admins can view audit log" ON public.role_audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix user_activity_log table
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.user_activity_log;
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity_log;
DROP POLICY IF EXISTS "Service role can insert activity" ON public.user_activity_log;

CREATE POLICY "Admins can view all activity logs" ON public.user_activity_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own activity" ON public.user_activity_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.user_activity_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
