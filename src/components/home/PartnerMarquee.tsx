import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  link_url: string | null;
}

export default function PartnerMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("partner_organizations")
        .select("id, name, logo_url, link_url")
        .eq("is_active", true)
        .order("display_order");
      setPartners(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || partners.length === 0) return null;

  const LogoItem = ({ partner }: { partner: Partner }) => {
    const img = (
      <img
        src={partner.logo_url}
        alt={partner.name}
        className="h-8 md:h-10 w-auto max-w-[140px] object-contain"
      />
    );

    return partner.link_url ? (
      <a
        href={partner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 px-5 md:px-6 flex items-center"
        title={partner.name}
      >
        {img}
      </a>
    ) : (
      <span className="flex-shrink-0 px-5 md:px-6 flex items-center" title={partner.name}>
        {img}
      </span>
    );
  };

  return (
    <section className="bg-white border-t border-b border-border/40">
      <div className="flex items-center h-14 md:h-16">
        {/* Left: title + controls */}
        <div className="flex-shrink-0 flex items-center gap-2 pl-4 md:pl-8 pr-4 border-r border-border/40 h-full">
          <span className="font-bold text-sm md:text-base text-foreground whitespace-nowrap">함께하는 기관</span>
          <div className="flex items-center gap-0.5 ml-1">
            <button
              onClick={() => setPlaying(true)}
              className={`p-1 rounded transition-colors ${playing ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="재생"
            >
              <Play className="h-3.5 w-3.5" fill={playing ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => setPlaying(false)}
              className={`p-1 rounded transition-colors ${!playing ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="중단"
            >
              <Pause className="h-3.5 w-3.5" fill={!playing ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Right: scrolling logos */}
        <div className="relative flex-1 overflow-hidden h-full">
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div
            ref={scrollRef}
            className="flex items-center h-full w-max"
            style={{
              animation: 'marquee 30s linear infinite',
              animationPlayState: playing ? 'running' : 'paused',
            }}
          >
            {[...partners, ...partners].map((partner, idx) => (
              <LogoItem key={`${partner.id}-${idx}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
