"use server";

//* CREATE ------------------------------------------------------------

import { NotifbarFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";

export const createNotifBar = async (data: NotifbarFormType) => {
  const { active, bgColor, content, link, textColor } = data;

  try {
    await database.notifbar.create({
      data: {
        active,
        bgColor,
        content,
        link,
        textColor,
      },
    });

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateNotifBar = async (data: NotifbarFormType, id: number) => {
  const { active, bgColor, content, link, textColor } = data;

  try {
    const existingNotifBar = await database.notifbar.findUnique({
      where: { id },
    });

    if (!existingNotifBar)
      return { error: "Notif Bar Not Found, Try Again..." };

    await database.notifbar.update({
      where: { id },
      data: {
        active,
        bgColor,
        content,
        link,
        textColor,
      },
    });

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};
