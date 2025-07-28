export function finishCourseSmsText(firstName: string) {
  const message = [
    `🔷 تبریک ${firstName} عزیز،`,
    "🎉 شما دوره خود را به اتمام رساندید.",
    "لطفا با ثبت نظر، ما را در جهت بهبود کیفیت دوره‌ها یاری بفرمایید.",
    "آی‌گرافیکال",
  ].join("\n");

  return message;
}

export function newJoinedStudentSmsText(firstName: string) {
  const message = [
    `🔷 ${firstName} عزیز،`,
    "❤️ به جمع کاربران آی‌گرافیکال خوش آمدید.",
  ].join("\n");

  return message;
}

export function successfullPaymentSmsText(firstName: string) {
  const message = [
    `🔷 ${firstName} عزیز،`,
    `✅ ثبت نام شما موفق بود.`,
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

export function remindPendingEnrollmentText(firstName: string) {
  const message = [
    `🔷 ${firstName} عزیز،`,
    `😅 هنوز دوره‌هایی که ثبت نام کردی رو شروع نکردی!`,
    "🚀 وقتشه که به مهارت هات اضافه کنی.",
    "آی‌گرافیکال",
  ].join("\n");

  return message;
}

export function newTicketRsponseText() {
  const message = [`🔷 به تیکت شما پاسخ داده شد.`, "آی‌گرافیکال"].join("\n");

  return message;
}

export function newTicketCreationText(ticketsCount: number) {
  const message = [
    `🔷 یک تیکت جدید دریافت شد.`,
    `تعداد کل: ${ticketsCount}`,
  ].join("\n");

  return message;
}

export function newQaCreationText() {
  const message = [`🔷 مدرس محترم آی‌گرافیکال`, `یک پرسش جدید ایجاد شد `].join(
    "\n"
  );

  return message;
}

export function newQaResponseText() {
  const message = [`🔷 به پرسش شما پاسخ داده شد`, `آی‌گرافیکال`].join("\n");

  return message;
}
