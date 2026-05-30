"use server";

import { getOtpByIdentifier } from "@/data/otp";
import { database } from "@igraph/database";
import bcrypt from "bcrypt";

export const verifyOtp = async (
  otp: string,
  identifier: string,
  // recaptchaToken: string,
) => {
  try {
    // await isHumanOrNot(recaptchaToken, "EN");

    const existingOtp = await getOtpByIdentifier(identifier);

    if (!existingOtp) return { error: "Invalid Code" };

    const hasExpired = new Date(existingOtp.expires) < new Date();
    if (hasExpired) {
      return { error: `Code has been expired` };
    }

    const isValidOtp = await bcrypt.compare(otp, existingOtp.otpCode);
    if (!isValidOtp) return { error: "Invalid Code" };

    await database.otp.delete({
      where: {
        identifier: existingOtp.identifier,
      },
    });

    return { success: "Seccuess" };
  } catch (error) {
    return { error: "Something Happended" };
  }
};
