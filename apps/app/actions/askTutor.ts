"use server";

import { TicketMessageFormType } from "@/lib/validationSchema";
import { uploadCloudFile } from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";
import { database } from "@igraph/database";

export const createAskTutor = async (
  data: TicketMessageFormType,
  classRoomId: string,
  tutorId: number,
  userId: number,
  courseId: number,
  askTutorId: number | null
) => {
  const { message, file } = data;

  if (!message || message.trim() === "") {
    return { error: "Message content is required." };
  }

  try {
    await database.$transaction(async (tx) => {
      let currentAskTutorId = askTutorId;

      if (!currentAskTutorId) {
        const createdAskTutor = await tx.askTutor.create({
          data: {
            courseId,
            userId,
            status: "PENDING",
            tutorId,
            classRoom: {
              connect: {
                id: classRoomId,
              },
            },
          },
        });
        currentAskTutorId = createdAskTutor.id;
      } else {
        await tx.askTutor.update({
          where: { id: currentAskTutorId },
          data: {
            status: "PENDING",
          },
        });
      }

      const newMessage = await tx.askTutorMessages.create({
        data: {
          askTutorId: currentAskTutorId,
          message,
          senderType: "USER",
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

        await tx.file.create({
          data: {
            format: format || fileFormat,
            public_id,
            size: bytes,
            resource_type,
            fileName,
            type: "QA_ASSET",
            url: secure_url,
            askTutorMessageId: newMessage.id,
          },
        });
      }
    });

    return { success: "پیام شما با موفقیت ارسال شد!" };
  } catch (error) {
    return { error: String(error) };
  }
};
