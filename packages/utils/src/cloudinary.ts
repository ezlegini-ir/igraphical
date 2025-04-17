"use server";

import { v2 as cloudinary } from "cloudinary";

export interface FileUploadOptions {
  folder?:
    | "admin"
    | "tutor"
    | "user"
    | "course"
    | "post"
    | "asset"
    | "slider"
    | "certificate"
    | "ticket";
  width?: number;
  format?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
}

//* UPLOAD FILE --------------------------------------------------------------

export const uploadCloudFile = async (
  buffer: Buffer,
  options?: FileUploadOptions
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder:
            options?.resource_type === "raw"
              ? `/files/${options.folder}`
              : options?.resource_type === "video"
                ? `/videos/${options.folder}`
                : `/images/${options?.folder}`,
          format: options?.resource_type === "image" ? "webp" : options?.format,
          resource_type: options?.resource_type || "image",
          transformation: [{ width: options?.width || 500, crop: "limit" }],
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

//* UPLOAD MANY IMAGE --------------------------------------------------------------

export const uploadManyCloudFiles = async (
  buffers: Buffer[],
  options?: FileUploadOptions
) => {
  const uploadPromises = buffers.map((image) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder:
              options?.resource_type === "raw"
                ? `/files/${options.folder}`
                : options?.resource_type === "video"
                  ? `/videos/${options.folder}`
                  : `/images/${options?.folder}`,
            format:
              options?.resource_type === "image" ? "webp" : options?.format,
            resource_type: options?.resource_type || "image",
            transformation: [{ width: options?.width || 500, crop: "limit" }],
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(image);
    });
  });
  return Promise.all(uploadPromises);
};

//! DELETE IMAGE --------------------------------------------------------------

export const deleteCloudFile = async (
  public_id: string,
  resource_type: "image" | "raw" | "video" | "auto" = "image"
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      public_id,
      { resource_type },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

export const deleteManyCloudFiles = async (
  public_ids: string[],
  resource_type: "image" | "raw" | "video" | "auto" = "image"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(
      public_ids,
      { resource_type },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};
