"use server";

import { priceType } from "@/app/(CART)/cart/components/Cart";
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

export interface PaymentDataType {
  amount: number;
  coursesIds: number[];
  user: User & { wallet: Wallet | null };
  discountAmount?: number;
  discountCode?: string;
  discountCodeAmount?: number;
  itemsTotal: number;
  useWallet?: boolean;
  useWalletAmount?: number;
  prices: priceType[];
}

export const createPayment = async (data: PaymentDataType) => {
  const {
    amount,
    coursesIds,
    discountAmount,
    discountCode,
    discountCodeAmount,
    user,
    itemsTotal,
    useWallet,
    useWalletAmount,
    prices,
  } = data;

  try {
    const existingCoupon = await database.coupon.findFirst({
      where: { code: discountCode },
    });
    if (discountCode && !existingCoupon)
      return { error: "کد تخفیف معتبر نمی باشد" };

    const existingCourses = await database.course.findMany({
      where: { id: { in: coursesIds } },
    });
    if (existingCourses.length === 0)
      return { error: "این دوره (ها) معتبر نمی باشند" };

    const existingEnrollment = await database.enrollment.findFirst({
      where: { userId: user.id, courseId: { in: coursesIds } },
    });

    if (existingEnrollment)
      return { error: "شما قبلا در حداقل یکی از این دوره ها ثبت نام کرده اید" };

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
                create: existingCourses.map((c, index) => ({
                  userId: user.id,
                  courseId: c.id,
                  price: prices[index]!.price,
                  courseOriginalPrice: c.basePrice,
                  classroom: {
                    create: {
                      userId: user.id,
                    },
                  },
                })),
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
        "?Type=PAYMENT"
      );

      if (res?.success && res.data.authority && res.data.paymentUrl) {
        const updatedCart = await database.cart.update({
          where: { userId: user.id },
          data: {
            amount: amount * 10,
            authority: res?.data?.authority,
            paymentId: newPayment.id,
          },
          include: { cartItem: true },
        });

        const cartItemsIds = updatedCart.cartItem.map((c) => c.id);

        for (let i = 0; i < cartItemsIds.length; i++) {
          await database.cartItem.update({
            where: {
              id: cartItemsIds[i],
            },
            data: {
              paidPrice: prices[i]?.price,
            },
          });
        }
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
                    paymentId: newPayment.id,
                  },
                }
              : undefined,
          },
        });
      }

      await database.cart.delete({
        where: { userId: user.id },
      });

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
        success: "در حال انتقال به لیست دوره ها...",
        redirectUrl: "/panel/courses",
      };
    }
  } catch (error) {
    return { error: String(error) };
  }
};

//* VERIFY PAYMENT -------------------------------------------------------

export const verifyPayment = async (
  authority: string,
  status: "OK" | "NOK"
) => {
  try {
    const existingCart = await database.cart.findFirst({
      where: { authority },
    });

    if (!existingCart) return { error: "کد مرجع معتبر نمی باشد" };

    const res = await verifyPurchase(authority, existingCart.amount!, status);

    if (res?.success && res?.data) {
      const deletedCart = await database.cart.delete({
        where: { authority },
        include: { payment: true, cartItem: { include: { course: true } } },
      });

      //* PAYMENT
      const updatedPayment = await database.payment.update({
        where: { id: deletedCart.paymentId! },
        include: { user: true, enrollment: { include: { course: true } } },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
          transactionId: res.data.ref_id.toString(),

          enrollment: {
            create: deletedCart.cartItem.map((cartItem) => ({
              userId: deletedCart.userId,
              courseId: cartItem.courseId,
              price: cartItem.paidPrice || 0,
              courseOriginalPrice: cartItem.course.basePrice,
              classroom: {
                create: {
                  userId: deletedCart.userId,
                },
              },
            })),
          },
        },
      });

      //* CASHBACK
      const cashbackAmount = cashBackCalculator(updatedPayment.total);
      if (cashbackAmount > 0) {
        await database.wallet.upsert({
          where: { userId: updatedPayment.userId },
          update: {
            balance: { increment: cashbackAmount },
            transactions: {
              create: {
                amount: cashbackAmount,
                type: "INCREMENT",
                description: "شارژ کیف پول جهت خرید دوره",
                paymentId: updatedPayment.id,
              },
            },
          },
          create: {
            balance: cashbackAmount,
            userId: deletedCart.userId,
            transactions: {
              create: {
                amount: cashbackAmount,
                type: "INCREMENT",
                description: "شارژ کیف پول جهت خرید دوره",
                paymentId: updatedPayment.id,
              },
            },
          },
        });
      }

      if (updatedPayment.walletUsed && updatedPayment.walletUsedAmount) {
        await database.wallet.update({
          where: { userId: updatedPayment.userId },
          data: {
            balance: { decrement: updatedPayment.walletUsedAmount },
            used: { increment: 1 },
            transactions: {
              create: {
                amount: updatedPayment.walletUsedAmount,
                type: "DECREMENT",
                description: "کسر کیف پول جهت خرید دوره",
                paymentId: updatedPayment.id,
              },
            },
          },
        });
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
      await database.payment.update({
        where: { id: existingCart.paymentId! },
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
