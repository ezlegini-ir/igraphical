"use server";

import { database } from "@igraph/database";
import { detectInputType, isHumanOrNot } from "@igraph/utils";
import bcrypt from "bcryptjs";

export const verifyOtp = async (
  otp: string,
  identifier: string,
  recaptchaToken?: string
) => {
  try {
    if (recaptchaToken) await isHumanOrNot(recaptchaToken, "FA");

    // OTP LOOK UP
    const existingOtp = await database.otp.findFirst({
      where: {
        identifier,
      },
    });

    // CHECK EXISTANCE
    if (!existingOtp) return { error: "کد وارد شده معتبر نمی باشد !" };

    // CHECK EXPIRATION
    const hasExpired = existingOtp.expires < new Date();
    if (hasExpired) {
      return { error: `کد تایید منقضی شده است` };
    }

    // CHECK OTP
    const isValidOtp = await bcrypt.compare(otp, existingOtp.otpCode);
    if (!isValidOtp) return { error: "کد وارد شده معتبر نمی باشد" };

    // DELETE OTP
    const deletedOtp = await database.otp.delete({
      where: {
        identifier: existingOtp.identifier,
      },
      include: { user: true },
    });

    if (deletedOtp.user) {
      const type = detectInputType(identifier);

      await database.user.update({
        where: { id: deletedOtp.user.id },
        data: {
          ...(type === "email"
            ? { emailVerified: true, email: identifier }
            : { phoneVerified: true, phone: identifier }),
        },
      });
    }

    return { success: "احراز هویت موفق بود!" };
  } catch (error) {
    return { error: String(error) };
  }
};
