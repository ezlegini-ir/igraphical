"use client";

import { EnrollmentFormType } from "@/lib/validationSchema";
import { useState } from "react";

import { createPayment, updatePayment } from "@/actions/payment";
import { Form } from "@igraph/ui/components/ui/form";
import { paymentFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Course,
  Enrollment,
  Image,
  Payment,
  Tutor,
  User,
  Wallet,
} from "@igraph/database";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PaymentFormBody from "./PaymentFormBody";
import PaymentFormSidebar from "./PaymentFormSidebar";

export interface CourseType extends Course {
  image: Image | null;
  tutor: (Tutor & { image: Image | null }) | null;
}

export interface PaymentType extends Payment {
  user: User;
  enrollment: (Enrollment & { course: Course })[];
}

interface Props {
  payment?: PaymentType;
  type: "UPDATE" | "NEW";
}

const PaymentForm = ({ payment, type }: Props) => {
  // HOOKS
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [selectedCourses, setSelectedCourses] = useState<CourseType[]>([]);

  const [prices, setPrices] = useState<
    { price: number; originalPrice: number }[]
  >(
    payment?.enrollment.map((item) => ({
      price: item.price,
      originalPrice: item.courseOriginalPrice,
    })) || []
  );

  //! MANAGE FORM
  const form = useForm<EnrollmentFormType>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      courses: payment?.enrollment
        ? payment.enrollment.map((item) => ({
            courseId: item.courseId,
            price: item.price,
            originalPrice: item.courseOriginalPrice,
          }))
        : [{ courseId: 0, price: 0, originalPrice: 0 }],
      enrolledAt: payment?.paidAt || new Date(),
      userId: payment?.userId || 0,
      payment: payment
        ? {
            discountAmount: payment.discountAmount || 0,
            discountCode: payment.discountCode || "",
            discountCodeAmount: payment.discountCodeAmount || 0,
            paymentMethod: payment.paymentMethod || "ADMIN",
            total: payment.total || 0,
            itemsTotal: payment.itemsTotal || 0,
            status: payment.status || "SUCCESS",
          }
        : {
            discountAmount: 0,
            discountCode: "",
            discountCodeAmount: 0,
            paymentMethod: "ADMIN",
            total: 0,
            itemsTotal: 0,
            status: "SUCCESS",
            usedWallet: false,
            usedWalletAmount: undefined,
            chargeWallet: true,
          },
    },
  });

  const onSubmit = async (data: EnrollmentFormType) => {
    if (type === "NEW") {
      const coursesWithPrices = data.courses.map((course, index) => ({
        ...course,
        price: prices?.[index]?.price ?? 0,
        originalPrice: prices?.[index].originalPrice ?? 0,
      }));
      data.courses = coursesWithPrices;

      const res = await createPayment(data);

      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (res.success) {
        toast.success(res.success);
        router.push(`/enrollments/payments/${res.payment}`);
      }
    } else {
      const res = await updatePayment(data, payment?.id!);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.success) {
        toast.success(res.success);
        router.refresh();
      }
    }
  };

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 grid-cols-12">
            <PaymentFormBody
              setWallet={setWallet}
              payment={payment}
              form={form}
              type={type}
              prices={prices}
              setPrices={setPrices}
              setSelectedUser={setSelectedUser}
              setSelectedCourses={setSelectedCourses}
              selectedCourses={selectedCourses}
            />
            <PaymentFormSidebar
              wallet={wallet}
              selectedCourses={selectedCourses}
              setPrices={setPrices}
              form={form}
              type={type}
              selectedUser={selectedUser}
              prices={prices}
              payment={payment}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
