"use server";

import { isHumanOrNot } from "@igraph/utils";
import { database } from "@igraph/database";
import { convertPersianDigitsToEnglish } from "@igraph/utils";

export const verifyCertificate = async (
  serial: string,
  recaptchaToken: string
) => {
  try {
    await isHumanOrNot(recaptchaToken, "FA");

    const normalizedSerial = convertPersianDigitsToEnglish(serial);

    const certificate = await database.certificate.findFirst({
      where: { serial: normalizedSerial },
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    });

    if (certificate) {
      return {
        success: "این مدرک مورد تایید آی‌گرافیکال می باشد",
        certificate,
      };
    } else {
      return { error: "این مدرک در سیستم مدارک آی‌گرافیکال ثبت نگردیده است." };
    }
  } catch (error) {
    return { error: String(error) };
  }
};
