"use server";

import { getAdminById, getAdminByIdentifier } from "@/data/admin";
import { AdminFormType } from "@/lib/validationSchema";
import { database } from "@igraph/database";
import bcrypt from "bcrypt";
import { UploadApiResponse } from "cloudinary";
import { deleteCloudFile, uploadCloudFile } from "@igraph/utils";

//* CREATE ------------------------------------------------------------

export const createAdmin = async (data: AdminFormType) => {
  const { displayName, email, name, phone, role, password, image } = data;
  if (!password) return { error: "Password Required." };

  try {
    const existingAdminByEmail = await getAdminByIdentifier(email);
    if (existingAdminByEmail)
      return { error: "User with this Email Already Exists." };

    const existingAdminByPhone = await getAdminByIdentifier(phone);
    if (existingAdminByPhone)
      return { error: "User with this Phone Already Exists." };

    let hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await database.admin.create({
      data: {
        displayName,
        email,
        name,
        password: hashedPassword,
        phone,
        role,
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "admin",
          resource_type: "image",
        }
      )) as UploadApiResponse;

      // CREATE IMAGE
      await database.image.create({
        data: {
          url: secure_url,
          public_id,
          format,
          size: bytes,
          type: "USER",
          admin: {
            connect: {
              id: newAdmin.id,
            },
          },
        },
      });
    }

    return { success: "Admin Created Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//? UPDATE ------------------------------------------------------------

export const updateAdmin = async (data: AdminFormType, id: number) => {
  const { displayName, email, name, phone, role, password, image } = data;

  try {
    const existingAdmin = await getAdminById(id);
    if (!existingAdmin) return { error: "No Admin Found" };

    if (id !== existingAdmin.id) {
      if (existingAdmin && existingAdmin.email === email)
        return { error: "User with this Email Already Exists." };

      if (existingAdmin && existingAdmin.phone === phone)
        return { error: "User with this Phone Already Exists." };
    }

    let hashedPassword;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    const updatedAdmin = await database.admin.update({
      where: {
        id: existingAdmin.id,
      },
      data: {
        id,
        displayName,
        email,
        name,
        password: password ? hashedPassword : existingAdmin.password,
        phone,
        role,
      },
      include: {
        image: true,
      },
    });

    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const { secure_url, public_id, format, bytes } = (await uploadCloudFile(
        buffer,
        {
          folder: "admin",
          resource_type: "image",
          width: 300,
        }
      )) as UploadApiResponse;

      if (updatedAdmin.image) {
        await deleteCloudFile(updatedAdmin.image.public_id);

        // CREATE IMAGE
        await database.image.update({
          where: {
            adminId: updatedAdmin.id,
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
            admin: {
              connect: {
                id: updatedAdmin.id,
              },
            },
          },
        });
      }
    }

    return { success: "Updated Successfully" };
  } catch (error) {
    return { error: "Error 500: " + error };
  }
};

//! DELETE ------------------------------------------------------------

export const deleteAdmin = async (id: number) => {
  try {
    const existingAdmin = await getAdminById(id);
    if (!existingAdmin) return { error: "No Admin Found" };

    const deletedAdmin = await database.admin.delete({
      where: { id },
      include: { image: true },
    });

    if (!deletedAdmin) return { error: "Could not remove admin" };

    if (deletedAdmin.image)
      await deleteCloudFile(deletedAdmin.image?.public_id);

    return { success: "Deleted Successfully" };
  } catch (error) {
    return { error: "500: " + error };
  }
};
