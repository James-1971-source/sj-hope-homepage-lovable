import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, Phone, ChevronDown } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";
const navigation = [{
  name: "기관소개",
  href: "/about",
  children: [{
    name: "인사말",
    href: "/about"
  }, {
    name: "미션과 비전",
    href: "/about/mission"
  }, {
    name: "연혁",
    href: "/about/history"
  }, {
    name: "조직도",
    href: "/about/organization"
  }, {
    name: "시설안내",
    href: "/about/facilities"
  }]
}, {
  name: "사업소개",
  href: "/programs",
  children: [
    { name: "글로벌 드림 프로젝트", href: "/programs?category=global-dream" },
    { name: "IT 교육 지원 사업", href: "/programs?category=it-education" },
    { name: "외국어 교육 지원 사업", href: "/programs?category=language-education" },
    { name: "교육비 지원 사업", href: "/programs?category=education-expense" },
    { name: "문화체험 지원 사업", href: "/programs?category=culture-experience" },
    { name: "아동복지시설 지원 사업", href: "/programs?category=child-welfare" },
    { name: "IT 교육장 구축 지원 사업", href: "/programs?category=it-facility" },
  ]
}, {
  name: "소식",
  href: "/news",
  children: [{
    name: "공지사항",
    href: "/news"
  }, {
    name: "활동소식",
    href: "/news?category=activity"
  }, {
    name: "행사안내",
    href: "/news?category=event"
  }]
}, {
  name: "갤러리",
  href: "/gallery"
}, {
  name: "참여",
  href: "/donate",
  children: [{
    name: "후원하기",
    href: "/donate"
  }, {
    name: "자원봉사",
    href: "/volunteer"
  }]
}, {
  name: "자료실",
  href: "/resources"
}, {
  name: "문의",
  href: "/contact"
}];
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const { settings } = useSiteSettings();
  
  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };
  return <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top Bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container-wide flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-primary-foreground/80 transition-colors">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{settings.phone}</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/donate" className="flex items-center gap-1 hover:text-primary-foreground/80 transition-colors">
              <Heart className="h-3.5 w-3.5" />
              <span>후원하기</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-wide">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {settings.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.org_name} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-contain"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg md:text-xl">S&J</span>
              </div>
            )}
            <div className="hidden sm:block">
              <p className="font-bold text-lg text-foreground">{settings.org_name}</p>
              <p className="text-xs text-muted-foreground">{settings.org_subtitle}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map(item => <NavigationMenuItem key={item.name}>
                    {item.children ? <>
                        <NavigationMenuTrigger className={cn("bg-transparent hover:bg-muted", isActive(item.href) && "text-primary")}>
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-48 gap-1 p-2">
                            {item.children.map(child => <li key={child.name}>
                                <NavigationMenuLink asChild>
                                  <Link to={child.href} className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-primary focus:bg-muted">
                                    <span className="text-sm font-medium">{child.name}</span>
                                  </Link>
                                </NavigationMenuLink>
                              </li>)}
                          </ul>
                        </NavigationMenuContent>
                      </> : <Link to={item.href} className={cn("flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted hover:text-primary", isActive(item.href) && "text-primary")}>
                        {item.name}
                      </Link>}
                  </NavigationMenuItem>)}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/contact">문의하기</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/donate">
                <Heart className="h-4 w-4" />
                후원하기
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button type="button" className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="메뉴 열기">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="lg:hidden border-t border-border bg-card animate-slide-down">
          <div className="container-wide py-4 space-y-2">
            {navigation.map(item => <div key={item.name}>
                {item.children ? <div>
                    <button onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)} className={cn("flex items-center justify-between w-full px-4 py-3 text-left font-medium rounded-lg hover:bg-muted transition-colors", isActive(item.href) && "text-primary")}>
                      {item.name}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", openSubmenu === item.name && "rotate-180")} />
                    </button>
                    {openSubmenu === item.name && <div className="ml-4 mt-1 space-y-1">
                        {item.children.map(child => <Link key={child.name} to={child.href} className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            {child.name}
                          </Link>)}
                      </div>}
                  </div> : <Link to={item.href} className={cn("block px-4 py-3 font-medium rounded-lg hover:bg-muted transition-colors", isActive(item.href) && "text-primary")} onClick={() => setMobileMenuOpen(false)}>
                    {item.name}
                  </Link>}
              </div>)}
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>문의하기</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link to="/donate" onClick={() => setMobileMenuOpen(false)}>
                  <Heart className="h-4 w-4" />
                  후원하기
                </Link>
              </Button>
            </div>
          </div>
        </div>}
    </header>;
}