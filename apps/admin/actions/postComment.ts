"use server";

import { CommentFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";

//* CREATE ------------------------------------------------------------

export const createComment = async (data: CommentFormType) => {
  const { content, date, postId, userId } = data;

  try {
    await database.comment.create({
      data: {
        content,
        createdAt: date,
        post: {
          connect: { id: postId },
        },
        author: userId ? { connect: { id: userId } } : undefined,
      },
    });

    return { success: "Comment Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateComment = async (data: CommentFormType, id: number) => {
  const { content, date, userId } = data;

  try {
    const existingComment = await database.comment.findUnique({
      where: { id },
    });
    if (!existingComment) return { error: "No Comment Found" };

    await database.comment.update({
      where: { id },
      data: {
        content,
        createdAt: date,

        author: userId ? { connect: { id: userId } } : { disconnect: true },
      },
    });

    return { success: "Comment Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteComment = async (id: number) => {
  try {
    await database.comment.delete({
      where: { id },
    });

    return { success: "Comment Deleted Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};
