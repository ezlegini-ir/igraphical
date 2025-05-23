import { database } from "@igraph/database";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const authHeader = req.headers.get("x-cron-key");

  if (authHeader !== process.env.CRON_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await database.otp.deleteMany({
      where: {
        expires: { lt: new Date() },
      },
    });

    return NextResponse.json({
      message: "Old OTPs deleted successfully.",
      deletedCount: deleted.count,
    });
  } catch (error) {
    console.error("[CLEANUP_OTP_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
