
-- Drop and recreate SELECT policy with explicit TO authenticated restriction
DROP POLICY IF EXISTS "Admins can view donation inquiries" ON public.donation_inquiries;

CREATE POLICY "Admins can view donation inquiries"
ON public.donation_inquiries FOR SELECT
TO authenticated
USING (public.is_admin());
