import { database } from "@igraph/database";
import axios from "axios";
import { addDays, format, subDays } from "date-fns";

//! --------------------------------------------------------

export function encodeUrl(url: string) {
  return url.split(" ").join("-").trim();
}

//! --------------------------------------------------

export function truncateFileName(name: string, maxLength = 20) {
  if (name.length <= maxLength) return name;

  const extIndex = name.lastIndexOf(".");
  const extension = extIndex !== -1 ? name.slice(extIndex) : "";
  const baseName = name.slice(0, extIndex);

  return baseName.slice(0, 10) + "....." + baseName.slice(-10) + extension;
}

//! --------------------------------------------------

export function aggregateByDay<T>(
  items: T[],
  getDate: (item: T) => string,
  getValue: (item: T) => number,
  days: number = 13
): { date: string; value: number }[] {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  const aggregation: Record<string, number> = items.reduce(
    (acc, item) => {
      const day = getDate(item);
      acc[day] = (acc[day] || 0) + getValue(item);
      return acc;
    },
    {} as Record<string, number>
  );

  const result: { date: string; value: number }[] = [];
  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate = addDays(currentDate, 1)
  ) {
    const dayStr = currentDate.toISOString().split("T")[0];
    result.push({
      date: dayStr!,
      value: aggregation[dayStr!] || 0,
    });
  }

  return result;
}

//! --------------------------------------------------

type DataItem = {
  date: string;
  views: number;
  sessions: number;
};

export const getSumByTimeRange = (
  data: DataItem[],
  key: keyof DataItem,
  timeRange: string | number
): number => {
  const days = parseInt(timeRange.toString(), 10);
  if (isNaN(days) || days <= 0) return 0;

  const cutoffDate = format(subDays(new Date(), days), "yyyy-MM-dd");

  return data
    .filter((item) => item.date >= cutoffDate) // Filter data within range
    .reduce(
      (sum, item) => sum + (typeof item[key] === "number" ? item[key] : 0),
      0
    );
};

//! --------------------------------------------------

export function calculateSum(
  values: Array<Record<string, number | string>>,
  key: string
): number {
  return values.reduce((acc, curr) => acc + +(curr[key] || 0), 0);
}

//! --------------------------------------------------

export function cashBackCalculator(price: number): number {
  if (!price) return 0;

  // For every 100,000 Tomans, returns 10,000 Tomans
  const x = Math.floor(price / 100_000);
  return x < 0 ? 0 : x * 10_000;
}

//! --------------------------------------------------

export async function generateUniqueSerial(): Promise<string> {
  let isUnique = false;
  let serial = "";

  while (!isUnique) {
    serial = `${Math.floor(100000 + Math.random() * 900000)}`;

    const existingCertificate = await database.certificate.findUnique({
      where: { serial },
    });

    if (!existingCertificate) {
      isUnique = true;
    }
  }

  return serial;
}

//! --------------------------------------------------

export const detectInputType = (input: string) => {
  const persianDigitsRegex = /^[۰-۹]{11}$/;
  const englishDigitsRegex = /^0\d{10}$/;

  if (persianDigitsRegex.test(input) || englishDigitsRegex.test(input)) {
    return "phone";
  } else {
    return "email";
  }
};
//! --------------------------------------------------

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY!;

  const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret,
        response: token,
      },
    }
  );

  return data.success && data.score > 0.7;
}

export async function isHumanOrNot(token: string, lang: "FA" | "EN") {
  const isHuman = await verifyRecaptcha(token);

  if (!isHuman) {
    throw new Error(
      lang === "EN"
        ? "You've Noticed as a Bot, Please Try Again later..."
        : "شما ربات تشخیص داده شدید. لطفا مجددا یا بعدا اقدام کنید."
    );
  }
}

//! --------------------------------------------------

export function convertPersianDigitsToEnglish(input: string): string {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return input.replace(/[۰-۹]/g, (char) => String(persianDigits.indexOf(char)));
}

//! --------------------------------------------------

export const globalPageSize = 15;

export function pagination(page: string, pageSize?: number) {
  return {
    skip:
      (+page || 1) * (pageSize || globalPageSize) -
      (pageSize || globalPageSize),
    take: pageSize || globalPageSize,
  };
}

//! --------------------------------------------------

export function extractSummaryFromLexical(
  content: string,
  charLimit = 300
): string {
  const parsed = JSON.parse(content);
  let summary = "";

  function traverse(nodes: any[]) {
    for (const node of nodes) {
      if (
        node.type === "paragraph" &&
        node.children &&
        node.children.length > 0
      ) {
        summary = node.children.map((child: any) => child.text || "").join(" ");
        return;
      }
      if (node.children) {
        traverse(node.children);
        if (summary) return;
      }
    }
  }

  try {
    if (parsed.root && parsed.root.children) {
      traverse(parsed.root.children);
    }

    return summary.slice(0, charLimit);
  } catch (error) {
    console.error("Error extracting summary from Lexical JSON:", error);
    return "";
  }
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
