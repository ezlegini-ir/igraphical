"use server";

import { TicketFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import { uploadCloudFile } from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";

export const createTicket = async (data: TicketFormType, userId: number) => {
  const { department, subject, file, message } = data;

  try {
    const newTicket = await database.ticket.create({
      data: {
        department,
        status: "PENDING",
        subject,
        userId,
        messages: {
          create: {
            userId,
            message: message || "",
            senderType: "USER",
          },
        },
      },
      include: {
        messages: true,
      },
    });

    if (file && file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name;
      const fileFormat = file.name.split(".").pop() || "raw";
      const isImageType = file.type.includes("image");

      const { secure_url, bytes, public_id, format, resource_type } =
        (await uploadCloudFile(buffer, {
          format: fileFormat,
          resource_type: isImageType ? "image" : "raw",
          folder: "ticket",
        })) as UploadApiResponse;

      await database.file.create({
        data: {
          format: format || fileFormat,
          public_id,
          size: bytes,
          type: "TICKET_ASSET",
          url: secure_url,
          resource_type,
          fileName,
          ticketMessageId: newTicket.messages[0].id,
        },
      });
    }

    return { success: "تیکت شما با موفقیت ارسال شد", data: newTicket };
  } catch (error) {
    return { error: String(error) };
  }
};

//* CREATE -------------------------

export const sendTicketMessage = async (
  data: { message?: string; file?: File },
  ticketId: number,
  userId: number
) => {
  const { file, message } = data;

  try {
    const existingTicket = await database.ticket.findFirst({
      where: { id: ticketId },
    });

    if (!existingTicket) return { error: "Ticket Not Found" };

    const newMessage = await database.ticketMessage.create({
      data: {
        message: message?.trim() || "",
        senderType: "USER",
        userId,
        ticketId,
      },
    });

    await database.ticket.update({
      where: { id: ticketId },
      data: {
        status: "PENDING",
      },
    });

    if (file && file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name;
      const fileFormat = file.name.split(".").pop() || "raw";
      const isImageType = file.type.includes("image");

      const { secure_url, bytes, public_id, format, resource_type } =
        (await uploadCloudFile(buffer, {
          format: fileFormat,
          resource_type: isImageType ? "image" : "raw",
          folder: "ticket",
        })) as UploadApiResponse;

      await database.file.create({
        data: {
          format: format || fileFormat,
          public_id,
          size: bytes,
          resource_type,
          fileName,
          type: "TICKET_ASSET",
          url: secure_url,
          ticketMessage: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    return { success: "پیام شما با موفقیت ارسال شد" };
  } catch (error) {
    return { error: String(error) };
  }
};

//! CLOSE -------------------------

export const closeTicket = async (ticketId: number) => {
  try {
    const existingTicket = await database.ticket.findFirst({
      where: { id: ticketId },
    });

    if (!existingTicket) return { error: "Ticket Not Found" };

    await database.ticket.update({
      where: { id: ticketId },
      data: {
        status: "CLOSED",
      },
    });

    return { success: "تیکت بسته شد. برای باز شدن مجدد پیامی ارسال کنید" };
  } catch (error) {
    return { error: String(error) };
  }
};
