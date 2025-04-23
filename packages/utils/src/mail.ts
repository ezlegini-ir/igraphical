"use server";

import {
  PaymentType,
  renderFinishCourseEmail,
  renderOtpEmail,
  renderSuccessPaymentEmail,
} from "./email-templates";
import { mailer } from "./config/mailer";
import { generateEmailOtp } from "./otp";

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) => {
  try {
    const info = await mailer.sendMail({
      to,
      subject,
      html,
      from: `"آی‌گرافیکال" <test@igraphical.ir>`,
      // text,
      // replyTo: "support@igraphical.ir",
      // headers: {
      //   "List-Unsubscribe": `<mailto:unsubscribe@igraphical.ir?subject=unsubscribe>, <https://igraphical.ir/unsubscribe?email=${to}>`,
      // },
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

//! -------------------------------------------------------------------

export const sendOtpEmail = async (email: string, userId?: number) => {
  try {
    const { plainOtp } = await generateEmailOtp(email, userId);
    const emailHtml = await renderOtpEmail(plainOtp);

    await sendEmail({
      subject: `🔒 کد تایید: ${plainOtp}`,
      to: email,
      html: emailHtml,
      text: "کد احراز هویت",
    });

    return { success: true };
  } catch (error) {
    throw new Error(String(error));
  }
};

//! -------------------------------------------------------------------

export const sendSuccessPaymentEmail = async (
  email: string,
  fullName: string,
  payment: PaymentType
) => {
  const emailHtml = await renderSuccessPaymentEmail(fullName, payment);

  await sendEmail({
    to: email,
    subject: `✅ ثبت نام موفق!`,
    html: emailHtml,
    text: "ثبت نام شما موفق بود!",
  });
};

//! -------------------------------------------------------------------

export const sendFinishCourseEmail = async (
  email: string,
  courseTitle: string,
  fullName: string
) => {
  const emailHtml = await renderFinishCourseEmail(courseTitle, fullName);

  await sendEmail({
    to: email,
    subject: `🎉 تبریک اتمام دوره!`,
    html: emailHtml,
    text: "تبریک اتمام دوره",
  });
};
