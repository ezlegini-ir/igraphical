"use server";

import {
  ProfileFormType,
  registerUserFormSchema,
  RegisterUserFormType,
} from "@/lib/validationSchema";
import { database } from "@igraph/database";
import { detectInputType, sendRegistrationCongratsSms } from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";
import { deleteCloudFile, uploadCloudFile } from "@igraph/utils";
import { getUserById } from "@/data/user";

//* CREATE --------------------------------------------------------

export async function registerUser(
  data: RegisterUserFormType,
  indentifer: string
) {
  const { email, firstName, lastName, nationalId, phone } = data;

  try {
    //  FORM VALIDATION
    const validation = registerUserFormSchema.safeParse(data);
    if (!validation.success) return { error: "Form Inputs Not Valid" };

    // USER LOOKUP
    const existingUser = await database.user.findFirst({
      where: {
        OR: [{ email }, { nationalId }, { phone }],
      },
    });

    if (existingUser && existingUser.email === email)
      return { error: "با این ایمیل کاربری از قبل وجود دارد." };

    if (existingUser && existingUser.phone === phone)
      return { error: "با این شماره تماس کاربری از قبل وجود دارد." };

    if (existingUser && existingUser.nationalId === nationalId)
      return { error: "با این کد ملی کاربری از قبل وجود دارد." };

    const type = detectInputType(indentifer);
    // CREATE USER
    const newUser = await database.user.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        nationalId,
        phone,
        ...(type === "email"
          ? { emailVerified: true }
          : { phoneVerified: true }),
      },
    });

    await sendRegistrationCongratsSms(newUser.fullName, newUser.phone);

    return { success: "User Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
}

//* UPDATE --------------------------------------------------------

export const updateUserProfile = async (data: ProfileFormType, id: number) => {
  const { firstName, lastName, image, nationalId } = data;

  try {
    // USER LOOP UP
    const existingUser = await getUserById(id);
    if (!existingUser) return { error: "user not found" };

    await database.$transaction(async (tx) => {
      if (!existingUser.nationalId) {
        const existingUserByNationalCode = await tx.user.findFirst({
          where: { nationalId },
        });

        if (existingUserByNationalCode)
          throw new Error("با این کد ملی کاربری دیگر ثبت نام کرده است.");
      }

      const updatedUser = await tx.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          nationalId: !existingUser.nationalId ? nationalId : undefined,
          fullName: `${firstName} ${lastName}`,
        },
        include: { image: true },
      });

      if (image && image instanceof File) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
          buffer,
          {
            folder: "user",
            resource_type: "image",
            width: 300,
          }
        )) as UploadApiResponse;

        if (updatedUser.image)
          await deleteCloudFile(updatedUser.image.public_id);

        await tx.image.upsert({
          where: { userId: updatedUser.id },
          update: {
            url: secure_url,
            type: "USER",
            public_id,
            format,
            size: bytes,
          },
          create: {
            url: secure_url,
            public_id,
            format,
            type: "USER",
            size: bytes,
            user: {
              connect: {
                id: updatedUser.id,
              },
            },
          },
        });
      }

      return updatedUser;
    });

    return { success: "با موفقیت ذخیره شد" };
  } catch (error) {
    return { error: String(error) };
  }
};

export const confirmCredential = async (
  userId: number,
  phone?: string,
  email?: string
) => {
  try {
    const existingUser = await database.user.findFirst({
      where: { id: userId },
    });
    if (!existingUser) throw new Error("کاربر یافت نشد.");

    await database.user.update({
      where: { id: userId },
      data: { phone, phoneVerified: true },
    });

    return { success: "شماره تماس با موفقیت تایید شد." };
  } catch (error) {
    return { error: String(error) };
  }
};
