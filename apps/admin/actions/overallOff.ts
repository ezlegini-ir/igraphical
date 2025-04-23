"use server";

import { OverallOffFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";

export const updateOverallOff = async (
  data: OverallOffFormType,
  id: number
) => {
  const { amount, type, date, active } = data;

  try {
    await database.overallOff.upsert({
      where: { id },
      update: {
        amount,
        from: date ? date.from : null,
        to: date ? date.to : null,
        type,
        active,
      },
      create: {
        amount,
        from: date ? date.from : null,
        to: date ? date.to : null,
        type,
        active,
      },
    });

    return { success: "Saved Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};
