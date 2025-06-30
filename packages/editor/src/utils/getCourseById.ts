"use server";

import { database } from "@igraph/database";

export const getCourseById = async (courseId: string) => {
  return await database.course.findUnique({
    where: { id: +courseId },
    include: {
      image: true,
    },
  });
};
