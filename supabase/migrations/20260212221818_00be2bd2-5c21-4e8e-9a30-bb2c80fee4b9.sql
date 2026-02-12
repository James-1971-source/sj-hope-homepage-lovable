
CREATE TABLE public.partner_organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  link_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active partners" ON public.partner_organizations
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage partners" ON public.partner_organizations
  FOR ALL USING (public.is_admin());

CREATE TRIGGER update_partner_organizations_updated_at
  BEFORE UPDATE ON public.partner_organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
