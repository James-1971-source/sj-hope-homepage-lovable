import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Mail, Clock, Globe, Youtube, Instagram, Facebook } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const footerLinks = {
  기관: [
    { name: "인사말", href: "/about" },
    { name: "미션과 비전", href: "/about/mission" },
    { name: "연혁", href: "/about/history" },
    { name: "조직도", href: "/about/organization" },
  ],
  사업: [
    { name: "전체 프로그램", href: "/programs" },
    { name: "학습지원", href: "/programs?category=education" },
    { name: "상담·복지", href: "/programs?category=counseling" },
    { name: "문화·체험", href: "/programs?category=culture" },
  ],
  참여: [
    { name: "후원하기", href: "/donate" },
    { name: "자원봉사", href: "/volunteer" },
    { name: "갤러리", href: "/gallery" },
    { name: "자료실", href: "/resources" },
  ],
  안내: [
    { name: "공지사항", href: "/news" },
    { name: "오시는 길", href: "/contact" },
    { name: "개인정보처리방침", href: "/privacy" },
    { name: "이용약관", href: "/terms" },
  ],
};

export default function Footer() {
  const { settings } = useSiteSettings();

  const snsLinks = [
    { name: "Blog", url: settings.footer_sns_blog, icon: Globe },
    { name: "YouTube", url: settings.footer_sns_youtube, icon: Youtube },
    { name: "Instagram", url: settings.footer_sns_instagram, icon: Instagram },
    { name: "Facebook", url: settings.footer_sns_facebook, icon: Facebook },
  ].filter((s) => s.url);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Band */}
      <div className="bg-primary">
        <div className="container-wide py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                {settings.footer_cta_title}
              </h3>
              <p className="text-primary-foreground/90">
                {settings.footer_cta_subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/donate"
                className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary font-bold px-8 py-4 rounded-xl hover:bg-primary-foreground/90 transition-colors"
              >
                <Heart className="h-5 w-5" />
                후원하기
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground text-primary-foreground font-bold px-8 py-4 rounded-xl hover:bg-primary-foreground/10 transition-colors"
              >
                자원봉사 신청
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Logo & Info */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.footer_org_name}
                  className="w-10 h-10 rounded-xl object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">S&J</span>
                </div>
              )}
              <div>
                <p className="font-bold text-lg">{settings.footer_org_name}</p>
                <p className="text-xs text-secondary-foreground/70">{settings.footer_org_subtitle}</p>
              </div>
            </Link>
            <div className="space-y-3 text-sm text-secondary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{settings.footer_address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{settings.footer_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{settings.footer_email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="whitespace-pre-line">{settings.footer_work_hours}</span>
              </div>
            </div>

            {/* SNS Links */}
            {snsLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {snsLinks.map((sns) => {
                  const Icon = sns.icon;
                  return (
                    <a
                      key={sns.name}
                      href={sns.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center text-secondary-foreground/70 hover:text-primary-foreground hover:bg-secondary-foreground/20 transition-colors"
                      title={sns.name}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-lg mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-secondary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/60">
            <div className="text-center md:text-left">
              <p>{settings.footer_copyright}</p>
              <p className="mt-1">{settings.footer_org_number}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
                개인정보처리방침
              </Link>
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
