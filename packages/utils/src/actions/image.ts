"use server";

import { database } from "@igraph/database";
import { UploadApiResponse } from "cloudinary";
import {
  deleteCloudFile,
  FileUploadOptions,
  uploadCloudFile,
} from "../cloudinary";

//* CREATE ------------------------------------------------------------

export const createPostAssetImage = async (
  file: File,
  options?: FileUploadOptions
) => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
      buffer,
      options
    )) as UploadApiResponse;

    await database.image.create({
      data: {
        format,
        public_id,
        size: bytes,
        url: secure_url,
        type: "POST_ASSET",
      },
    });

    return { url: secure_url };
  } catch (error) {
    return { error: "Error: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteImage = async (public_id: string) => {
  try {
    const deletedImage = await database.image.delete({
      where: { public_id },
    });

    const res = (await deleteCloudFile(deletedImage.public_id)) as {
      result: "ok";
    };

    if (res.result !== "ok") return { error: "عملیات ناموفق" };

    return { success: "تصویر با موفقیت حذف شد!" };
  } catch (error) {
    return { error: String(error) };
  }
};
