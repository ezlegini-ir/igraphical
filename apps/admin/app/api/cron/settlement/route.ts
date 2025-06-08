import { database } from "@igraph/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, tutorId: tutorIdRaw } = body;

    const tutorId = +tutorIdRaw;

    const existingTutor = await database.tutor.findFirst({
      where: { id: tutorId },
    });
    if (!existingTutor) {
      return NextResponse.json({ error: "No Tutor Found" }, { status: 404 });
    }

    const enrollments = await database.enrollment.groupBy({
      by: ["enrolledAt"],
      where: {
        course: { tutorId },
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

    await database.settlement.create({
      data: {
        amount,
        from: date.from,
        to: date.to,
        profit: existingTutor.profit,
        status: "PENDING",
        totalEnrollments: 0, //todo: this is hardcoded
        totalSell,
        tutorId,
        paidAt: null,
      },
    });

    return NextResponse.json({ success: "Settlements Created Successfully" });
  } catch (error) {
    console.error("[SETTLEMENT_CREATION_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
