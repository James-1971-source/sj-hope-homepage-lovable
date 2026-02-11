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
import { supabase } from "@/integrations/supabase/client";
import { donationSchema } from "@/lib/formSchemas";
import { z } from "zod";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const donationAmounts = [10000, 30000, 50000, 100000];

export default function Donate() {
  const { settings } = useSiteSettings();
  const [donationType, setDonationType] = useState("regular");
  const [amount, setAmount] = useState(30000);
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || "",
      donation_type: donationType === "regular" ? "정기후원" : "일시후원",
      message: (formData.get("message") as string) || "",
    };

    try {
      const validated = donationSchema.parse(data);
      const { error } = await supabase.from("donation_inquiries").insert({
        name: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        donation_type: validated.donation_type,
        message: validated.message || null,
      });
      
      setIsSubmitting(false);
      if (error) {
        toast.error("오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        toast.success("후원 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    }
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
                      <Input id="name" name="name" placeholder="홍길동" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input id="phone" name="phone" placeholder="010-0000-0000" required />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" name="email" type="email" placeholder="example@email.com" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="message">응원 메시지</Label>
                      <Textarea
                        id="message"
                        name="message"
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
                    <p className="font-semibold text-foreground">{settings.donate_bank_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">계좌번호</p>
                    <p className="font-semibold text-foreground">{settings.donate_account_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">예금주</p>
                    <p className="font-semibold text-foreground">{settings.donate_account_holder}</p>
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
                  {settings.donate_benefits.split('\n').filter(Boolean).map((benefit) => (
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
                  {settings.donate_usage.split('\n').filter(Boolean).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
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
                <p className="font-semibold text-foreground">{settings.donate_contact_phone}</p>
                <p className="text-muted-foreground">{settings.donate_contact_email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
