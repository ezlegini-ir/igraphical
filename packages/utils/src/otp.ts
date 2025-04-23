"use server";

import { database } from "@igraph/database";
import bcrypt from "bcryptjs";
import { sendOtpSms } from "./sms";
import { sendOtpEmail } from "./mail";
import { detectInputType } from "@igraph/utils";

const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const generateExpires = (minute: number) => {
  return new Date(new Date().getTime() + minute * 60 * 1000); // 1min
};

export const generateSmsOtp = async (identifier: string, userId?: number) => {
  // GENERATE DAYA
  const plainOtp = generateOtpCode();
  const expires = generateExpires(2); //2min

  // LOOK UP USER
  const existingToken = await database.otp.findFirst({
    where: { identifier },
  });

  if (existingToken)
    await database.otp.delete({
      where: { identifier },
    });

  // HASH OTP
  const hashedOTP = await bcrypt.hash(plainOtp, 10);

  await database.otp.create({
    data: {
      expires,
      identifier,
      otpCode: hashedOTP,
      type: "SMS",
      userId,
    },
  });

  return { plainOtp };
};

export const generateEmailOtp = async (identifier: string, userId?: number) => {
  // GENERATE DAYA
  const plainOtp = generateOtpCode();
  const expires = generateExpires(2); //2min

  // LOOK UP USER
  const existingToken = await database.otp.findFirst({
    where: {
      identifier,
    },
  });

  if (existingToken)
    await database.otp.delete({
      where: { identifier },
    });

  // HASH OTP
  const hashedOTP = await bcrypt.hash(plainOtp, 10);

  await database.otp.create({
    data: {
      expires,
      identifier,
      otpCode: hashedOTP,
      type: "EMAIL",
      userId,
    },
  });

  return { plainOtp };
};

export const sendOtp = async (identifier: string) => {
  const inputType = detectInputType(identifier);

  if (inputType === "phone") {
    await sendOtpSms(identifier);
  } else {
    await sendOtpEmail(identifier);
  }
};
