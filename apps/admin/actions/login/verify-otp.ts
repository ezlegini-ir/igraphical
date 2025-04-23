"use server";

import { getOtpByIdentifier } from "@/data/otp";
import { getAdminByIdentifier } from "@/data/admin";
import { database } from "@igraph/database";
import bcrypt from "bcrypt";
import { isHumanOrNot } from "@igraph/utils";

export const verifyOtp = async (
  otp: string,
  identifier: string,
  recaptchaToken: string
) => {
  try {
    await isHumanOrNot(recaptchaToken, "EN");

    // OTP LOOK UP
    const existingOtp = await getOtpByIdentifier(identifier);

    // CHECK EXISTANCE
    if (!existingOtp) return { error: "Invalid Code" };

    // CHECK EXPIRATION
    const hasExpired = new Date(existingOtp.expires) < new Date();
    if (hasExpired) {
      return { error: `Code has been expired` };
    }

    // CHECK OTP
    const isValidOtp = await bcrypt.compare(otp, existingOtp.otpCode);
    if (!isValidOtp) return { error: "Invalid Code" };

    // DELETE OTP
    await database.otp.delete({
      where: {
        identifier: existingOtp.identifier,
      },
    });

    // FIND USER OF THIS OTP
    const existingAdmin = await getAdminByIdentifier(identifier);

    return { success: "Seccuess", role: existingAdmin?.role };
  } catch (error) {
    return { error: "Something Happended" };
  }
};
