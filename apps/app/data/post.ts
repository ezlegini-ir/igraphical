"use server";

import { database } from "@igraph/database";

export const getPostCategories = async () => {
  const postCategories = (await database.postCategory.findMany()).map(
    (item) => ({
      label: item.name,
      value: item.url,
    })
  );

  return postCategories;
};
