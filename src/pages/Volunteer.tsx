import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, Users, Calendar, Clock, MapPin, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { volunteerSchema } from "@/lib/formSchemas";
import { z } from "zod";

const volunteerAreas = [
  { id: "learning", name: "학습지도", description: "청소년 학습 멘토링, 과목별 지도" },
  { id: "counseling", name: "상담지원", description: "또래상담, 정서지원 활동" },
  { id: "culture", name: "문화활동", description: "예술, 음악, 체육 활동 진행" },
  { id: "admin", name: "행정지원", description: "사무보조, 행사 지원" },
];

const faqs = [
  {
    q: "자원봉사 신청 조건이 있나요?",
    a: "만 18세 이상이면 누구나 신청 가능합니다. 학습지도의 경우 대학생 이상을 권장하며, 범죄경력 조회 동의가 필요합니다.",
  },
  {
    q: "활동 시간은 어떻게 되나요?",
    a: "평일 오후 3시~8시, 주말 오전 10시~오후 5시 사이에 주로 활동합니다. 본인의 일정에 맞게 조율 가능합니다.",
  },
  {
    q: "사전 교육이 있나요?",
    a: "네, 첫 활동 전 2시간 정도의 오리엔테이션과 기본 교육이 진행됩니다.",
  },
  {
    q: "봉사활동 확인서를 발급받을 수 있나요?",
    a: "네, 1365 자원봉사포털과 연계하여 봉사시간이 인정되며, 별도의 확인서 발급도 가능합니다.",
  },
];

export default function Volunteer() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((id) => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const areas = selectedAreas.map(id => volunteerAreas.find(a => a.id === id)?.name).join(", ");
    
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      availability: `희망분야: ${areas}\n희망요일: ${formData.get("preferred-day")}\n희망시간: ${formData.get("preferred-time")}`,
      message: `경험: ${formData.get("experience")}\n지원동기: ${formData.get("motivation")}`,
    };

    try {
      const validated = volunteerSchema.parse(data);
      const { error } = await supabase.from("volunteer_applications").insert({
        name: validated.name,
        phone: validated.phone,
        email: validated.email,
        availability: validated.availability,
        message: validated.message,
      });
      
      setIsSubmitting(false);
      if (error) {
        toast.error("오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        toast.success("자원봉사 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
        (e.target as HTMLFormElement).reset();
        setSelectedAreas([]);
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
            <span>자원봉사</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
            자원봉사
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground/80 max-w-2xl">
            청소년들과 함께 성장하는 특별한 경험을 해보세요.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div className="card-warm">
                  <h3 className="text-xl font-bold text-foreground mb-6">신청자 정보</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름 *</Label>
                      <Input id="name" name="name" placeholder="홍길동" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birth">생년월일 *</Label>
                      <Input id="birth" name="birth" placeholder="1990-01-01" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input id="phone" name="phone" placeholder="010-0000-0000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일 *</Label>
                      <Input id="email" name="email" type="email" placeholder="example@email.com" required />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="occupation">직업/소속</Label>
                      <Input id="occupation" name="occupation" placeholder="대학생, 직장인 등" />
                    </div>
                  </div>
                </div>

                {/* Volunteer Area */}
                <div className="card-warm">
                  <h3 className="text-xl font-bold text-foreground mb-6">희망 활동 분야</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {volunteerAreas.map((area) => (
                      <Label
                        key={area.id}
                        htmlFor={area.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          selectedAreas.includes(area.id) ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <Checkbox
                          id={area.id}
                          checked={selectedAreas.includes(area.id)}
                          onCheckedChange={() => handleAreaToggle(area.id)}
                        />
                        <div>
                          <span className="font-semibold text-foreground">{area.name}</span>
                          <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
                        </div>
                      </Label>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div className="card-warm">
                  <h3 className="text-xl font-bold text-foreground mb-6">희망 활동 시간</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferred-day">희망 요일</Label>
                      <Input id="preferred-day" name="preferred-day" placeholder="예: 월, 수, 금" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferred-time">희망 시간대</Label>
                      <Input id="preferred-time" name="preferred-time" placeholder="예: 오후 3시 ~ 6시" />
                    </div>
                  </div>
                </div>

                {/* Additional */}
                <div className="card-warm">
                  <h3 className="text-xl font-bold text-foreground mb-6">추가 정보</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">관련 경험</Label>
                      <Textarea
                        id="experience"
                        name="experience"
                        placeholder="자원봉사, 교육, 상담 등 관련 경험이 있으시면 적어주세요"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motivation">지원 동기</Label>
                      <Textarea
                        id="motivation"
                        name="motivation"
                        placeholder="자원봉사에 참여하고자 하는 이유를 적어주세요"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="agree" required />
                  <Label htmlFor="agree" className="text-sm text-muted-foreground">
                    개인정보 수집 및 이용에 동의합니다. (필수)
                  </Label>
                </div>

                <Button type="submit" variant="cta" className="w-full">
                  <Users className="h-5 w-5" />
                  자원봉사 신청하기
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Info Cards */}
              <div className="card-warm bg-warm-orange-light">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  모집 안내
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">모집 기간</p>
                      <p className="text-sm text-muted-foreground">상시 모집</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">활동 시간</p>
                      <p className="text-sm text-muted-foreground">주 1~2회, 2~3시간</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">활동 장소</p>
                      <p className="text-sm text-muted-foreground">S&J희망나눔 센터</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Benefits */}
              <div className="card-warm">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  활동 혜택
                </h3>
                <ul className="space-y-3">
                  {[
                    "1365 자원봉사시간 인정",
                    "활동 확인서 발급",
                    "정기 봉사자 간담회",
                    "우수 봉사자 포상",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ */}
              <div className="card-warm">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  자주 묻는 질문
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-sm">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
