"use server";

import { TicketFormType } from "@/lib/validationSchema";
import { database, File as FileType } from "@igraph/database";
import { deleteManyCloudFiles, uploadCloudFile } from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";

//* CREATE ---------------------------------------------------------

export const createTicket = async (data: TicketFormType) => {
  const { department, status, subject, userId, file, message } = data;

  try {
    const newTicket = await database.ticket.create({
      data: {
        department,
        status,
        subject,
        user: {
          connect: {
            id: userId,
          },
        },
        messages: {
          create: {
            message: message || "",
            senderType: "ADMIN",
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
          ticketMessage: {
            connect: {
              id: newTicket.messages[0].id,
            },
          },
        },
      });
    }

    return { success: "Ticket Sent Successfully", data: newTicket };
  } catch (error) {
    return { error: String(error) };
  }
};

//* CREATE -------------------------

export const sendTicketMessage = async (
  data: { message?: string; file?: File },
  id: number
) => {
  const { file, message } = data;

  try {
    const existingTicket = await database.ticket.findFirst({ where: { id } });

    if (!existingTicket) return { error: "Ticket Not Found" };

    const newMessage = await database.ticketMessage.create({
      data: {
        message: message?.trim() || "",
        senderType: "ADMIN",
        ticketId: id,
      },
    });

    await database.ticket.update({
      where: { id },
      data: {
        status: "REPLIED",
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

    return { success: "Message Sent Seccessfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//? UPDATE ---------------------------------------------------------

export const updateTicket = async (data: TicketFormType, id: number) => {
  const { department, status, subject } = data;

  try {
    const existingTicket = await database.ticket.findFirst({ where: { id } });

    if (!existingTicket) return { error: "Ticket Not Found" };

    const updatedTicket = await database.ticket.update({
      where: { id },
      data: {
        department,
        status,
        subject,
      },
    });

    return { success: "Ticket Updated Successfully", data: updatedTicket };
  } catch (error) {
    return { error: String(error) };
  }
};

//! DELETE ---------------------------------------------------------

export const deleteTicket = async (id: number) => {
  try {
    const existingTicket = await database.ticket.findFirst({ where: { id } });

    if (!existingTicket) return { error: "Ticket Not Found" };

    const deletedTicket = await database.ticket.delete({
      where: { id },
      include: {
        messages: {
          include: { attachment: true },
        },
      },
    });

    if (deletedTicket.messages.length > 0) {
      await deleteAttachmentsFromMessages(deletedTicket.messages);
    }

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

export const deleteTicketMessage = async (id: number) => {
  try {
    const existingTicketMessage = await database.ticketMessage.findFirst({
      where: { id },
    });

    if (!existingTicketMessage) return { error: "Ticket Message Not Found" };

    const deletedTicketMessage = await database.ticketMessage.delete({
      where: { id },
      include: {
        attachment: true,
      },
    });

    await deleteAttachmentsFromMessages([deletedTicketMessage]);

    return { success: "Message Deleted Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//* UTILS -----------------

export async function deleteAttachmentsFromMessages(
  messages: { attachment?: FileType | null }[]
) {
  const images_public_ids = messages
    .map((message) => message.attachment)
    .filter(
      (attachment): attachment is FileType =>
        Boolean(attachment) &&
        attachment?.resource_type === "image" &&
        Boolean(attachment.public_id)
    )
    .map((file) => file.public_id);

  const raw_public_ids = messages
    .map((message) => message.attachment)
    .filter(
      (attachment): attachment is FileType =>
        Boolean(attachment) &&
        attachment?.resource_type === "raw" &&
        Boolean(attachment.public_id)
    )
    .map((file) => file.public_id);

  if (images_public_ids.length > 0) {
    await deleteManyCloudFiles(images_public_ids);
  }

  if (raw_public_ids.length > 0) {
    await deleteManyCloudFiles(raw_public_ids, "raw");
  }
}
