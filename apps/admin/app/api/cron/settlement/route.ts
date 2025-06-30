import { database } from "@igraph/database";
import { endOfMonth, startOfMonth, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const allTutors = await database.tutor.findMany();

    if (!allTutors.length) {
      return NextResponse.json({ error: "No tutors found." }, { status: 404 });
    }

    let createdCount = 0;
    const startOfThisMonth = startOfMonth(subDays(new Date(), 1));
    const endOfThisMonth = endOfMonth(subDays(new Date(), 1));

    for (const tutor of allTutors) {
      const enrollments = await database.enrollment.groupBy({
        by: ["enrolledAt"],
        where: {
          course: { tutorId: tutor.id },
          enrolledAt: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
        _sum: { price: true },
      });

      const totalSell = enrollments.reduce(
        (acc, curr) => acc + (curr._sum.price || 0),
        0
      );

      const amount = totalSell * (tutor.profit / 100);

      const totalEnrollments = await database.enrollment.count({
        where: {
          course: { tutorId: tutor.id },
          enrolledAt: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
      });

      await database.settlement.create({
        data: {
          amount,
          from: startOfThisMonth,
          to: endOfThisMonth,
          profit: tutor.profit,
          status: "PENDING",
          totalEnrollments,
          totalSell,
          tutorId: tutor.id,
          paidAt: null,
        },
      });

      createdCount++;
    }

    return NextResponse.json({
      message: "Settlements created successfully.",
      createdCount,
    });
  } catch (error) {
    console.error("[SETTLEMENT_CREATION_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
