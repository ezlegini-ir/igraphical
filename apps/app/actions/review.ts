"use server";

import { CourseReviewFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";

export const createReview = async (
  data: CourseReviewFormType,
  userId: number,
  courseId: number
) => {
  const { rating, review } = data;

  try {
    const existingReview = await database.review.findFirst({
      where: { userId, courseId },
    });
    if (existingReview) return { error: "شما قبلا نظر ثبت کرده اید" };

    await database.review.create({
      data: {
        rate: rating,
        content: review,
        courseId,
        userId,
      },
    });

    return { success: "ضمن تشکر، نظر شما ثبت شد" };
  } catch (error) {
    return { error: String(error) };
  }
};
