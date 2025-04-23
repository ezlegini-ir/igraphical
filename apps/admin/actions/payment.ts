"use server";

import { EnrollmentStatusFormType } from "@/components/forms/payment/EnrollmentStatusForm";
import { getCouponByCode } from "@/data/coupon";
import { getAllCoursesByIds } from "@/data/course";
import { getPaymentById } from "@/data/payment";
import { getUserById } from "@/data/user";
import { EnrollmentFormType as PaymentFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import { cashBackCalculator } from "@igraph/utils";

//* CREATE -----------------------------------------------------------

export const createPayment = async (data: PaymentFormType) => {
  const { courses, enrolledAt, userId, payment } = data;

  try {
    const existingUser = await getUserById(userId);
    const existingCourses = await getAllCoursesByIds(
      courses.map((c) => c.courseId)
    );

    if (!existingCourses || !existingUser)
      return { error: "Invalid Ids for Course or User" };

    const newPayment = await database.$transaction(async (tx) => {
      // PAYMENT
      let existingCoupon;
      if (payment?.discountCode) {
        existingCoupon = await getCouponByCode(payment.discountCode);

        if (!existingCoupon) throw new Error("Invalid Coupon Code");
      }

      const newerPayment = await tx.payment.create({
        data: {
          total: payment.total,
          discountAmount: payment?.discountAmount,
          discountCode: payment?.discountCode,
          discountCodeAmount: payment?.discountCodeAmount,
          itemsTotal: payment?.itemsTotal,
          walletUsed: payment.usedWallet,
          walletUsedAmount: payment.usedWalletAmount,
          paymentMethod: "ADMIN",
          status: payment?.status,
          couponId: existingCoupon?.id,
          userId,
          paidAt: enrolledAt,
        },
      });

      //* CASHBACK
      const cashbackAmount = cashBackCalculator(payment.total);
      if (cashbackAmount > 0 && payment.chargeWallet) {
        await tx.wallet.upsert({
          where: { userId },
          update: {
            balance: { increment: cashbackAmount },
            transactions: {
              create: {
                amount: cashbackAmount,
                type: "INCREMENT",
                description: "شارژ کیف پول جهت خرید دوره",
                paymentId: newerPayment.id,
              },
            },
          },
          create: {
            balance: cashbackAmount,
            userId,
            transactions: {
              create: {
                amount: cashbackAmount,
                type: "INCREMENT",
                description: "شارژ کیف پول جهت خرید دوره",
                paymentId: newerPayment.id,
              },
            },
          },
        });
      }

      if (payment.usedWallet && payment.usedWalletAmount) {
        await tx.wallet.update({
          where: { userId },
          data: {
            balance: { decrement: payment.usedWalletAmount },
            used: { increment: 1 },
            transactions: {
              create: {
                amount: payment.usedWalletAmount,
                type: "DECREMENT",
                description: "کسر کیف پول جهت خرید دوره",
                paymentId: newerPayment.id,
              },
            },
          },
        });
      }

      const courseIds = courses.map((c) => c.courseId);
      const existingEnrollments = await tx.enrollment.findMany({
        where: { userId, courseId: { in: courseIds } },
      });
      const enrolledCourseIds = existingEnrollments.map((e) => e.courseId);

      const coursesToEnroll = courses.filter(
        (course) => !enrolledCourseIds.includes(course.courseId)
      );

      if (coursesToEnroll.length !== courses.length) {
        throw new Error(
          `User is already enrolled in ${
            courses.length - coursesToEnroll.length
          } of the selected courses.`
        );
      }

      for (const course of coursesToEnroll) {
        const enrollment = await tx.enrollment.create({
          data: {
            enrolledAt,
            courseId: course.courseId,
            userId,
            paymentId: newerPayment.id,
            price: course.price,
            courseOriginalPrice: course.originalPrice,
          },
        });

        await tx.classRoom.create({
          data: {
            userId,
            enrollmentId: enrollment.id,
          },
        });
      }

      return newerPayment;
    });

    return {
      success:
        payment && payment.total !== 0
          ? "Payment, Enrollment, and Classroom Created Successfully"
          : "Enrollment and Classroom Created Successfully",
      payment: newPayment?.id,
    };
  } catch (error) {
    return { error: String(error) };
  }
};

//? UPDATE -----------------------------------------------------------

export const updateEnrollmentStatus = async (
  data: EnrollmentStatusFormType,
  id: number
) => {
  try {
    const existingEnrollment = await database.enrollment.findUnique({
      where: { id },
    });

    if (!existingEnrollment) return { error: "No Enerollment Found" };

    await database.enrollment.update({
      where: { id },
      data: {
        status: data.enrollmentStatus,
      },
    });

    return {
      success: `Enrollment Updated Successfully`,
    };
  } catch (error) {
    return { error } as { error: string };
  }
};

//? Update ----------------------

export const updatePayment = async (data: PaymentFormType, id: number) => {
  const { enrolledAt, payment } = data;

  try {
    const existingPayment = await getPaymentById(id);

    if (!existingPayment) return { error: "Payment Not Found" };

    await database.payment.update({
      where: { id },
      data: {
        paidAt: enrolledAt,
        status: payment?.status,
      },
    });

    return { success: "Payment Updated Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//! DELETE -----------------------------------------------------------

export const deleteEnrollment = async (id: number) => {
  try {
    const existingEnrollment = await database.enrollment.findUnique({
      where: { id },
      include: {
        payment: true,
      },
    });

    if (!existingEnrollment) return { error: "No Enrollment Found" };

    const paymentId = existingEnrollment.payment?.id;

    await database.enrollment.delete({ where: { id } });

    if (paymentId) {
      const remainingEnrollments = await database.enrollment.count({
        where: { paymentId },
      });

      if (remainingEnrollments === 0) {
        await database.payment.delete({ where: { id: paymentId } });
      }
    }

    return { success: "Enrollment Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

export const deletePayment = async (id: number) => {
  try {
    const existingPayment = await getPaymentById(id);

    if (!existingPayment) return { error: "Payment Not Found" };

    await database.payment.delete({
      where: { id },
    });

    return { success: "Payment Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};
