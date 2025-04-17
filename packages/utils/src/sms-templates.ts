export function finishCourseSmsText(fullName: string) {
  const message = [
    `🔷 تبریک ${fullName} عزیز،`,
    "🎉 شما دوره خود را به اتمام رساندید.",
    "لطفا با ثبت نظر، ما را در جهت بهبود کیفیت دوره‌ها یاری بفرمایید.",
    "آی‌گرافیکال",
  ].join("\n");

  return message;
}

export function newJoinedStudentSmsText(fullName: string) {
  const message = [
    `🔷 ${fullName} عزیز،`,
    "❤️ به جمع کاربران آی‌گرافیکال خوش آمدید.",
  ].join("\n");

  return message;
}

export function successfullPaymentSmsText(fullName: string, price: number) {
  const message = [
    `🔷 ${fullName} عزیز،`,
    `✅ ثبت نام شما با مبلغ ${price.toLocaleString("en-US")} تومان موفق بود.`,
    "آی‌گرافیکال",
  ].join("\n");

  return message;
}

export function paidSettlmentSmsText(fullName: string, amount: number) {
  const message = [
    `🔷 ${fullName} عزیز، مدرس محترم آی‌گرافیکال،`,
    `مبلغ ${amount.toLocaleString("en-US")} تومان، جهت تسویه این دوره از حق فروش شما در وبسایت آی‌گرافیکال در صف پرداخت قرار گرفت.`,
    "همکاری با شما، افتخار ماست.",
    "آی‌گرافیکال",
  ].join("\n");

  return message;
}
