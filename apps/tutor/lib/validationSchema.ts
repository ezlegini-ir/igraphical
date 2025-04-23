import { z } from "zod";

const requiredMessage = "Required";

//! LOGIN FORM
export const loginFormSchema = z.object({
  phoneOrEmail: z
    .string()
    .trim()
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?\d{11,15}$/;

      return emailRegex.test(val) || phoneRegex.test(val);
    }, "invalid phone or emai"),
  password: z.string().min(8, { message: requiredMessage }),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;
// --------------
export const otpFormSchema = z.object({
  otp: z.string().min(6),
});
export type OtpType = z.infer<typeof otpFormSchema>;

//! QA FORM
export const QaFormSchema = z.object({
  message: z.string(),
  file: z.instanceof(File).optional(),
});
export type QaFormType = z.infer<typeof QaFormSchema>;
