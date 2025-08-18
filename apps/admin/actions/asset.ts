"use server";

import { getAssetById, getAssetByUrl } from "@/data/asset";
import { AssetFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import { deleteCloudFile, encodeUrl, uploadCloudFile } from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";

//* CREATE ------------------------------------------------------------

export const createAsset = async (data: AssetFormType) => {
  const { image, status, title, url, fileUrl, format, fileSize } = data;

  try {
    const encodedUrl = encodeUrl(url);

    const existingAsset = await getAssetByUrl(encodedUrl);

    if (existingAsset)
      return { error: "There Already is a asset with this Url" };

    const newAsset = await database.asset.create({
      data: {
        title,
        url: encodedUrl,
        status,
        fileUrl,
        fileSize,
        format,
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

    return { success: "Asset Created Successfully", data: newAsset };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateAsset = async (data: AssetFormType, assetId: number) => {
  const { fileUrl, format, image, status, title, url, fileSize } = data;

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
        status,
        title,
        url: encodedUrl,
        fileUrl,
        fileSize,
        format,
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
      include: { image: true },
    });

    if (!deletedAsset) return { error: "Could not remove Asset" };

    if (deletedAsset.image)
      await deleteCloudFile(deletedAsset.image?.public_id);

    return { success: "Asset Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
