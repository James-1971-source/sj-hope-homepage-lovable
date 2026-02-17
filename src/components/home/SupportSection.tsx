import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, Gift, ArrowRight } from "lucide-react";

const supportWays = [
  {
    icon: Heart,
    title: "정기후원",
    description: "매월 정기적인 후원으로 청소년들의 꾸준한 성장을 지원해 주세요.",
    cta: "정기후원 신청",
    link: "/donate?type=regular",
  },
  {
    icon: Gift,
    title: "일시후원",
    description: "원하실 때 원하는 금액으로 청소년들에게 희망을 전해주세요.",
    cta: "일시후원 하기",
    link: "/donate?type=once",
  },
  {
    icon: Users,
    title: "자원봉사",
    description: "시간과 재능을 나눠 청소년들의 성장에 함께 해주세요.",
    cta: "봉사 신청하기",
    link: "/volunteer",
  },
];

export default function SupportSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            함께하기
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            여러분의 관심이 희망이 됩니다
          </h2>
          <p className="text-muted-foreground text-lg">
            후원과 봉사를 통해 청소년들의 밝은 미래를 함께 만들어 주세요.
          </p>
        </div>

        {/* Support Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {supportWays.map((item, index) => (
            <div
              key={item.title}
              className="card-warm text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors">
                <item.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground mb-6">{item.description}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link to={item.link}>
                  {item.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
