"use server";

import { database } from "@igraph/database";
import {
  generateCertificate,
  generateUniqueSerial,
  sendFinishCourseEmail,
  sendFinishCourseSms,
} from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";
import { uploadCloudFile } from "@igraph/utils";
import { getSessionUser } from "@/data/user";

export const createLessonProgress = async (
  lessonId: number,
  classroomId: string
) => {
  try {
    const result = await database.$transaction(async (tx) => {
      const existingClassroom = await tx.classRoom.findFirst({
        where: { id: classroomId },
        include: {
          enrollment: {
            include: {
              lessonProgress: true,
              course: {
                include: {
                  curriculum: {
                    include: {
                      lessons: {
                        include: {
                          lessonProgress: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!existingClassroom) return { error: "کلاس درس یافت نشد" };

      await tx.lessonProgress.create({
        data: {
          completed: true,
          completedAt: new Date(),
          enrollmentId: existingClassroom.enrollmentId,
          userId: existingClassroom.userId,
          lessonId,
        },
      });

      const totalLessons =
        existingClassroom.enrollment.course.curriculum.reduce(
          (acc, curr) => acc + curr.lessons.length,
          0
        );

      const totalCompletedLessons = await tx.lessonProgress.count({
        where: {
          Enrollment: {
            classroom: {
              id: classroomId,
            },
          },
        },
      });

      const isLastLesson = totalCompletedLessons === totalLessons;
      const progress = (totalCompletedLessons / totalLessons) * 100;

      await tx.enrollment.update({
        where: {
          id: existingClassroom.enrollmentId,
        },
        data: {
          progress,
          status: "IN_PROGRESS",
        },
      });

      if (isLastLesson) {
        await tx.enrollment.update({
          where: {
            id: existingClassroom.enrollmentId,
          },
          data: {
            completedAt: new Date(),
            progress,
          },
        });

        return {
          success: "تبریک! شما با موفقیت این دوره را به اتمام رساندید.",
          isLastLesson: true,
          enrollment: existingClassroom.enrollment, // Return for further processing
        };
      } else {
        return {
          success: "موفق باشید! پیش به سوی درس بعدی...",
          isLastLesson: false,
        };
      }
    });

    // Certificate
    if (result.enrollment && result.isLastLesson) {
      const serialNumber = await generateUniqueSerial();

      const user = await getSessionUser();
      if (!user) throw new Error("کاربر یافت نشد. لطفا مجددا وارد شوید.");

      const updatedClassroom = await database.classRoom.update({
        where: { id: classroomId },
        data: {
          enrollment: {
            update: {
              status: "COMPLETED", // update to status of compelted
            },
          },
        },
        include: { enrollment: { include: { course: true } } },
      });
      if (!updatedClassroom)
        throw new Error("دوره یافت نشد. لطفا مجددا تلاش کنید.");

      const existingCertificate = await database.certificate.findFirst({
        where: {
          enrollment: {
            classroom: {
              id: classroomId,
            },
          },
        },
      });

      if (!existingCertificate) {
        const buffer = await generateCertificate(
          user,
          updatedClassroom?.enrollment.course.title,
          updatedClassroom.enrollment.course.duration,
          updatedClassroom.enrollment.completedAt || new Date(),
          serialNumber
        );

        const { secure_url, bytes, public_id, resource_type } =
          (await uploadCloudFile(buffer, {
            format: "pdf",
            resource_type: "raw",
            folder: "certificate",
          })) as UploadApiResponse;

        const newCertificate = await database.certificate.create({
          data: {
            serial: serialNumber,
            url: secure_url,
            enrollmentId: result.enrollment.id,
          },
        });

        await database.file.create({
          data: {
            format: "pdf",
            public_id,
            size: bytes,
            type: "CERTIFICATE",
            url: secure_url,
            resource_type,
            fileName: serialNumber + ".pdf",
            certificateId: newCertificate.id,
          },
        });

        await sendFinishCourseSms(user.fullName, user.phone);

        await sendFinishCourseEmail(
          user.email,
          result.enrollment.course.title,
          user.fullName
        );
      }
    }

    return result;
  } catch (error) {
    return { error: String(error) };
  }
};
