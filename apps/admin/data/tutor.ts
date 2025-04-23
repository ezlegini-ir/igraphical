"use server";

import { auth } from "@igraph/auth";
import { database } from "@igraph/database";

export const getTutorByIdentifier = async (identifier: string) => {
  return await database.tutor.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
  });
};

export const getTutorById = async (id: string | number) => {
  return await database.tutor.findUnique({
    where: {
      id: +id,
    },
    include: { image: true },
  });
};

export const getAllTutors = async () => {
  return await database.tutor.findMany({
    include: { image: true },
  });
};

export const getSessionTutor = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return userId ? await getTutorById(userId) : null;
};
