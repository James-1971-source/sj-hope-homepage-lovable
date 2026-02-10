import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(100, '이름은 100자 이내로 입력해주세요').trim(),
  email: z.string().email('올바른 이메일 주소를 입력해주세요').max(254).trim(),
  subject: z.string().max(200, '제목은 200자 이내로 입력해주세요').trim().optional(),
  message: z.string().min(1, '내용을 입력해주세요').max(2000, '내용은 2000자 이내로 입력해주세요').trim(),
});

export const donationSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(100).trim(),
  phone: z.string().min(1, '연락처를 입력해주세요').regex(/^[0-9\-+() ]{8,20}$/, '올바른 전화번호를 입력해주세요').trim().optional(),
  email: z.string().email('올바른 이메일을 입력해주세요').max(254).optional().or(z.literal('')),
  donation_type: z.string(),
  message: z.string().max(1000, '메시지는 1000자 이내로 입력해주세요').trim().optional().or(z.literal('')),
});

export const volunteerSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(100).trim(),
  phone: z.string().min(1, '연락처를 입력해주세요').regex(/^[0-9\-+() ]{8,20}$/, '올바른 전화번호를 입력해주세요').trim(),
  email: z.string().email('올바른 이메일을 입력해주세요').max(254).trim(),
  availability: z.string().max(500).trim().optional(),
  message: z.string().max(2000).trim().optional(),
});
