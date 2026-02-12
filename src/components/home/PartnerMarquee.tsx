import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  link_url: string | null;
}

export default function PartnerMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("partner_organizations")
        .select("id, name, logo_url, link_url")
        .eq("is_active", true)
        .order("display_order");
      setPartners(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading || partners.length === 0) return null;

  const LogoItem = ({ partner }: { partner: Partner }) => {
    const img = (
      <img
        src={partner.logo_url}
        alt={partner.name}
        className="h-10 md:h-12 w-auto max-w-[160px] object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
      />
    );

    return partner.link_url ? (
      <a
        href={partner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 px-6 md:px-8 flex items-center"
        title={partner.name}
      >
        {img}
      </a>
    ) : (
      <span className="flex-shrink-0 px-6 md:px-8 flex items-center" title={partner.name}>
        {img}
      </span>
    );
  };

  return (
    <section className="py-8 md:py-10 bg-muted/50 border-t border-border/50 overflow-hidden">
      <div className="container-wide mb-6">
        <h3 className="text-lg md:text-xl font-bold text-foreground">함께하는 기관</h3>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {/* Duplicate list for seamless loop */}
          {[...partners, ...partners].map((partner, idx) => (
            <LogoItem key={`${partner.id}-${idx}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
