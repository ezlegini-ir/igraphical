"use server";

import { database } from "@igraph/database";
import { kavenegar } from "./config/kavenegar";
import { generateSmsOtp } from "./otp";
import {
  finishCourseSmsText,
  newJoinedStudentSmsText,
  newQaCreationText,
  newQaResponseText,
  newTicketCreationText,
  newTicketRsponseText,
  paidSettlmentSmsText,
  remindPendingEnrollmentText,
  successfullPaymentSmsText,
} from "./sms-templates";
import { convertPersianDigitsToEnglish } from "./utils";

export const sendOtpSms = async (phone: string, userId?: number) => {
  const { plainOtp } = await generateSmsOtp(phone, userId);

  const receptor = convertPersianDigitsToEnglish(phone);

  kavenegar.VerifyLookup(
    {
      receptor,
      token: plainOtp,
      template: "igraphical",
    },
    function (response, status) {
      // console.log(response)
      // console.log(status)
    }
  );
};

//! -----------------------------------------------------

export const sendSms = async (data: { message: string; phone: string }) => {
  const { message, phone } = data;

  const receptor = convertPersianDigitsToEnglish(phone);

  return kavenegar.Send(
    {
      message,
      sender: process.env.KAVENEGAR_SENDER,
      receptor,
    },
    function (response, status) {
      // console.log(response);
      // console.log(status);
    }
  );
};

//! -----------------------------------------------------

export const sendFinishCourseSms = async (firstName: string, phone: string) => {
  sendSms({
    message: finishCourseSmsText(firstName),
    phone: phone,
  });
};

//! -----------------------------------------------------

export const sendRegistrationCongratsSms = async (
  firstName: string,
  phone: string
) => {
  sendSms({
    message: newJoinedStudentSmsText(firstName),
    phone: phone,
  });
};

//! -----------------------------------------------------

export const sendSuccessPaymentSms = async (
  firstName: string,
  phone: string
) => {
  sendSms({
    message: successfullPaymentSmsText(firstName),
    phone: phone,
  });
};

//! -----------------------------------------------------

export const sendPaidSettlmentSms = async (
  fullName: string,
  phone: string,
  amount: number
) => {
  sendSms({
    message: paidSettlmentSmsText(fullName, amount),
    phone: phone,
  });
};

//! -----------------------------------------------------

export const sendRemindPedningEnrollmentSms = async ({
  firstName,
  phone,
}: {
  firstName: string;
  phone: string;
}) => {
  sendSms({
    message: remindPendingEnrollmentText(firstName),
    phone: phone,
  });
};

//! -----------------------------------------------------

export const sendNewTicketResponseSms = async (phone: string) => {
  sendSms({
    message: newTicketRsponseText(),
    phone: phone,
  });
};

//! -----------------------------------------------------

export const sendNewTicketCreationSms = async (phone: string) => {
  const ticketsCount = await database.ticket.count();

  sendSms({
    message: newTicketCreationText(ticketsCount),
    phone,
  });
};

//! -----------------------------------------------------

export const sendNewQaCreationSms = async (phone: string) => {
  sendSms({
    message: newQaCreationText(),
    phone,
  });
};
//! -----------------------------------------------------

export const newQaResponseSms = async (phone: string) => {
  sendSms({
    message: newQaResponseText(),
    phone,
  });
};
