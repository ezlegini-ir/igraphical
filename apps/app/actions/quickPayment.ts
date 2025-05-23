"use server";

import { database, User, Wallet } from "@igraph/database";
import {
  cashBackCalculator,
  sendSuccessPaymentEmail,
  sendSuccessPaymentEmailToAdmin,
  sendSuccessPaymentSms,
} from "@igraph/utils";
import { InitiatePurchase, verifyPurchase } from "./zarinPal";
import { adminData } from "@/data/adminData";

//* CREATE PAYMENT -------------------------------------------------------

export interface QuickPaymentDataType {
  amount: number;
  courseId: number;
  user: User & { wallet: Wallet | null };
  discountAmount?: number;
  discountCode?: string;
  discountCodeAmount?: number;
  itemsTotal: number;
  useWallet?: boolean;
  useWalletAmount?: number;
}

export const createQuickPayment = async (data: QuickPaymentDataType) => {
  const {
    amount,
    courseId,
    discountAmount,
    discountCode,
    discountCodeAmount,
    user,
    itemsTotal,
    useWallet,
    useWalletAmount,
  } = data;

  try {
    const existingCoupon = await database.coupon.findFirst({
      where: { code: discountCode },
    });
    if (discountCode && !existingCoupon)
      return { error: "کد تخفیف معتبر نمی باشد" };

    const existingCourse = await database.course.findFirst({
      where: { id: courseId },
    });
    if (!existingCourse) return { error: "این دوره معتبر نمی باشد" };

    const existingEnrollment = await database.enrollment.findFirst({
      where: { userId: user.id, courseId },
    });

    if (existingEnrollment)
      return { error: "شما قبلا در این دوره ثبت نام کرده اید" };

    const newPayment = await database.payment.create({
      data: {
        status: amount > 0 ? "PENDING" : "SUCCESS",
        userId: user.id,
        total: amount,
        itemsTotal,
        paymentMethod: amount > 0 ? "ZARRIN_PAL" : "NO_METHOD",
        discountCode,
        discountCodeAmount,
        couponId: existingCoupon?.id,
        discountAmount,
        walletUsed: useWallet,
        walletUsedAmount: useWalletAmount,
        enrollment:
          amount === 0
            ? {
                create: {
                  userId: user.id,
                  courseId: existingCourse.id,
                  price: amount,
                  courseOriginalPrice: existingCourse.basePrice,
                  classroom: {
                    create: {
                      userId: user.id,
                    },
                  },
                },
              }
            : undefined,
      },

      include: {
        user: true,
        enrollment: {
          include: {
            course: true,
            classroom: true,
          },
        },
      },
    });

    // PURCHASE
    if (amount > 0) {
      const res = await InitiatePurchase(
        user,
        amount,
        newPayment.id,
        "?Type=QUICK"
      );

      if (res?.success && res.data.authority && res.data.paymentUrl) {
        await database.quickCart.create({
          data: {
            courseId,
            userId: user.id,
            amount: amount * 10,
            authority: res?.data?.authority,
            paymentId: newPayment.id,
          },
        });
      } else {
        return { error: "مشکلی در پرداخت رخ داد. دقایقی بعد مجددا تلاش کنید" };
      }

      return {
        success: "به صفحه پرداخت هدایت می شوید...",
        paymentUrl: res?.data?.paymentUrl,
      };
    } else {
      if (newPayment.walletUsed) {
        await database.wallet.update({
          where: { id: user.wallet?.id },
          data: {
            balance: { decrement: newPayment.walletUsedAmount || 0 },
            used: { increment: 1 },
            transactions: newPayment.walletUsedAmount
              ? {
                  create: {
                    amount: newPayment.walletUsedAmount,
                    type: "DECREMENT",
                    description: "کسر کیف پول جهت خرید دوره",
                  },
                }
              : undefined,
          },
        });
      }

      //* Send Email
      await sendSuccessPaymentEmail(
        newPayment.user.email,
        newPayment.user.fullName,
        newPayment
      );

      //* Send Email To Admin
      await sendSuccessPaymentEmailToAdmin(
        adminData.email,
        newPayment.user.fullName,
        newPayment
      );

      //* Send Sms
      await sendSuccessPaymentSms(
        newPayment.user.fullName,
        newPayment.user.phone,
        newPayment.total
      );

      return {
        success: "در حال انتقال به کلاس درس...",
        redirectUrl: `/classroom/${newPayment.enrollment[0]?.classroom?.id}`,
      };
    }
  } catch (error) {
    return { error: String(error) };
  }
};

//* VERIFY PAYMENT -------------------------------------------------------

export const verifyQuickPayment = async (
  authority: string,
  status: "OK" | "NOK"
) => {
  try {
    const existingQuickCart = await database.quickCart.findFirst({
      where: { authority },
    });

    if (!existingQuickCart) return { error: "کد مرجع معتبر نمی باشد" };

    const res = await verifyPurchase(
      authority,
      existingQuickCart.amount,
      status
    );

    if (res?.success && res?.data) {
      const deletedQuickCart = await database.quickCart.delete({
        where: { authority },
        include: { payment: true, course: true },
      });

      //* PAYMENT
      const updatedPayment = await database.payment.update({
        where: { id: deletedQuickCart.paymentId },
        include: {
          user: true,
          enrollment: { include: { course: true } },
        },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
          transactionId: res.data.ref_id.toString(),
          enrollment: {
            create: {
              userId: deletedQuickCart.userId,
              courseId: deletedQuickCart.courseId,
              price: deletedQuickCart.amount / 10,
              courseOriginalPrice: deletedQuickCart.course.price,
              classroom: {
                create: {
                  userId: deletedQuickCart.userId,
                },
              },
            },
          },
        },
      });

      //* CASHBACK
      const cashbackAmount = cashBackCalculator(updatedPayment.total);
      if (cashbackAmount > 0) {
        const wallet = await database.wallet.upsert({
          where: { userId: updatedPayment.userId },
          update: {
            balance: { increment: cashbackAmount },
            transactions: {
              create: {
                amount: cashbackAmount,
                type: "INCREMENT",
                description: "شارژ کیف پول جهت خرید دوره",
              },
            },
          },
          create: {
            balance: cashbackAmount,
            userId: deletedQuickCart.userId,
            transactions: {
              create: {
                amount: cashbackAmount,
                type: "INCREMENT",
                description: "شارژ کیف پول جهت خرید دوره",
              },
            },
          },
        });

        if (updatedPayment.walletUsed) {
          await database.wallet.update({
            where: { id: wallet.id },
            data: {
              balance: { decrement: updatedPayment.walletUsedAmount || 0 },
              used: { increment: 1 },
              transactions: updatedPayment.walletUsedAmount
                ? {
                    create: {
                      amount: updatedPayment.walletUsedAmount,
                      type: "DECREMENT",
                      description: "کسر کیف پول جهت خرید دوره",
                    },
                  }
                : undefined,
            },
          });
        }
      }

      //* Send Email
      await sendSuccessPaymentEmail(
        updatedPayment.user.email,
        updatedPayment.user.fullName,
        updatedPayment
      );

      //* Send Sms
      await sendSuccessPaymentSms(
        updatedPayment.user.fullName,
        updatedPayment.user.phone,
        updatedPayment.total
      );

      return { success: "پرداخت موفق!", refId: res.data.ref_id };
    } else {
      await database.quickCart.delete({
        where: { authority },
      });
      await database.payment.update({
        where: { id: existingQuickCart.paymentId },
        data: {
          status: "FAILED",
        },
      });

      return { error: "پرداخت ناموفق" };
    }
  } catch (error) {
    return { error: String(error) };
  }
};
