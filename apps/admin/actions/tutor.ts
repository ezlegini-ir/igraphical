"use server";

import { getTutorById, getTutorByIdentifier } from "@/data/tutor";
import { TutorFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import bcrypt from "bcrypt";
import { deleteCloudFile, uploadCloudFile } from "@igraph/utils";
import { UploadApiResponse } from "cloudinary";

//* CREATE ------------------------------------------------------------

export const createTutor = async (data: TutorFormType) => {
  const {
    displayName,
    email,
    name,
    phone,
    password,
    image,
    slug,
    bio,
    titles,
    profit,
  } = data;
  if (!password) return { error: "Password Required." };

  try {
    const existingTutorByEmail = await getTutorByIdentifier(email);
    if (existingTutorByEmail)
      return { error: "Tutor with this Email Already Exists." };

    const existingTutorByPhone = await getTutorByIdentifier(phone);
    if (existingTutorByPhone)
      return { error: "Tutor with this Phone Already Exists." };

    let hashedPassword = await bcrypt.hash(password, 10);

    const newTutor = await database.tutor.create({
      data: {
        displayName,
        email,
        name,
        password: hashedPassword,
        phone,
        slug,
        titles,
        bio,
        profit,
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "tutor",
          width: 300,
          resource_type: "image",
        }
      )) as UploadApiResponse;

      // CREATE IMAGE
      await database.image.create({
        data: {
          url: secure_url,
          public_id,
          format,
          type: "USER",
          size: bytes,
          tutor: {
            connect: {
              id: newTutor.id,
            },
          },
        },
      });
    }

    return { success: "Tutor Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateTutor = async (data: TutorFormType & { id: number }) => {
  const {
    displayName,
    email,
    id,
    name,
    phone,
    password,
    image,
    slug,
    bio,
    titles,
    profit,
  } = data;

  try {
    const existingTutor = await getTutorById(id);
    if (!existingTutor) return { error: "No Tutor Found" };

    if (id !== existingTutor.id) {
      if (existingTutor && existingTutor.email === email)
        return { error: "Tutor with this Email Already Exists." };

      if (existingTutor && existingTutor.phone === phone)
        return { error: "Tutor with this Phone Already Exists." };
    }

    let hashedPassword;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    const updatedTutor = await database.tutor.update({
      where: {
        id: existingTutor.id,
      },
      data: {
        id,
        displayName,
        email,
        name,
        password: password ? hashedPassword : existingTutor.password,
        phone,
        slug,
        bio,
        titles,
        profit,
      },
      include: { image: true },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "tutor",
          width: 800,
          resource_type: "image",
        }
      )) as UploadApiResponse;

      if (updatedTutor.image) {
        await deleteCloudFile(updatedTutor.image.public_id);

        // UPDATE IMAGE
        await database.image.update({
          where: {
            tutorId: updatedTutor.id,
          },
          data: {
            url: secure_url,
            public_id,
            format,
            type: "USER",
            size: bytes,
          },
        });
      } else {
        // CREATE IMAGE
        await database.image.create({
          data: {
            url: secure_url,
            public_id,
            format,
            type: "USER",
            size: bytes,
            tutor: {
              connect: {
                id: updatedTutor.id,
              },
            },
          },
        });
      }
    }

    return { success: "Tutor Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteTutor = async (id: number) => {
  try {
    const existingAdmin = await getTutorById(id);
    if (!existingAdmin) return { error: "No Tutor Found" };

    const tutor = await database.tutor.delete({
      where: { id },
      include: { image: true },
    });

    if (!tutor) return { error: "Could not remove admin" };

    if (tutor.image) await deleteCloudFile(tutor.image?.public_id);

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
