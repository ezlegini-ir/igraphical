"use server";

import { getTutorByIdentifier } from "@/data/tutor";
import { sendOtp } from "@igraph/utils";
import { isHumanOrNot } from "@igraph/utils";
import bcrypt from "bcrypt";

export const verifyLogin = async (
  identifier: string,
  password: string,
  recaptchaToken: string
) => {
  try {
    await isHumanOrNot(recaptchaToken, "EN");

    const existingTutor = await getTutorByIdentifier(identifier);
    if (!existingTutor) return { error: "Invalid Credentials" };

    const isValidPassword = await bcrypt.compare(
      password,
      existingTutor.password
    );

    if (!isValidPassword) return { error: "Invalid Credentials" };

    await sendOtp(identifier);
  } catch (error) {
    return { error: String(error) };
  }
};
