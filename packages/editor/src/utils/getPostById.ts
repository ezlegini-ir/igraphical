"use server";

import { database } from "@igraph/database";

export const getPostById = async (postId: string) => {
  return await database.post.findUnique({
    where: { id: +postId },
    include: {
      image: true,
    },
  });
};
