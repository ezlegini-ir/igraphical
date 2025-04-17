import { student } from "@/public";
import SocialsIcon from "@igraph/ui/components/SocialsIcon";
import { Button } from "@igraph/ui/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const WelcomeSection = () => {
  return (
    <div className="flex flex-col lg:flex-row flex-wrap md:flex-nowrap justify-between items-center gap-6 px-8 py-6 text-center md:text-right">
      <div className="space-y-8">
        <div>
          <h2>
            🎨 به مدرسه هنر <span className="text-primary">آی‌گرافیکال</span>{" "}
            خوش آمدید!
          </h2>
          <pre>{text}</pre>
        </div>

        <div className="space-y-2">
          <h2>🌟 چرا آی‌گرافیکال؟</h2>
          <ul className="md:columns-2 space-y-1.5 flex md:block flex-col items-center">
            {listItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <CircleCheckBig size={18} className="text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center md:justify-start gap-6">
          <Link href={"/courses"}>
            <Button>مشاهده دوره ها</Button>
          </Link>
          <SocialsIcon />
        </div>
      </div>

      <Image alt="Student" src={student} width={380} height={380} />
    </div>
  );
};

const text = `تو آی‌گرافیکال، یادگیری فقط درس و تمرین نیست؛ یه تجربه‌ی باحاله!
هر مهارتی که دوست داری—از طراحی گرافیک و نرم‌افزارهای حرفه‌ای تا مهارت‌های کامپیوتری—رو
می‌تونی از صفر تا صد یاد بگیری.
ما همیشه کنارتیم تا قدم‌به‌قدم جلو بری و به هدفت برسی. فقط کافیه شروع کنی!`;

const listItems = [
  "دوره های تخصصی و پروژه محور",
  "آپدیت ترین آموزش ها",
  "مدرسین حرفه ای و با تجربه",
  "پشتیبانی و پاسخگویی سریع",
  "دسترسی دائمی به دوره ها",
  "تخفیف های ویژه و فرصت های شغلی",
  "ارائه گواهی پایان دوره",
  "گواهی دوره قابل استعلام",
];

export default WelcomeSection;
