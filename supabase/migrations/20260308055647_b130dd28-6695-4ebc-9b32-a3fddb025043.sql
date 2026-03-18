
-- Create role audit log table
CREATE TABLE public.role_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid NOT NULL,
    actor_email text NOT NULL,
    target_user_id uuid NOT NULL,
    target_email text NOT NULL,
    action text NOT NULL CHECK (action IN ('assign', 'remove', 'invite')),
    role text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit log
CREATE POLICY "Admins can view audit log"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Service role inserts via edge function, no INSERT policy needed for authenticated users
