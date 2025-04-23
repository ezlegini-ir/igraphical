import z from "zod";

const requiredMessage = "Required";
export const adminRoles = ["ADMIN", "AUTHOR"] as const;
export const status = ["1", "0"] as const;
export const lessonsType = ["FILE", "VIDEO", "ASSET"] as const;
export const settlementStatus = ["PENDING", "PAID"] as const;
export const paymentStatus = [
  "PENDING",
  "SUCCESS",
  "CANCELED",
  "FAILED",
] as const;
export const enrollmentStatus = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
] as const;
export const paymentMethod = [
  "ZARRIN_PAL",
  "MELLI",
  "ADMIN",
  "NO_METHOD",
] as const;
export const couponType = [
  "FIXED_ON_COURSE",
  "FIXED_ON_CART",
  "PERCENT",
] as const;
export const ticketStatus = ["PENDING", "CLOSED", "REPLIED"] as const;
export const ticketDepartment = [
  "TECHNICAL",
  "FINANCE",
  "COURSE",
  "SUGGEST",
] as const;
const image = z
  .instanceof(File)
  .optional()
  .refine((file) => !file || file.size <= 4 * 1024 * 1024, {
    message: "Image size must be less than 4MB",
  });

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

//! POSTS
export const postFormSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1).trim(),
  image,
  content: z.string().min(1),
  categories: z.array(z.string()),
  status: z.enum(status),
  author: z.string().min(1),
});
export type PostFormType = z.infer<typeof postFormSchema>;
// --------------
export const categoryFormSchema = z.object({
  name: z.string().min(1),
  url: z.string().optional(),
});
export type CategoryFormType = z.infer<typeof categoryFormSchema>;
// --------------
export const commentFormSchema = z.object({
  content: z.string().min(1),
  userId: z.number().optional(),
  postId: z.number(),
  date: z.date(),
});
export type CommentFormType = z.infer<typeof commentFormSchema>;

