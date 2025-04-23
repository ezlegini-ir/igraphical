"use server";

import { database } from "@igraph/database";

interface GetAllPostImagesOptions {
  take?: number;
  skip?: number;
}

export const getAllAssetImages = async (options?: GetAllPostImagesOptions) => {
  return await database.image.findMany({
    where: {
      type: { in: ["POST_ASSET", "POST"] },
    },
    orderBy: { id: "desc" },
    take: options?.take,
  });
};

export const getAllAssetImagesCount = async () => {
  return await database.image.count({
    where: {
      type: { in: ["POST_ASSET", "POST"] },
    },
  });
};
