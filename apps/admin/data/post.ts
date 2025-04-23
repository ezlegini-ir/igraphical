"use server";

import { database } from "@igraph/database";

export async function getPostByUrl(url: string) {
  return await database.post.findUnique({
    where: { url },
  });
}

export async function getPostById(id: string | number) {
  return await database.post.findUnique({
    where: { id: +id },
    include: {
      image: true,
      categories: { include: { category: true } },
      author: true,
    },
  });
}
