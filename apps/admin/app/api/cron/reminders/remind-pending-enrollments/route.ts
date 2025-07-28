import { database } from "@igraph/database";
import { sendRemindPedningEnrollmentSms } from "@igraph/utils";
import { subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cronKey = req.headers.get("x-cron-key");
  if (cronKey !== process.env.CRON_SECRET_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = subDays(new Date(), 7);

  try {
    const pendingEnrollments = await database.enrollment.findMany({
      where: {
        status: "PENDING",
        enrolledAt: {
          lte: sevenDaysAgo,
        },
      },
      include: {
        smsLog: true,
        user: {
          select: {
            firstName: true,
            phone: true,
          },
        },
      },
    });

    const phoneToEnrollmentsMap = new Map<string, typeof pendingEnrollments>();

    for (const enrollment of pendingEnrollments) {
      const phone = enrollment.user?.phone;
      if (!phone) continue;

      if (!phoneToEnrollmentsMap.has(phone)) {
        phoneToEnrollmentsMap.set(phone, []);
      }

      phoneToEnrollmentsMap.get(phone)?.push(enrollment);
    }

    let count = 0;

    for (const [phone, enrollments] of phoneToEnrollmentsMap) {
      const alreadySent = enrollments.some((enrollment) =>
        enrollment.smsLog.some(
          (log) => log.type === "REMIND_PENDING_ENROLLMENT"
        )
      );

      const firstName = enrollments[0]?.user?.firstName || "کاربر";

      if (!alreadySent) {
        // Send SMS without course title
        await sendRemindPedningEnrollmentSms({
          phone,
          firstName,
        });

        // Log the first enrollment
        await database.smsLog.create({
          data: {
            enrollmentId: enrollments[0].id,
            type: "REMIND_PENDING_ENROLLMENT",
          },
        });

        count++;
      }
    }

    return NextResponse.json({
      message: "Reminder process completed.",
      sent: count,
    });
  } catch (error) {
    console.error("Reminder Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
