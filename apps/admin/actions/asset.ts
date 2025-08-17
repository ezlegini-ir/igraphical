"use server";

import { getAssetById, getAssetByUrl } from "@/data/asset";
import { AssetFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import {
  deleteCloudFile,
  deleteManyCloudFiles,
  encodeUrl,
  uploadCloudFile,
  uploadManyCloudFiles,
} from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";

//* CREATE ------------------------------------------------------------

export const createAsset = async (data: AssetFormType) => {
  const {
    categories,
    description,
    image,
    status,
    title,
    url,
    fileUrl,
    format,
    gallery,
  } = data;

  try {
    const encodedUrl = encodeUrl(url);

    const existingAsset = await getAssetByUrl(encodedUrl);

    if (existingAsset)
      return { error: "There Already is a asset with this Url" };

    const newAsset = await database.asset.create({
      data: {
        title,
        url: encodedUrl,
        description,
        status,
        fileUrl,
        format,
        categories: {
          create: categories.map((categoryId) => ({
            category: {
              connect: { id: +categoryId },
            },
          })),
        },
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "asset",
          resource_type: "image",
          width: 900,
        }
      )) as UploadApiResponse;

      // CREATE IMAGE
      await database.image.create({
        data: {
          url: secure_url,
          public_id,
          format,
          type: "DOWNLOADABLE_ASSET",
          size: bytes,
          asset: {
            connect: {
              id: newAsset.id,
            },
          },
        },
      });
    }

    if (gallery) {
      const buffers = await Promise.all(
        gallery.map(async (item) => Buffer.from(await item.arrayBuffer()))
      );

      const uploadedGallery = (await uploadManyCloudFiles(buffers, {
        folder: "asset",
        width: 900,
        resource_type: "image",
      })) as UploadApiResponse[];

      const newGallery = await database.assetGallery.create({
        data: {
          asset: {
            connect: {
              id: newAsset.id,
            },
          },
        },
      });

      await database.image.createMany({
        data: uploadedGallery.map(
          ({ secure_url, bytes, format, public_id }) => ({
            url: secure_url,
            public_id,
            format,
            type: "DOWNLOADABLE_ASSET",
            size: bytes,
            assetGalleryId: newGallery.id,
          })
        ),
      });
    }

    return { success: "Asset Created Successfully", data: newAsset };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateAsset = async (data: AssetFormType, assetId: number) => {
  const {
    categories,
    description,
    fileUrl,
    format,
    gallery,
    image,
    status,
    title,
    url,
  } = data;

  try {
    const encodedUrl = url.split(" ").join("-");

    const existingAssetById = await getAssetById(assetId);
    if (!existingAssetById) return { error: "No Asset Found" };

    const existingAssetByUrl = await getAssetByUrl(encodedUrl);
    if (existingAssetByUrl) {
      if (existingAssetByUrl.id !== existingAssetById.id) {
        return { error: "Asset with this URL already exists." };
      }
    }

    const updatedAsset = await database.asset.update({
      where: {
        id: assetId,
      },
      data: {
        description,
        status,
        title,
        url: encodedUrl,
        fileUrl,
        format,
        categories: {
          set: categories.map((categoryId) => ({
            assetId_categoryId: {
              assetId: assetId,
              categoryId: +categoryId,
            },
          })),
        },
      },
      include: { image: true },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "asset",
          resource_type: "image",
          width: 800,
        }
      )) as UploadApiResponse;

      if (updatedAsset.image) {
        await deleteCloudFile(updatedAsset.image.public_id);
      }

      await database.image.upsert({
        where: { assetId: updatedAsset.id },
        update: {
          url: secure_url,
          public_id,
          format,
          size: bytes,
        },
        create: {
          url: secure_url,
          public_id,
          type: "DOWNLOADABLE_ASSET",
          format,
          size: bytes,
          asset: {
            connect: { id: updatedAsset.id },
          },
        },
      });
    }

    if (gallery) {
      const buffers = await Promise.all(
        gallery.map(async (item) => Buffer.from(await item.arrayBuffer()))
      );
      const uploadedGallery = (await uploadManyCloudFiles(buffers, {
        folder: "course",
        resource_type: "image",
        width: 900,
      })) as UploadApiResponse[];

      let existingAssetGallery = await database.assetGallery.findFirst({
        where: { assetId },
      });

      if (!existingAssetGallery) {
        existingAssetGallery = await database.assetGallery.create({
          data: { asset: { connect: { id: assetId } } },
        });
      }

      await database.image.createMany({
        data: uploadedGallery.map(
          ({ secure_url, bytes, format, public_id }) => ({
            url: secure_url,
            public_id,
            format,
            type: "DOWNLOADABLE_ASSET",
            size: bytes,
            assetGallery: existingAssetGallery.id,
          })
        ),
      });
    }

    return { success: "Asset Updated Successfully", data: updatedAsset };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteAsset = async (id: number) => {
  try {
    const existingAsset = await getAssetById(id);
    if (!existingAsset) return { error: "No Asset Found" };

    const deletedAsset = await database.asset.delete({
      where: { id },
      include: { image: true, gallery: { include: { image: true } } },
    });

    if (!deletedAsset) return { error: "Could not remove Asset" };

    if (deletedAsset.image)
      await deleteCloudFile(deletedAsset.image?.public_id);

    const public_ids = deletedAsset.gallery?.image.map((img) => img.public_id);
    if (public_ids) {
      await deleteManyCloudFiles(public_ids);
    }

    return { success: "Asset Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
