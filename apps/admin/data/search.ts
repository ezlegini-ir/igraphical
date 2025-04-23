"use server";

import { database, Prisma } from "@igraph/database";

export const searchUsers = async (query: string) => {
  const where: Prisma.UserWhereInput = query
    ? {
        OR: [
          { email: { contains: query } },
          { phone: { contains: query } },
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { fullName: { contains: query } },
          { nationalId: { contains: query } },
        ],
      }
    : {};

  return await database.user.findMany({
    where,
    take: 5,
  });
};

export const searchPosts = async (query: string) => {
  const where: Prisma.PostWhereInput = query
    ? {
        OR: [{ title: { contains: query } }, { url: { contains: query } }],
      }
    : {};

  return await database.post.findMany({
    where,
    take: 5,
  });
};

export const searchCourses = async (query: string) => {
  const where: Prisma.CourseWhereInput = query
    ? {
        OR: [{ title: { contains: query } }],
      }
    : {};

  return await database.course.findMany({
    where,
    take: 5,
  });
};

export const searchTutors = async (query: string) => {
  const where: Prisma.TutorWhereInput = query
    ? {
        OR: [
          { name: { contains: query } },
          { phone: { contains: query } },
          { email: { contains: query } },
        ],
      }
    : {};

  return await database.tutor.findMany({
    where,
    take: 5,
  });
};
