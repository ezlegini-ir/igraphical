"use server";

import { ReviewFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";

//* CREATE ---------------------------------------------------------

export const createReview = async (data: ReviewFormType) => {
  const { content, courseId, date, rate, userId } = data;
  try {
    await database.review.create({
      data: {
        content,
        rate: +rate,
        courseId,
        userId,
        createdAt: date,
      },
    });

    return { success: "Review Craeted Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ---------------------------------------------------------

export const updateReview = async (data: ReviewFormType, id: number) => {
  const { content, courseId, date, rate, userId } = data;

  try {
    const existingReview = await database.review.findUnique({
      where: { id },
    });

    if (!existingReview) return { error: "No Review Found" };

    await database.review.update({
      where: { id },
      data: {
        content,
        rate: +rate,
        courseId,
        userId,
        createdAt: date,
      },
    });

    return { success: "Review Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ---------------------------------------------------------

export const deleteReview = async (id: number) => {
  try {
    const existingReview = await database.review.findUnique({
      where: { id },
    });

    if (!existingReview) return { error: "No Review Found" };

    await database.review.delete({
      where: { id },
    });

    return { success: "Removed Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};
