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
  const enrollments = await database.enrollment.findMany({
    where: {
      courseId: {
        in: includedCourses,
        notIn: excludedCourses,
      },
    },
  });

  console.log(enrollments);

  const usersIds = enrollments.map((u) => u.userId);

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
