"use server";

import { SettlementFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import { sendPaidSettlmentSms } from "@igraph/utils";

export const createSettlement = async (data: SettlementFormType) => {
  const { date } = data;
  const tutorId = +data.tutorId;

  try {
    const existingTutor = await database.tutor.findFirst({
      where: { id: +tutorId },
    });
    if (!existingTutor) throw new Error("No Tutor Found");

    // CALCULATIONS
    const enrollments = await database.enrollment.groupBy({
      by: ["enrolledAt"],
      where: {
        course: {
          tutorId,
        },
        enrolledAt: {
          gte: date.from,
          lte: date.to,
        },
      },
      _sum: { price: true },
    });

    const totalSell = enrollments.reduce(
      (acc, curr) => acc + (curr._sum.price || 0),
      0
    );
    const profitFactor = existingTutor.profit / 100;
    const amount = totalSell * profitFactor;

    // CREATE SETTLEMENT
    await database.settlement.create({
      data: {
        amount,
        from: date.from,
        to: date.to,
        profit: existingTutor.profit,
        status: "PENDING",
        totalEnrollments: 2,
        totalSell: totalSell,
        tutorId,
        paidAt: null,
      },
    });

    return { success: "Settle Created Succesfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

export const updateSettlement = async (
  data: SettlementFormType,
  settlementId: number
) => {
  const { status } = data;
  try {
    const existingSettlement = await database.settlement.findFirst({
      where: { id: settlementId },
      include: {
        tutor: true,
      },
    });

    if (!existingSettlement) throw new Error("No Settlement Found");

    await database.settlement.update({
      where: { id: settlementId },
      data: {
        status,
        paidAt: status === "PENDING" ? null : new Date(),
      },
    });

    if (status === "PAID")
      await sendPaidSettlmentSms(
        existingSettlement.tutor.name,
        existingSettlement.tutor.phone,
        existingSettlement.amount
      );

    return { success: "Status of Settlement Updated Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

export const deleteSettlement = async (settlementId: number) => {
  try {
    const existingSettlement = await database.settlement.findFirst({
      where: { id: settlementId },
    });
    if (!existingSettlement) throw new Error("No Settlement Found");

    await database.settlement.delete({
      where: { id: settlementId },
    });

    return { success: "Settlement Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};
