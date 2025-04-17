import PageTitle from "@igraph/ui/components/PageTitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@igraph/ui/components/ui/accordion";
import { Button } from "@igraph/ui/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

const Faq = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <PageTitle
        title="سوالات متداول"
        description="چنانچه سوالی دارید می‌توانید در این صفحه به پاسخ خود برسید"
      />

      <Accordion className="mb-12" type="single" collapsible>
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={index.toString()}>
            <AccordionTrigger className="text-sm">{item.q}</AccordionTrigger>
            <AccordionContent className="text-gray-500">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          در صورتی که پاسخ سوال خود را نیافتید، با پشتیبانی در ارتباط باشید
        </p>
        <Link href={"/panel/tickets/new"}>
          <Button variant={"secondary"} size={"sm"}>
            ارسال پیام
          </Button>
        </Link>
      </div>
    </div>
  );
};

const faqItems = [
  {
    q: "چگونه می‌توانم ویدیوها را دانلود کنم؟",
    a: "به منظور رعایت قوانین کپی‌رایت و جلوگیری از انتشار غیرمجاز دوره‌های آی‌گرافیکال در فضای مجازی، امکان دانلود ویدیوها برای کاربران فراهم نیست. شما می‌توانید تمامی ویدیوها را به صورت آنلاین از طریق حساب کاربری خود مشاهده نمایید.",
  },
  {
    q: "چگونه می‌توانم مدرک پایان دوره را دریافت کنم؟",
    a: "پس از تکمیل صد درصدی دوره، مدرک پایان دوره از طریق بخش «حساب کاربری > دوره‌ها > دوره های تکیمل شده» قابل دانلود خواهد بود.",
  },
  {
    q: "چگونه می‌توانم به ویدیوهای دوره دسترسی داشته باشم؟",
    a: "با ورود به حساب کاربری خود و مراجعه به بخش «دوره‌ها»، می‌توانید دوره مورد نظر را انتخاب کرده و از طریق کلاس درس به محتوای آموزشی و ویدیوها دسترسی پیدا کنید.",
  },
  {
    q: "چطور می‌توانم سؤالات خود را از مدرس بپرسم؟",
    a: "پس از ورود به کلاس درس از طریق حساب کاربری > دوره‌ها، می‌توانید سؤالات خود را مطرح کنید و از مدرسین آی‌گرافیکال پاسخ دریافت نمایید.",
  },
  {
    q: "مدت زمان پاسخ‌گویی مدرس چقدر است؟",
    a: "حداکثر زمان پاسخ‌گویی مدرسین، ۴۸ ساعت کاری پس از ثبت پرسش شما خواهد بود.",
  },
  {
    q: "آیا دسترسی من به ویدیوها محدودیت زمانی دارد؟",
    a: "خیر، دسترسی شما به محتوای دوره‌ها به صورت مادام‌العمر فعال خواهد بود. تنها کافی‌ست از طریق حساب کاربری خود به بخش «دوره‌ها» مراجعه نمایید.",
  },
  {
    q: "پس از اتمام دوره چه مدرکی ارائه می‌شود؟",
    a: "با پایان موفقیت‌آمیز دوره، گواهی رسمی مدرسه آی‌گرافیکال به صورت اختصاصی برای شما صادر و از طریق حساب کاربری قابل دریافت خواهد بود.",
  },
  {
    q: "آیا امکان خرید اقساطی دوره‌ها وجود دارد؟",
    a: " به زودی امکان خرید اقساطی برای برخی دوره‌ها فراهم خواهد شد. اطلاعات تکمیلی به‌زودی در دسترس قرار خواهد گرفت.",
  },
];

export default Faq;

export const metadata: Metadata = {
  title: "سوالات متداول",
  description:
    "  سوالات متداول درباره خدمات، حساب کاربری، پرداخت‌ها و پشتیبانی. پاسخ سریع به رایج‌ترین پرسش‌های کاربران.",
};
