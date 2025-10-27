"use server";
import axios from "axios";

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY!;

  const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret,
        response: token,
      },
    }
  );

  return data.success && data.score > 0.5;
}

export async function isHumanOrNot(token: string, lang: "FA" | "EN") {
  const isHuman = await verifyRecaptcha(token);

  if (!isHuman) {
    throw new Error(
      lang === "EN"
        ? "You've Noticed as a Bot, Please Try Again later..."
        : "شما ربات تشخیص داده شدید. لطفا مجددا یا بعدا اقدام کنید."
    );
  }
}
