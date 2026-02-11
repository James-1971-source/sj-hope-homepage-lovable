
-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;

-- Recreate with explicit TO authenticated restriction
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (public.is_admin());
