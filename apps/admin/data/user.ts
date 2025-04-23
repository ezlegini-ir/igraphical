"use server";

import { auth } from "@igraph/auth";
import { database } from "@igraph/database";

export const getUserByIdentifier = async (phoneOrEmail: string) => {
  return await database.user.findFirst({
    where: {
      OR: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
    },
  });
};

export const getUserById = async (id: number) => {
  if (!id) return;
  return await database.user.findUnique({
    where: {
      id,
    },
    include: {
      image: true,
      wallet: true,
    },
  });
};

export const getSessionUser = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return userId ? await getUserById(+userId) : null;
};