//! COURSES
export const courseFormSchema = z.object({
  title: z.string().min(1, requiredMessage),
  url: z.string().min(1, requiredMessage),
  summary: z.string().min(1, requiredMessage),
  needs: z.string().min(1, requiredMessage),
  jobMarket: z.string().min(1, requiredMessage),
  audience: z.string().min(1, requiredMessage),
  description: z.string().min(1, requiredMessage),
  status: z.enum(status, { required_error: requiredMessage }),
  tutorId: z.string().min(1, requiredMessage),
  tizerUrl: z.string().url(),
  duration: z.number().min(1, requiredMessage),
  image: z.instanceof(File, { message: requiredMessage }).optional(),
  categoryId: z.string().min(1, requiredMessage),
  basePrice: z.number().min(0, requiredMessage),

  // Learns Schema
  learns: z
    .array(z.object({ value: z.string().min(1, requiredMessage) }))
    .optional(),

  // Prerequisite Schema
  prerequisite: z
    .array(z.object({ value: z.string().min(1, requiredMessage) }))
    .optional(),

  // Discount Schema
  discount: z
    .object({
      amount: z
        .number()
        .min(0, "Discount amount must be a non-negative number"),
      type: z.enum(["FIXED", "PERCENT"], {
        required_error: requiredMessage,
      }),
      date: z
        .object({
          from: z.coerce
            .date({
              invalid_type_error: "Invalid date format for 'from'",
            })
            .optional(),
          to: z.coerce
            .date({
              invalid_type_error: "Invalid date format for 'to'",
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),

  //Curriculum
  curriculum: z
    .array(
      z.object({
        id: z.number().optional(),
        sectionTitle: z.string().min(1, requiredMessage),
        lessons: z.array(
          z.object({
            id: z.number().optional(),
            title: z.string().min(1, requiredMessage),
            duration: z
              .number()
              .min(0, "Lesson duration must be a non-negative number")
              .optional(),
            url: z.string().url(),
            isFree: z.boolean(),
            type: z.enum(lessonsType, { message: "Invalid" }),
          })
        ),
      })
    )
    .optional(),

  // Gallery Schema
  gallery: z
    .array(
      z.instanceof(File, { message: "Each gallery item must be an image file" })
    )
    .optional(),
});
export type CourseFormType = z.infer<typeof courseFormSchema>;
// --------------
export const reviewFormSchema = z.object({
  content: z.string().min(1),
  rate: z.string(),
  userId: z.number().min(1),
  courseId: z.number().min(1),
  date: z.date(),
});
export type ReviewFormType = z.infer<typeof reviewFormSchema>;

//! ANNOUNCEMENTS
export const slidersFormSchema = z.object({
  images: z.array(
    z.object({
      link: z.string().url().optional(),
      image: z.instanceof(File).optional(),
      active: z.boolean(),
    })
  ),
});
export type SlidersFormType = z.infer<typeof slidersFormSchema>;
// --------------
export const notifbarFormSchema = z.object({
  content: z.string().min(1),
  link: z.string().url().optional(),
  bgColor: z.string().min(1),
  textColor: z.string().min(1),
  active: z.boolean(),
});
export type NotifbarFormType = z.infer<typeof notifbarFormSchema>;

//! PAYMENT
export const paymentFormSchema = z.object({
  enrolledAt: z.date().default(new Date()),
  userId: z.number().positive({ message: "User ID is required." }),
  courses: z.array(
    z.object({
      courseId: z.number().positive({ message: "Course ID is required." }),
      originalPrice: z.number(),
      price: z.number(),
    })
  ),
  payment: z.object({
    discountCode: z.string(),
    discountCodeAmount: z.number(),
    discountAmount: z.number(),
    paymentMethod: z.enum(paymentMethod),
    total: z.number(),
    itemsTotal: z.number(),
    status: z.enum(paymentStatus),
    chargeWallet: z.boolean().default(true),
    usedWallet: z.boolean().default(false),
    usedWalletAmount: z.number().optional(),
  }),
});
export type EnrollmentFormType = z.infer<typeof paymentFormSchema>;

//! MARKETING
export const couponFormSchema = z.object({
  code: z.string().trim(),
  type: z.enum(couponType),
  amount: z.number().min(0),
  summery: z.string(),
  date: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  limit: z.number().min(0),
  courseInclude: z.array(z.object({ id: z.number() })).optional(),
  courseExclude: z.array(z.object({ id: z.number() })).optional(),
});
export type CouponFormType = z.infer<typeof couponFormSchema>;

// -------------------------------------

export const overallOffFormSchema = z.object({
  amount: z.number().min(0),
  type: z.enum(couponType),
  active: z.boolean(),
  date: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});
export type OverallOffFormType = z.infer<typeof overallOffFormSchema>;

//! TICKET FORM
export const TicketFormSchema = z.object({
  subject: z.string().min(1),
  userId: z.number().min(1),
  status: z.enum(ticketStatus),
  department: z.enum(ticketDepartment),
  message: z.string().min(1).trim().optional(),
  file: z.instanceof(File).optional(),
});
export type TicketFormType = z.infer<typeof TicketFormSchema>;

//! STUDENT FORM
export const studentFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(11),
  nationalId: z.string().min(10).max(10).optional(),
  image,
});
export type StudentFormType = z.infer<typeof studentFormSchema>;

//! TUTOR FORM
export const tutorFormSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  email: z.string().min(1),
  slug: z.string().min(1),
  phone: z.string().min(1),
  bio: z.string().min(1),
  titles: z.string().min(1),
  profit: z.number().min(0).max(100),
  image,
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 12, {
      message: "Password must be at least 6 characters long",
    }),
});
export type TutorFormType = z.infer<typeof tutorFormSchema>;

export const settlementFormSchema = z.object({
  tutorId: z.string(),
  status: z.enum(settlementStatus),
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
});
export type SettlementFormType = z.infer<typeof settlementFormSchema>;

//! ADMINS
export const adminFormSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  role: z.enum(adminRoles),
  email: z.string().email().min(1),
  image,
  phone: z.string().min(1),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 12, {
      message: "Password must be at least 6 characters long",
    }),
});
export type AdminFormType = z.infer<typeof adminFormSchema>;

//! WALLET ------------------------

export const walletFormSchema = z.object({
  userId: z.number().min(1),
  type: z.enum(["INCREMENT", "DECREMENT"]),
  amount: z.number().min(1),
  description: z.string(),
});
export type WalletFormType = z.infer<typeof walletFormSchema>;
