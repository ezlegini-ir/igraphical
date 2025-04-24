import moment, { loadPersian } from "moment-jalaali";
import { formatDistance, differenceInHours, format } from "date-fns";

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} دقیقه`;
  } else {
    const hours = minutes / 60;
    const roundedHours = Math.round(hours * 2) / 2;

    return `${roundedHours} ساعت`;
  }
}

export function formatDurationToWords(minutes: number): string {
  if (minutes < 60) {
    return `${persianNumbers[minutes]} دقیقه`;
  } else {
    const hours = minutes / 60;
    const isHalf = hours % 1 !== 0;
    const fullHours = Math.floor(hours);

    if (isHalf) {
      return `${persianNumbers[fullHours]} و نیم ساعت`;
    } else {
      return `${persianNumbers[fullHours]} ساعت`;
    }
  }
}

//! --------------------------------------------------

export function formatPrice(
  price: number | undefined | null,
  options?: { noValuePlaceholder?: string; showNumber?: boolean }
) {
  if (!price)
    return options?.showNumber ? 0 + " t" : options?.noValuePlaceholder || "--";

  return price.toLocaleString("en-US") + " t";
}

//! --------------------------------------------------

export const formatNumber = (num: number) => {
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (num < 1_000_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
};

export const formatPriceBy3Digits = (num: number) => {
  return num.toLocaleString("en-US");
};

//! --------------------------------------------------

// Load Persian locale settings once
loadPersian({ dialect: "persian-modern", usePersianDigits: true });

interface FormatDateOptions {
  withTime?: boolean;
  useMonthName?: boolean;
  format?: string;
}

export function formatJalaliDate(
  date: string | number | Date,
  options: FormatDateOptions = {}
): string {
  const { withTime = false, useMonthName = true, format } = options;

  let dateFormat = useMonthName ? "jDD jMMMM jYYYY" : "jYYYY/jMM/jDD";
  if (withTime) dateFormat += " - HH:mm";

  return moment(date).format(format || dateFormat);
}

//! --------------------------------------------------

export function smartformatJalaliDate(
  date: string | number | Date,
  options: FormatDateOptions = {}
): string {
  const now = moment();
  const input = moment(date);

  const diffInDays = now.diff(input, "days");

  if (diffInDays < 4) {
    return input.fromNow();
  } else {
    return formatJalaliDate(date, options);
  }
}

//! --------------------------------------------------

export const formatMiladiDate = (date: Date): string => {
  const hoursDiff = differenceInHours(new Date(), date);
  if (hoursDiff < 120) {
    return formatDistance(date, new Date(), { addSuffix: true });
  }

  return format(date, "yyyy/MM/dd - HH:mm");
};

const persianNumbers = [
  "صفر",
  "یک",
  "دو",
  "سه",
  "چهار",
  "پنج",
  "شش",
  "هفت",
  "هشت",
  "نه",
  "ده",
  "یازده",
  "دوازده",
  "سیزده",
  "چهارده",
  "پانزده",
  "شانزده",
  "هفده",
  "هجده",
  "نوزده",
  "بیست",
  "بیست و یک",
  "بیست و دو",
  "بیست و سه",
  "بیست و چهار",
  "بیست و پنج",
  "بیست و شش",
  "بیست و هفت",
  "بیست و هشت",
  "بیست و نه",
  "سی",
  "سی و یک",
  "سی و دو",
  "سی و سه",
  "سی و چهار",
  "سی و پنج",
  "سی و شش",
  "سی و هفت",
  "سی و هشت",
  "سی و نه",
  "چهل",
  "چهل و یک",
  "چهل و دو",
  "چهل و سه",
  "چهل و چهار",
  "چهل و پنج",
  "چهل و شش",
  "چهل و هفت",
  "چهل و هشت",
  "چهل و نه",
  "پنجاه",
  "پنجاه و یک",
  "پنجاه و دو",
  "پنجاه و سه",
  "پنجاه و چهار",
  "پنجاه و پنج",
  "پنجاه و شش",
  "پنجاه و هفت",
  "پنجاه و هشت",
  "پنجاه و نه",
  "شصت",
  "شصت و یک",
  "شصت و دو",
  "شصت و سه",
  "شصت و چهار",
  "شصت و پنج",
  "شصت و شش",
  "شصت و هفت",
  "شصت و هشت",
  "شصت و نه",
  "هفتاد",
  "هفتاد و یک",
  "هفتاد و دو",
  "هفتاد و سه",
  "هفتاد و چهار",
  "هفتاد و پنج",
  "هفتاد و شش",
  "هفتاد و هفت",
  "هفتاد و هشت",
  "هفتاد و نه",
  "هشتاد",
  "هشتاد و یک",
  "هشتاد و دو",
  "هشتاد و سه",
  "هشتاد و چهار",
  "هشتاد و پنج",
  "هشتاد و شش",
  "هشتاد و هفت",
  "هشتاد و هشت",
  "هشتاد و نه",
  "نود",
  "نود و یک",
  "نود و دو",
  "نود و سه",
  "نود و چهار",
  "نود و پنج",
  "نود و شش",
  "نود و هفت",
  "نود و هشت",
  "نود و نه",
  "صد",
];
