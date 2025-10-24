"use server";

import { database } from "@igraph/database";
import ExcelJS from "exceljs";

export async function fullUserExport(): Promise<string> {
  const users = await database.user.findMany({
    select: {
      fullName: true,
      phone: true,
      email: true,
    },
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Users");

  worksheet.columns = [
    { header: "Full Name", key: "fullName", width: 30 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Email", key: "email", width: 30 },
  ];

  users.forEach((user) => worksheet.addRow(user));

  const buffer = await workbook.xlsx.writeBuffer();

  return Buffer.from(buffer).toString("base64");
}

interface ExportOptions {
  includedCourses: number[];
  excludedCourses: number[];
}

export async function customUserExport({
  excludedCourses,
  includedCourses,
}: ExportOptions): Promise<string> {
  let enrollments: { userId: number }[] = [];

  if (excludedCourses.length && includedCourses.length) {
    enrollments = await database.enrollment.findMany({
      where: {
        courseId: {
          in: includedCourses,
          notIn: excludedCourses,
        },
      },
      select: {
        userId: true,
      },
    });
  } else if (includedCourses.length) {
    enrollments = await database.enrollment.findMany({
      where: {
        courseId: {
          in: includedCourses,
        },
      },
      select: {
        userId: true,
      },
    });
  } else if (excludedCourses.length) {
    const users = await database.user.findMany({
      where: {
        enrollment: {
          every: {
            courseId: { notIn: excludedCourses },
          },
        },
      },
      select: {
        id: true,
      },
    });

    enrollments = users.map((user) => ({ userId: user.id }));
  }

  const usersIds = enrollments.map((enrollment) => enrollment.userId);

  const users = await database.user.findMany({
    where: {
      id: { in: usersIds },
    },
    select: {
      fullName: true,
      phone: true,
      email: true,
    },
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Users");

  worksheet.columns = [
    { header: "Full Name", key: "fullName", width: 30 },
    { header: "Phone", key: "phone", width: 30 },
    { header: "Email", key: "email", width: 30 },
  ];

  users.forEach((user) => worksheet.addRow(user));

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer).toString("base64");
}
