"use server";

import { isHumanOrNot } from "@igraph/utils";
import { CommentFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";

export const createComment = async (
  data: CommentFormType,
  recaptchaToken?: string
) => {
  const { content, fullName, postId, userId } = data;

  try {
    if (recaptchaToken) {
      await isHumanOrNot(recaptchaToken, "FA");
    }

    const existingPost = await database.post.findFirst({
      where: { id: postId },
    });
    if (!existingPost) throw new Error("این پست یافت نشد");

    const existingUser = await database.user.findFirst({
      where: { id: userId },
    });

    await database.comment.create({
      data: {
        content,
        authorId: userId || null,
        postId,
        fullName: existingUser ? existingUser.fullName : fullName,
      },
    });

    return { success: "دیدگاه شما با موفقیت ارسال شد." };
  } catch (error) {
    return { error: String(error) };
  }
};
