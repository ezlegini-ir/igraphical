"use server";

import { User } from "@igraph/database";
import path from "path";
import PDFDocument from "pdfkit";
import { formatDuration } from "@igraph/utils";
import moment from "moment-jalaali";

function convertToPersianNumbers(text: string): string {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return text.replace(/\d/g, (match) => persianNumbers[parseInt(match)]!);
}

function reverseNumbersInText(text: string): string {
  return text.replace(/\d+/g, (match) => {
    const reversedNumber = match.split("").reverse().join("");
    return convertToPersianNumbers(reversedNumber);
  });
}

export async function generateCertificate(
  user: User,
  courseTitle: string,
  courseDuration: number,
  completedAt: Date,
  serialNumber: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const fontPath = path.join(
        process.cwd(),
        "public/fonts/Kalameh-Medium.ttf"
      );
      moment.loadPersian({
        dialect: "persian-modern",
        usePersianDigits: false,
      });
      const bgPath = path.join(process.cwd(), "public/certificate-temp.png");
      const persianFormattedDate = moment(completedAt).format("jDD/jMM/jYYYY");

      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        font: fontPath,
      });
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.image(bgPath, 0, 0, { width: 842, height: 595 });

      const pageWidth = doc.page.width;
      const margin = 50;

      doc.fontSize(21).text(courseTitle, margin, 170, {
        width: pageWidth - margin * 2,
        align: "center",
        features: ["rtla"],
      });

      doc
        .fontSize(10)
        .fillColor("#909090")
        .text(
          reverseNumbersInText(`شماره سریال: ${serialNumber}`),
          margin,
          210,
          {
            width: pageWidth - margin * 2,
            align: "center",
            features: ["rtla"],
          }
        );

      doc
        .fontSize(18)
        .fillColor("#000")
        .text(user.fullName, margin, 235, {
          width: pageWidth - margin * 2,
          align: "center",
          features: ["rtla"],
        });

      const certText = reverseNumbersInText(
        `به وسیله این گواهی اعلام می‌شود که ${user.fullName} با کد ملی ${user.nationalId} دوره مذکور را با موفقیت به اتمام رسانده است.`
      );
      doc
        .fontSize(11)
        .fillColor("#6d6d6d")
        .text(certText, margin, 265, {
          width: pageWidth - margin * 2,
          align: "center",
          features: ["rtla"],
        });

      const courseInfoText = reverseNumbersInText(
        `این دوره شامل ${formatDuration(
          courseDuration
        )} آموزش تخصصی بوده و در تاریخ ${persianFormattedDate} به پایان رسیده است.`
      );
      doc
        .fontSize(11)
        .fillColor("#6d6d6d")
        .text(courseInfoText, margin, 285, {
          width: pageWidth - margin * 2,
          align: "center",
          features: ["rtlm"],
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
