"use server";

import { database } from "@igraph/database";

export const getCampaign = async () => {
  const campaign = await database.campaignOnGoing.findFirst({
    where: {
      startAt: { lte: new Date() },
      endAt: { gte: new Date() },
    },
  });
  return campaign;
};
