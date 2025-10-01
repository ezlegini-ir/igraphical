"use server";

import { database } from "@igraph/database";

export const getIncomeData = async ({
  date,
}: {
  date: { from: Date; to: Date };
}) => {
  try {
    const payments = await database.payment.findMany({
      where: {
        status: "SUCCESS",
        paidAt: {
          gte: date.from,
          lte: date.to,
        },
      },
    });

    return { payments };
  } catch (error) {
    console.error(error);
    return { error: "Something Went Wrong." };
  }
};
