"use server";

import { database } from "@igraph/database";

export const getAdminById = async (id: number) => {
  return await database.admin.findFirst({
    where: { id },
  });
};

export const getAdminByIdentifier = async (identifier: string) => {
  return await database.admin.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
  });
};
