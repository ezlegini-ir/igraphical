"use server";

import { SlidersFormType } from "@/lib/validationSchema";
import { database, SliderType } from "@igraph/database";
import { UploadApiResponse } from "cloudinary";
import { deleteCloudFile, uploadManyCloudFiles } from "@igraph/utils";

//* CREATE ------------------------------------------------------------

export const createSlider = async (data: SlidersFormType, type: SliderType) => {
  const { images } = data;

  try {
    const buffers = await Promise.all(
      images
        .filter((item) => item.image)
        .map(async (item) => Buffer.from(await item.image!.arrayBuffer()))
    );

    const uploadedSliders = (await uploadManyCloudFiles(buffers, {
      folder: "slider",
      resource_type: "image",
      width: 1500,
    })) as UploadApiResponse[];

    await database.$transaction(async (tx) => {
      const newSliders = await Promise.all(
        images.map(({ link, active }) =>
          tx.slider.create({
            data: {
              link,
              active,
              type: type,
            },
          })
        )
      );

      await Promise.all(
        uploadedSliders.map(({ secure_url, bytes, format, public_id }, index) =>
          tx.image.create({
            data: {
              url: secure_url,
              public_id,
              format,
              type: "SLIDER",
              size: bytes,
              slider: {
                connect: { id: newSliders[index].id },
              },
            },
          })
        )
      );

      return newSliders;
    });

    return { success: "Sliders Created Successfully" };
  } catch (error) {
    return { error: String(error) };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateSlider = async (
  data: SlidersFormType,
  type: SliderType,
  existingIds: number[]
) => {
  const { images } = data;

  try {
    await database.$transaction(async (tx) => {
      // Loop over every form slider entry
      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        if (i < existingIds.length) {
          // Update existing slider (update the first N entries)
          const sliderId = existingIds[i];
          await tx.slider.update({
            where: { id: sliderId },
            data: {
              link: img.link,
              active: img.active,
              type,
            },
          });

          // If a new file was provided, update the image record too
          if (img.image) {
            const buffer = Buffer.from(await img.image.arrayBuffer());
            const [uploadedImage] = (await uploadManyCloudFiles([buffer], {
              folder: "slider",
              resource_type: "image",
              width: 1500,
            })) as UploadApiResponse[];

            // Use upsert so that if an image record exists, it’s updated; otherwise, it’s created.
            await tx.image.upsert({
              where: { sliderId: sliderId },
              update: {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
                format: uploadedImage.format,
                type: "SLIDER",
                size: uploadedImage.bytes,
              },
              create: {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
                format: uploadedImage.format,
                type: "SLIDER",
                size: uploadedImage.bytes,
                slider: { connect: { id: sliderId } },
              },
            });
          }
        } else {
          // For any extra form entries, create a new slider
          const createdSlider = await tx.slider.create({
            data: {
              link: img.link,
              active: img.active,
              type,
            },
          });

          if (img.image) {
            const buffer = Buffer.from(await img.image.arrayBuffer());
            const [uploadedImage] = (await uploadManyCloudFiles([buffer], {
              folder: "slider",
              resource_type: "image",
              width: 1500,
            })) as UploadApiResponse[];

            await tx.image.create({
              data: {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
                format: uploadedImage.format,
                type: "SLIDER",
                size: uploadedImage.bytes,
                slider: { connect: { id: createdSlider.id } },
              },
            });
          }
        }
      }
    });

    return { success: "Sliders updated successfully" };
  } catch (error: any) {
    console.error("Error updating sliders:", error);
    return { error: "Error 500: " + error.message };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteSlider = async (id: number, public_id?: string) => {
  try {
    const existingSlider = await database.slider.findUnique({
      where: { id },
      include: { image: true }, // Ensure image relation is loaded
    });

    if (!existingSlider) return { error: "Slider not found" };

    await database.$transaction(async (tx) => {
      // Delete the Cloudinary image first (if exists)
      if (public_id && existingSlider.image) {
        await deleteCloudFile(public_id);
      }

      // Delete the associated image record (if needed)
      if (existingSlider.image) {
        await tx.image.delete({
          where: { id: existingSlider.image.id },
        });
      }

      // Delete the slider
      await tx.slider.delete({ where: { id } });
    });

    return { success: "Slider Removed Successfully" };
  } catch (error) {
    console.error("Error deleting slider:", error);
    return { error: "Error 500: " + error };
  }
};
