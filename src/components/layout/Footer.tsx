import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Mail, Clock } from "lucide-react";

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
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Band */}
      <div className="bg-primary">
        <div className="container-wide py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                함께하면 더 큰 희망이 됩니다
              </h3>
              <p className="text-primary-foreground/90">
                청소년들의 밝은 미래를 위한 여러분의 따뜻한 관심이 필요합니다.
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
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S&J</span>
              </div>
              <div>
                <p className="font-bold text-lg">S&J희망나눔</p>
                <p className="text-xs text-secondary-foreground/70">사단법인 에스엔제이희망나눔</p>
              </div>
            </Link>
            <div className="space-y-3 text-sm text-secondary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>서울특별시 OO구 OO로 123, 4층</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>02-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contact@sj-hs.or.kr</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>평일 09:00 - 18:00<br/>점심시간 12:00 - 13:00</span>
              </div>
            </div>
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
              <p>© 2024 사단법인 S&J희망나눔. All rights reserved.</p>
              <p className="mt-1">사업자등록번호: XXX-XX-XXXXX | 고유번호: XXX-XX-XXXXX</p>
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
