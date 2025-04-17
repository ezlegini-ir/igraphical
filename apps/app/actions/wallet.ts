"use server";

import { database } from "@igraph/database";

export const getWalletByUserId = async (userId: number | undefined) => {
  if (!userId) return;
  return await database.wallet.findFirst({
    where: { userId },
  });
};
