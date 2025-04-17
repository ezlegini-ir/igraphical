"use server";

import { database } from "@igraph/database";
import { uploadCloudFile } from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";
import { QaFormType } from "@/lib/validationSchema";

export const sendAskTutorMessage = async (
  data: QaFormType,
  askTutorId: number
) => {
  const { message, file } = data;

  try {
    if (!message || message.trim() === "") {
      throw new Error("Message content is required.");
    }

    await database.$transaction(async (tx) => {
      const updatedAskTutor = await tx.askTutor.update({
        where: { id: askTutorId },
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

        await tx.file.create({
          data: {
            format: format || fileFormat,
            public_id,
            size: bytes,
            resource_type,
            fileName,
            type: "QA_ASSET",
            url: secure_url,
            askTutorMessage: {
              create: {
                message,
                senderType: "TUTOR",
                askTutorId,
              },
            },
          },
        });
      } else {
        await tx.askTutorMessages.create({
          data: {
            message,
            senderType: "TUTOR",
            askTutorId,
          },
        });
      }

      return updatedAskTutor;
    });

    return { success: "Message Sent Successfully." };
  } catch (error) {
    return { error: String(error) };
  }
};
