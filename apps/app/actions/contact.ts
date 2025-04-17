"use server";

import { isHumanOrNot } from "@igraph/utils";
import { ContactFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";

export const createContact = async (
  data: ContactFormType,
  recaptchaToken: string
) => {
  const { email, fullName, message, phone, subject } = data;
  try {
    await isHumanOrNot(recaptchaToken, "FA");

    await database.contact.create({
      data: {
        email,
        fullName,
        message,
        phone,
        subject,
      },
    });

    return {
      success:
        "با موفقیت ارسال شد. پاسخ شما حداکثر طی 12 ساعت آینده از طریق ایمیل ارسال خواهد شد.",
    };
  } catch (error) {
    return { error: String(error) };
  }
};
