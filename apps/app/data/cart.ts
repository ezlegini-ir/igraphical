"use server";

import { database } from "@igraph/database";

export const getCartByUserId = async (userId: number | undefined) => {
  if (!userId) return;

  return await database.cart.findFirst({
    where: { userId },
    include: {
      _count: {
        select: {
          cartItem: true,
        },
      },
    },
  });
};
