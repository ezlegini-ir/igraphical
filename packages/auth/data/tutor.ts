"use server";

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
