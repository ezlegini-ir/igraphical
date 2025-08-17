"use server";

import { CampaignFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import { sendArraySms, statusChunk } from "@igraph/utils";

export const createCampaign = async (data: CampaignFormType) => {
  const { couponId, date, message, title, url, sellGoal } = data;
  try {
    const existingCoupon = await database.coupon.findFirst({
      where: { id: couponId },
    });
    if (!existingCoupon) {
      return { error: "Coupon not found" };
    }

    const existingCampaign = await database.campaign.findFirst({
      where: { url },
    });
    if (existingCampaign) {
      return { error: "Coupon URL should be unique." };
    }

    const students = await database.user.findMany({ select: { phone: true } });
    const numbers = students.map((s) => s.phone).filter(Boolean);

    const sentMessages = await sendArraySms({
      numbers,
      message,
    });

    const campaign = await database.campaign.create({
      data: {
        couponId,
        message,
        title,
        url,
        startAt: date.from,
        endAt: date.to,
        messageSent: sentMessages.length,
        sellGoal,
      },
    });

    await database.campaignMessages.createMany({
      data: sentMessages.map((m) => ({
        smsId: m.messageid,
        smsCost: m.cost ?? 0,
        campaignId: campaign.id,
      })),
    });

    return {
      success: "Campaign Created Successfully",
      count: sentMessages.length,
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create campaign" };
  }
};

const MAX_PER_STATUS = 500;

export async function updateCampaignDeliveredCount(campaignId: number) {
  const messages = await database.campaignMessages.findMany({
    where: { campaignId },
    select: { smsId: true },
  });

  if (messages.length === 0) {
    throw new Error("No messages found for this campaign");
  }

  const ids = messages.map((m) => m.smsId);

  let allEntries: any[] = [];
  for (let i = 0; i < ids.length; i += MAX_PER_STATUS) {
    const chunk = ids.slice(i, i + MAX_PER_STATUS);
    const entries = await statusChunk(chunk);
    allEntries.push(...entries);
  }

  const deliveredCount = allEntries.filter((e) => e.status === 10).length;

  await database.campaign.update({
    where: { id: campaignId },
    data: { messageDelivered: deliveredCount },
  });

  return {
    campaignId,
    deliveredCount,
  };
}
