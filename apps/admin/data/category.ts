"use server";

import { database } from "@igraph/database";

export async function getPostCategoryByUrl(url: string) {
  return await database.postCategory.findUnique({
    where: { url },
  });
}

export async function getCourseCategoryByUrl(url: string) {
  return await database.courseCategory.findUnique({
    where: { url },
  });
}

export async function getPostCategoryById(id: number) {
  return await database.postCategory.findUnique({
    where: { id },
  });
}

export async function getCourseCategoryById(id: number) {
  return await database.courseCategory.findUnique({
    where: { id },
  });
}
