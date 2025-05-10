import { convertPersianDigitsToEnglish } from "@igraph/utils";
import z from "zod";

const required = "این فیلد الزامی می باشد";
export const ticketDepartment = [
  "TECHNICAL",
  "FINANCE",
  "COURSE",
  "SUGGEST",
] as const;

//! User Forms
export const loginFormSchema = z.object({
  phoneOrEmail: z
    .string()
    .trim()
    .min(1, required)
    .refine(
      (val) => {
        const normalized = convertPersianDigitsToEnglish(val);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{10,15}$/; // For international numbers

        return emailRegex.test(normalized) || phoneRegex.test(normalized);
      },
      {
        message: "شماره تماس یا ایمیل معتبر نیست",
      }
    ),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;

// --------------

export const otpSchema = z.object({
  otp: z.string().min(6, { message: "کد احراز هویت 5 رقمی می باشد" }),
});
export type OtpType = z.infer<typeof otpSchema>;

// --------------

const toEnglishDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

export const registerUserFormSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "حداقل 3 حرف" })
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است")
    .trim(),

  lastName: z
    .string()
    .min(3, { message: "حداقل 3 حرف" })
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است")
    .trim(),

  phone: z
    .string()
    .transform(toEnglishDigits)
    .refine((val) => /^0\d{10}$/.test(val), {
      message: "شماره باید با 0 شروع شود و 11 رقم باشد",
    }),

  email: z
    .string()
    .min(1, { message: "ایمیل ضروری است" })
    .email({ message: "ایمیل نامعتبر است" }),

  nationalId: z
    .string()
    .transform(toEnglishDigits)
    .refine((val) => /^\d{10}$/.test(val), {
      message: "کد ملی باید دقیقا 10 رقم باشد",
    }),
});

export type RegisterUserFormType = z.infer<typeof registerUserFormSchema>;

// --------------

export const profileFormSchema = z.object({
  image: z.instanceof(File).optional(),
  firstName: z
    .string()
    .min(3, { message: "حداقل 3 حرف" })
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است")
    .trim(),
  lastName: z
    .string()
    .min(3, { message: "حداقل 3 حرف" })
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است")
    .trim(),
  phone: z
    .string()
    .min(1, { message: required })
    .min(11, "شماره تماس باید  11 رقم باشد و با صفر شروع شود")
    .regex(/^0[0-9]{10,14}$/, "شماره باید با 0 شروع شود و فقط عدد باشد")
    .trim(),
  email: z
    .string()
    .min(1, { message: required })
    .email({ message: "ایمیل نامعتبر است" }),
  nationalId: z.string().min(1, { message: required }).max(10),
});
export type ProfileFormType = z.infer<typeof profileFormSchema>;

//! CART FORM
export const discountFormSchema = z.object({
  code: z.string().min(1),
});
export type DiscountFormType = z.infer<typeof discountFormSchema>;

// --------------

export const paymentFormSchema = z.object({
  cardNumber: z.string().min(1, { message: "شماره کارت الزامی می باشد" }),
});
export type PaymentFormType = z.infer<typeof paymentFormSchema>;

//! CONTACT FORM
export const contactFormSchema = z.object({
  fullName: z.string().min(1, { message: required }),
  phone: z
    .string()
    .min(1, { message: required })
    .min(10, { message: "شماره تماس باید 10 رقمی باشد" }),
  email: z.string().min(1, { message: required }).email(),
  subject: z.string().min(1, { message: required }),
  message: z.string().min(1, { message: required }),
});
export type ContactFormType = z.infer<typeof contactFormSchema>;

//! COURSE RATING FORM
export const courseReviewFormSchema = z.object({
  rating: z.number().min(1, { message: "لطفا برای این دوره امتیازی ثبت کنید" }),
  review: z.string().min(1, { message: required }),
});
export type CourseReviewFormType = z.infer<typeof courseReviewFormSchema>;

//! TICKET FORM
export const ticketFormSchema = z.object({
  subject: z.string().min(1, { message: required }),
  department: z.enum(ticketDepartment),
  message: z.string().min(1, { message: required }),
  file: z.instanceof(File).optional(),
});
export type TicketFormType = z.infer<typeof ticketFormSchema>;

// --------------

export const ticketMessageFormSchema = z.object({
  message: z.string().min(1, { message: required }),
  file: z.instanceof(File).optional(),
});
export type TicketMessageFormType = z.infer<typeof ticketMessageFormSchema>;

//! CLASSROAM FORM
export const askTutorFormSchema = z.object({
  message: z.string().min(1, { message: required }),
  file: z.instanceof(File).optional(),
});
export type AskTutorFormType = z.infer<typeof askTutorFormSchema>;

//! COMMENT FORM
export const commentFormSchema = z.object({
  content: z.string().min(1, { message: required }),
  postId: z.number(),
  fullName: z.string(),
  userId: z.number().optional(),
});
export type CommentFormType = z.infer<typeof commentFormSchema>;
