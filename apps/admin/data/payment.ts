"use server";

import { database } from "@igraph/database";

export const getPaymentById = async (id: number) => {
  return await database.enrollment.findMany({
    where: { id },
  });
};
