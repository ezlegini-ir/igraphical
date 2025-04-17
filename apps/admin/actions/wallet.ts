"use server";

import { WalletFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";

export const updateWallet = async (data: WalletFormType) => {
  const { amount, description, type, userId } = data;

  const decrementType = type === "DECREMENT";

  try {
    await database.wallet.upsert({
      where: { userId },
      update: {
        balance: decrementType ? { decrement: amount } : { increment: amount },
        used: decrementType ? { increment: 1 } : undefined,
        transactions: {
          create: {
            amount,
            type,
            description,
          },
        },
      },
      create: {
        userId,
        balance: amount,
        transactions: {
          create: {
            type: "INCREMENT",
            amount,
            description,
          },
        },
      },
    });

    return {
      success: `${type.toLowerCase()} in wallet was done successfully.`,
    };
  } catch (error) {
    return { error: String(error) };
  }
};
