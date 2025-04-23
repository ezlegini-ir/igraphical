"use server";

import { database } from "@igraph/database";

export const getEnrollmentByUserIdAndCourseId = async (
  userId: number,
  courseId: number
) => {
  return await database.enrollment.findFirst({
    where: {
      userId,
      courseId,
    },
    include: {
      classroom: true,
    },
  });
};
