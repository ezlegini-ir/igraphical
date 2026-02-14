import ContactForm from "@/components/forms/ContactForm";
import PageTitle from "@igraph/ui/components/PageTitle";
import RecaptchaWrapper from "@igraph/ui/components/RecaptchaWrapper";
import SocialsIcon from "@igraph/ui/components/SocialsIcon";
import { Phone } from "lucide-react";
import { Metadata } from "next";

const page = () => {
  return (
    <div>
      <PageTitle
        title={"تماس با آی‌گرافیکال"}
        description={"در این صفحه می‌توانید با آی‌گرافیکال تماس بگیرید"}
      />

      <div className="flex flex-wrap md:flex-nowrap gap-10 lg:gap-20 justify-between">
        <div className="w-full lg:w-2/5 space-y-4">
          <h2 className="text-center md:text-right">راه های ارتباطی</h2>

          <p className="text-center md:text-right">
            برای دریافت سریع‌ترین پاسخ، فرم تماس را پر کنید تا درخواست شما را
            سریع و دقیق بررسی کنیم.
            <br />
            می‌توانید از طریق تلفن یا ایمیل هم با ما در تماس باشید، اما پیشنهاد
            می‌کنیم فرم را تکمیل کنید تا بهترین پاسخ را دریافت کنید. 🚀
          </p>

          <SocialsIcon />

          {/* <div className="border rounded-sm p-3 text-sm text-gray-500 flex justify-between items-center">
            <h3 className="text-base font-medium flex gap-2 items-center">
              <Mail size={18} />
              ایمیل
            </h3>

            <a href="mailto:igraphical.ir@gmail.com">igraphical.ir@gmail.com</a>
          </div> */}
          <div className="border rounded-sm p-3 text-sm text-gray-500 flex justify-between items-center">
            <h3 className="text-base font-medium flex gap-2 items-center">
              <Phone size={18} />
              شماره تماس
            </h3>

            <a href="tel:09962224177">{"0996-222-4177"}</a>
          </div>
        </div>

        <div className="w-full lg:w-3/5 space-y-3">
          <h2 className="text-center md:text-right">فرم تماس</h2>

          <RecaptchaWrapper
            recaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          >
            <ContactForm />
          </RecaptchaWrapper>
        </div>
      </div>
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "در صورت نیاز به پشتیبانی، مشاوره یا همکاری با ما در ارتباط باشید. اطلاعات تماس آی‌گرافیکال شامل ایمیل، شماره‌تماس، شبکه‌های اجتماعی و فرم تماس.",
};
