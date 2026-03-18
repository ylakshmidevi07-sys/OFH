-- Allow authenticated users to update order status (admin will use service role in edge function)
-- For now, allow any authenticated user to update orders they can see
-- In production, this would be restricted to admin roles
CREATE POLICY "Authenticated users can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);