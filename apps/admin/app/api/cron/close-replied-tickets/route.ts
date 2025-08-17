import { database } from "@igraph/database";
import { subDays } from "date-fns";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const cronKey = req.headers.get("x-cron-key");
  if (cronKey !== process.env.CRON_SECRET_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const threeDaysAgo = subDays(new Date(), 3);

  try {
    const result = await database.ticket.updateMany({
      where: {
        status: { in: ["REPLIED", "PENDING"] },
        updatedAt: { lt: threeDaysAgo },
      },
      data: {
        status: "CLOSED",
      },
    });

    return NextResponse.json({
      message: "Tickets updated successfully.",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("[TICKET_AUTO_CLOSE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
