import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Users, Award, ChevronRight } from "lucide-react";
const values = [{
  icon: Target,
  title: "사명",
  description: "청소년들이 건강하게 성장하고 꿈을 실현할 수 있도록 교육, 상담, 문화 프로그램을 통해 종합적인 지원을 제공합니다."
}, {
  icon: Eye,
  title: "비전",
  description: "모든 청소년이 차별 없이 자신의 잠재력을 발휘하고 건강한 사회구성원으로 성장하는 세상을 만들어 갑니다."
}, {
  icon: Users,
  title: "핵심가치",
  description: "존중, 협력, 성장, 나눔의 가치를 바탕으로 청소년과 지역사회를 연결하는 가교 역할을 수행합니다."
}];
const history = [{
  year: "2015",
  event: "사단법인 S&J희망나눔 설립"
}, {
  year: "2016",
  event: "청소년 학습지원 프로그램 시작"
}, {
  year: "2017",
  event: "OO구청 청소년복지사업 위탁 운영"
}, {
  year: "2018",
  event: "문화예술 체험활동 프로그램 확대"
}, {
  year: "2019",
  event: "청소년 멘토링 사업 시작"
}, {
  year: "2020",
  event: "비대면 교육 프로그램 도입"
}, {
  year: "2021",
  event: "자원봉사자 300명 돌파"
}, {
  year: "2022",
  event: "청소년 상담센터 개소"
}, {
  year: "2023",
  event: "누적 수혜 청소년 5,000명 달성"
}, {
  year: "2024",
  event: "시설 확장 및 프로그램 다양화"
}];
export default function About() {
  return <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <span>기관소개</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            기관소개
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            S&J희망나눔은 청소년들의 건강한 성장과 밝은 미래를 위해 함께합니다.
          </p>
        </div>
      </section>

      {/* Greeting */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              인사말
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-xl leading-relaxed mb-6">
                안녕하세요, 사단법인 S&J희망나눔을 방문해 주셔서 감사합니다.
              </p>
              <p className="leading-relaxed mb-6">
                저희 S&J희망나눔은 2015년 설립 이래 청소년들의 건강한 성장과 자립을 위해 
                학습지원, 상담·복지, 문화·체험 프로그램을 운영하고 있습니다.
              </p>
              <p className="leading-relaxed mb-6">
                모든 청소년들이 환경과 상황에 관계없이 자신의 잠재력을 발휘하고, 
                꿈을 향해 나아갈 수 있도록 최선의 지원을 다하고 있습니다.
              </p>
              <p className="leading-relaxed mb-6">
                많은 분들의 관심과 후원, 그리고 자원봉사자분들의 헌신적인 참여 덕분에 
                지금까지 5,000명이 넘는 청소년들에게 희망의 손길을 전할 수 있었습니다.
              </p>
              <p className="leading-relaxed font-medium text-foreground">
                앞으로도 청소년들의 밝은 미래를 위해 최선을 다하겠습니다.<br />
                감사합니다.
              </p>
              <p className="mt-8 text-right text-foreground font-semibold">사단법인 S&J희망나눔 이사장 윤동성</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-warm-cream">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              미션과 비전
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(item => <div key={item.title} className="card-warm text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>)}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              연혁
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
              {history.map((item, index) => <div key={item.year} className={`relative flex items-center gap-6 mb-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                    {index % 2 === 0 && <div className="card-warm inline-block">
                        <span className="font-bold text-primary">{item.year}</span>
                        <p className="text-muted-foreground mt-1">{item.event}</p>
                      </div>}
                  </div>
                  <div className="relative z-10 w-4 h-4 rounded-full bg-primary border-4 border-background flex-shrink-0 ml-6 md:ml-0" />
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    {index % 2 === 1 ? <div className="card-warm inline-block hidden md:block">
                        <span className="font-bold text-primary">{item.year}</span>
                        <p className="text-muted-foreground mt-1">{item.event}</p>
                      </div> : null}
                    <div className="card-warm md:hidden">
                      <span className="font-bold text-primary">{item.year}</span>
                      <p className="text-muted-foreground mt-1">{item.event}</p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Organization */}
      <section className="section-padding bg-muted/50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              조직도
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="card-warm p-8 text-center">
              <div className="inline-block bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-bold text-lg mb-8">
                이사장
              </div>
              <div className="flex justify-center mb-8">
                <div className="w-0.5 h-8 bg-border" />
              </div>
              <div className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg mb-8">
                사무국장
              </div>
              <div className="flex justify-center mb-8">
                <div className="w-0.5 h-8 bg-border" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["학습지원팀", "상담복지팀", "문화사업팀", "운영지원팀"].map(team => <div key={team} className="bg-muted px-4 py-3 rounded-xl font-medium text-foreground">
                    {team}
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            함께 희망을 나누어 주세요
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            여러분의 관심과 후원이 청소년들에게 밝은 미래를 선물합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/donate">후원하기</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/volunteer">자원봉사 신청</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>;
}