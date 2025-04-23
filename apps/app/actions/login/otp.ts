"use server";

import { getUserByIdentifier } from "@/data/user";
import { LoginFormType } from "@/lib/validationSchema";
import {
  convertPersianDigitsToEnglish,
  detectInputType,
  isHumanOrNot,
  sendOtpEmail,
  sendOtpSms,
} from "@igraph/utils";

export async function sendOtp(
  data: LoginFormType & { recaptchaToken?: string; userId?: number }
) {
  const { phoneOrEmail, recaptchaToken } = data;

  // DETECT INPUT TYPE
  const inputType = detectInputType(phoneOrEmail);

  try {
    if (recaptchaToken) await isHumanOrNot(recaptchaToken, "FA");

    // USE LOOK UP
    const existingUser = await getUserByIdentifier(
      inputType === "phone"
        ? convertPersianDigitsToEnglish(phoneOrEmail)
        : phoneOrEmail
    );

    if (inputType === "phone") {
      await sendOtpSms(phoneOrEmail, data.userId);
    } else {
      await sendOtpEmail(phoneOrEmail, data.userId);
    }

    return { isNewUser: !!!existingUser };
  } catch (error) {
    return { error: String(error) };
  }
}
