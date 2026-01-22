import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronRight, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from("contact_messages" as any).insert({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    });
    
    setIsSubmitting(false);
    if (error) {
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } else {
      toast.success("문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.");
      (e.target as HTMLFormElement).reset();
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
            <span>문의</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            문의 / 오시는 길
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            궁금하신 점이 있으시면 언제든지 연락해 주세요.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">문의하기</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input id="name" placeholder="홍길동" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처 *</Label>
                    <Input id="phone" placeholder="010-0000-0000" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" type="email" placeholder="example@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">문의 제목 *</Label>
                  <Input id="subject" placeholder="문의 제목을 입력해 주세요" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">문의 내용 *</Label>
                  <Textarea
                    id="message"
                    placeholder="문의하실 내용을 자세히 적어주세요"
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <Send className="h-4 w-4" />
                  문의 보내기
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">연락처 정보</h2>
              <div className="space-y-6 mb-8">
                <div className="card-warm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">주소</h3>
                    <p className="text-muted-foreground">
                      서울특별시 OO구 OO로 123, 4층<br />
                      (OO동, OO빌딩)
                    </p>
                  </div>
                </div>

                <div className="card-warm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">전화</h3>
                    <p className="text-muted-foreground">
                      02-XXX-XXXX<br />
                      FAX: 02-XXX-XXXX
                    </p>
                  </div>
                </div>

                <div className="card-warm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">이메일</h3>
                    <p className="text-muted-foreground">
                      contact@sj-hs.or.kr
                    </p>
                  </div>
                </div>

                <div className="card-warm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">운영시간</h3>
                    <p className="text-muted-foreground">
                      평일: 09:00 - 18:00<br />
                      점심시간: 12:00 - 13:00<br />
                      주말 및 공휴일 휴무
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <h2 className="text-2xl font-bold text-foreground mb-6">오시는 길</h2>
              <div className="card-warm p-0 overflow-hidden">
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  {/* Placeholder for map - in production, embed actual map */}
                  <div className="text-center p-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      지도가 여기에 표시됩니다.<br />
                      (카카오맵 또는 네이버 지도 임베드)
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>대중교통:</strong> 지하철 O호선 OO역 O번 출구에서 도보 5분<br />
                    <strong>버스:</strong> OOO, OOO, OOO번 버스 OO정류장 하차
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
