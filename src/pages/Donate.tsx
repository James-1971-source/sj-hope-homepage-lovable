import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, Heart, Gift, CreditCard, Building, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const donationAmounts = [10000, 30000, 50000, 100000];

const benefits = [
  "기부금 영수증 발급",
  "후원 소식지 발송 (분기별)",
  "연간 활동보고서 제공",
  "후원자 감사 행사 초대",
];

export default function Donate() {
  const [donationType, setDonationType] = useState("regular");
  const [amount, setAmount] = useState(30000);
  const [customAmount, setCustomAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("후원 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm mb-4">
            <Link to="/" className="hover:text-secondary-foreground">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <span>후원하기</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            후원하기
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            청소년들의 밝은 미래를 위한 여러분의 따뜻한 마음이 필요합니다.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Donation Type */}
                <div className="card-warm">
                  <h3 className="text-xl font-bold text-foreground mb-6">후원 유형</h3>
                  <RadioGroup
                    value={donationType}
                    onValueChange={setDonationType}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="regular"
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        donationType === "regular" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="regular" id="regular" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-primary" />
                          <span className="font-semibold">정기후원</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          매월 정기적으로 후원합니다
                        </p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="once"
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        donationType === "once" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="once" id="once" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Gift className="h-5 w-5 text-primary" />
                          <span className="font-semibold">일시후원</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          원하는 때에 한 번 후원합니다
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Amount */}
                <div className="card-warm">
                  <h3 className="text-xl font-bold text-foreground mb-6">후원 금액</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {donationAmounts.map((amt) => (
                      <Button
                        key={amt}
                        type="button"
                        variant={amount === amt && !customAmount ? "default" : "outline"}
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount("");
                        }}
                        className="h-12"
                      >
                        {amt.toLocaleString()}원
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      placeholder="직접 입력"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(0);
                      }}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">원</span>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="card-warm">
                  <h3 className="text-xl font-bold text-foreground mb-6">후원자 정보</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름 *</Label>
                      <Input id="name" placeholder="홍길동" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input id="phone" placeholder="010-0000-0000" required />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" type="email" placeholder="example@email.com" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="message">응원 메시지</Label>
                      <Textarea
                        id="message"
                        placeholder="청소년들에게 전하고 싶은 응원의 메시지를 남겨주세요"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="cta" className="w-full">
                  <Heart className="h-5 w-5" />
                  후원 신청하기
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Info */}
              <div className="card-warm bg-warm-orange-light">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  계좌 안내
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">은행</p>
                    <p className="font-semibold text-foreground">신한은행</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">계좌번호</p>
                    <p className="font-semibold text-foreground">XXX-XXX-XXXXXX</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">예금주</p>
                    <p className="font-semibold text-foreground">사단법인 S&J희망나눔</p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="card-warm">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  후원 혜택
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Usage */}
              <div className="card-warm">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  후원금 사용처
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 청소년 학습지원 프로그램 운영</li>
                  <li>• 상담 및 복지 서비스 제공</li>
                  <li>• 문화·체험 활동 지원</li>
                  <li>• 교육 자료 및 시설 개선</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="card-warm">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  문의
                </h3>
                <p className="text-muted-foreground mb-2">
                  후원 관련 문의사항이 있으시면 연락해 주세요.
                </p>
                <p className="font-semibold text-foreground">02-XXX-XXXX</p>
                <p className="text-muted-foreground">contact@sj-hs.or.kr</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
