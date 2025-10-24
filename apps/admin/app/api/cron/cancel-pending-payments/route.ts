import { database } from "@igraph/database";
import { subMinutes } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cronKey = req.headers.get("x-cron-key");
  if (cronKey !== process.env.CRON_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyMinutesAgo = subMinutes(new Date(), 30);

  try {
    const updatedPayments = await database.payment.updateMany({
      where: {
        status: "PENDING",
        createdAt: { lt: thirtyMinutesAgo },
      },
      data: {
        status: "CANCELED",
      },
    });

    return NextResponse.json(
      { message: `Canceled ${updatedPayments.count} pending payments.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CLEANUP_OTP_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
