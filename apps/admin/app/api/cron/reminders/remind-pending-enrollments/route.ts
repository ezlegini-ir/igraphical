import { database } from "@igraph/database";
import { sendRemindPedningEnrollmentSms } from "@igraph/utils";
import { differenceInDays, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const now = new Date();
  const fourDaysAgo = subDays(now, 4);

  try {
    const pendingEnrollments = await database.enrollment.findMany({
      where: {
        status: "PENDING",
        enrolledAt: {
          lte: fourDaysAgo,
        },
      },
      include: {
        smsLog: true,
        course: {
          select: { title: true },
        },
        user: {
          select: {
            firstName: true,
            phone: true,
          },
        },
      },
    });

    let count = 0;

    for (const enrollment of pendingEnrollments) {
      const alreadySent = enrollment.smsLog.some(
        (log) => log.type === "REMIND_PENDING_ENROLLMENT"
      );

      const daysSinceEnroll = differenceInDays(
        now,
        new Date(enrollment.enrolledAt)
      );

      if (daysSinceEnroll >= 4 && !alreadySent) {
        //* Send Sms
        await sendRemindPedningEnrollmentSms({
          firstName: enrollment.user.firstName,
          phone: enrollment.user.phone,
          courseTitle: enrollment.course.title,
        });

        //TODO: SEND EMAIl AS WELL

        await database.smsLog.create({
          data: {
            enrollmentId: enrollment.id,
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
