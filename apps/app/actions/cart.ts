"use server";

import { getSessionUser } from "@/data/user";
import { database } from "@igraph/database";

export const addToCart = async (courseId: number) => {
  const userId = (await getSessionUser())?.id;
  if (!userId) return { error: "کاربر یافت نشد" };

  try {
    // Check if cart exists
    const existingCart = await database.cart.findUnique({
      where: { userId },
      include: {
        cartItem: true,
      },
    });

    if (existingCart?.cartItem.some((item) => item.courseId === courseId)) {
      return { error: "این دوره قبلاً به سبد خرید اضافه شده است" };
    }

    await database.cart.upsert({
      where: { userId },
      update: {
        cartItem: {
          create: {
            courseId,
          },
        },
      },
      create: {
        userId,
        cartItem: {
          create: {
            courseId,
          },
        },
      },
    });

    return { success: "Added to cart" };
  } catch (error) {
    return {
      error: "مشکلی در افزودن دوره به سبد خرید وجود دارد: " + String(error),
    };
  }
};

//! DELETE ---------------------------------------------

export const deleteCartItem = async (cartItemId: number) => {
  try {
    const existingCartItem = await database.cartItem.findFirst({
      where: { id: cartItemId },
      include: { cart: { include: { cartItem: true } } },
    });

    if (!existingCartItem) return { error: "آیتم یافت نشد" };

    await database.cartItem.delete({
      where: { id: cartItemId },
    });

    if (existingCartItem.cart.cartItem.length === 1)
      await database.cart.delete({ where: { id: existingCartItem.cartId } });

    return { success: "با موفقیت حذف شد" };
  } catch (error) {
    return { error: String(error) };
  }
};
