"use server";

import { getPostById, getPostByUrl } from "@/data/post";
import { PostFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import { UploadApiResponse } from "cloudinary";
import { deleteCloudFile, uploadCloudFile } from "@igraph/utils";
import { encodeUrl } from "@igraph/utils";

//* CREATE ------------------------------------------------------------

export const createPost = async (data: PostFormType) => {
  const { author, categories, content, image, status, title, url } = data;

  try {
    const encodedUrl = encodeUrl(url);

    const existingPost = await getPostByUrl(encodedUrl);

    if (existingPost) return { error: "There Already is a post with this Url" };

    const newPost = await database.post.create({
      data: {
        title,
        url: encodedUrl,
        content,
        status: status === "0" ? "DRAFT" : "PUBLISHED",
        author: {
          connect: {
            id: +author,
          },
        },
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
          folder: "post",
          resource_type: "image",
          width: 800,
        }
      )) as UploadApiResponse;

      // CREATE IMAGE
      await database.image.create({
        data: {
          url: secure_url,
          public_id,
          format,
          type: "POST",
          size: bytes,
          post: {
            connect: {
              id: newPost.id,
            },
          },
        },
      });
    }

    return { success: "Admin Created Successfully", data: newPost };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updatePost = async (data: PostFormType, id: number) => {
  const { author, categories, content, image, status, title, url } = data;

  try {
    const encodedUrl = url.split(" ").join("-");

    const existingPostById = await getPostById(id);
    if (!existingPostById) return { error: "No Post Found" };

    const existingPostByUrl = await getPostByUrl(encodedUrl);
    if (existingPostByUrl) {
      if (existingPostByUrl.id !== existingPostById.id) {
        return { error: "Post with this URL already exists." };
      }
    }

    const updatedPost = await database.post.update({
      where: {
        id,
      },
      data: {
        content,
        status: status === "0" ? "DRAFT" : "PUBLISHED",
        title,
        url: encodedUrl,
        categories: {
          create: categories.map((categoryId) => ({
            category: {
              connect: { id: +categoryId },
            },
          })),
        },
        author: {
          connect: {
            id: +author,
          },
        },
      },
      include: { image: true },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "post",
          resource_type: "image",
          width: 800,
        }
      )) as UploadApiResponse;

      if (updatedPost.image) {
        await deleteCloudFile(updatedPost.image.public_id);
      }

      await database.image.upsert({
        where: { postId: updatedPost.id },
        update: {
          url: secure_url,
          public_id,
          format,
          size: bytes,
        },
        create: {
          url: secure_url,
          public_id,
          type: "POST",
          format,
          size: bytes,
          post: {
            connect: { id: updatedPost.id },
          },
        },
      });
    }

    return { success: "Updated Successfully", data: updatedPost };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deletePost = async (id: number) => {
  try {
    const existingPost = await getPostById(id);
    if (!existingPost) return { error: "No Post Found" };

    const deletedPost = await database.post.delete({
      where: { id },
      include: { image: true },
    });

    if (!deletedPost) return { error: "Could not remove Post" };

    if (deletedPost.image) await deleteCloudFile(deletedPost.image?.public_id);

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
