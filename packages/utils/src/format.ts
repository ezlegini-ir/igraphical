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
