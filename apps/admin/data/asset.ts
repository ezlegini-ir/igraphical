"use server";

import { AssetType } from "@/app/(DASHBOARD)/assets/list/AssetsList";
import { database } from "@igraph/database";

export async function getAssetByUrl(url: string) {
  return await database.asset.findUnique({
    where: { url },
  });
}

export async function getAssetById(
  id: string | number
): Promise<AssetType | null> {
  return await database.asset.findUnique({
    where: { id: +id },
    include: {
      image: true,
    },
  });
}
