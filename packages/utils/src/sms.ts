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

const sender = process.env.KAVENEGAR_SENDER!;

export const sendOtpSms = async (phone: string, userId?: number) => {
  try {
    const { plainOtp } = await generateSmsOtp(phone, userId);

    const receptor = convertPersianDigitsToEnglish(phone);

    kavenegar.VerifyLookup(
      {
        receptor,
        token: plainOtp,
        template: "igraphical",
      },
      function (response, status) {
        console.log(response);
        console.log(status);
      },
    );
  } catch (error) {
    console.error(error as Error);
  }
};

//! SEND -----------------------------------------------------

export const sendSms = async (data: { message: string; phone: string }) => {
  const { message, phone } = data;

  const receptor = convertPersianDigitsToEnglish(phone);

  return kavenegar.Send(
    {
      message,
      sender,
      receptor,
    },
    function (response, status) {
      // console.log(response);
      // console.log(status);
    },
  );
};

//! SEND ARRAY -----------------------------------------------------
type Entry = {
  messageid: number;
  status: number;
  statustext: string;
  cost?: number;
  receptor?: string;
};

function sendArrayChunk(receptors: string[], msg: string): Promise<Entry[]> {
  const messages = new Array(receptors.length).fill(msg);

  return new Promise((resolve, reject) => {
    kavenegar.SendArray(
      {
        receptor: JSON.stringify(receptors),
        sender: JSON.stringify([sender]),
        message: JSON.stringify(messages),
      },
      (entries, status, responseMessage) => {
        if (status === 200) {
          resolve(entries);
        } else {
          reject(new Error(responseMessage || `Status ${status}`));
        }
      },
    );
  });
}

type SendArrayOptions = {
  numbers: string[];
  message: string;
};

export async function sendArraySms(
  options: SendArrayOptions,
): Promise<Entry[]> {
  const numbers = (options.numbers || []).filter(Boolean);
  if (numbers.length === 0) return [];

  const chunkSize = 200; // BASED ON KAVENEGAR POLICY
  const allEntries: Entry[] = [];

  for (let i = 0; i < numbers.length; i += chunkSize) {
    const chunk = numbers.slice(i, i + chunkSize);
    const sentMessages = await sendArrayChunk(chunk, options.message);
    allEntries.push(...sentMessages);
  }

  return allEntries;
}

//! -----------------------------------------------------

export async function statusChunk(ids: number[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    kavenegar.Status(
      { messageid: ids.join(",") },
      (entries: any[], status: number, message: string) => {
        if (status === 200) {
          resolve(entries);
        } else {
          reject(new Error(message || `Status API error ${status}`));
        }
      },
    );
  });
}

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
  phone: string,
) => {
  sendSms({
    message: newJoinedStudentSmsText(firstName),
    phone: phone,
  });
};

//! -----------------------------------------------------

export const sendSuccessPaymentSms = async (
  firstName: string,
  phone: string,
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
  amount: number,
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
  const ticketsCount = await database.ticket.count({
    where: { status: "PENDING" },
  });

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
