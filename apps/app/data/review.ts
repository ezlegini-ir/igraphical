"use server";

import { database } from "@igraph/database";

export const getReviewByUserIdAndCourseId = async (
  userId: number,
  courseId: number
) => {
  return await database.review.findFirst({
    where: { userId, courseId },
  });
};
