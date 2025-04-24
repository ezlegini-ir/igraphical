import IgraphLogoSquare from "@igraph/ui/components/IgraphLogoSquare";
import SocialsIcon from "@igraph/ui/components/SocialsIcon";
import { Copyright } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="mt-20">
      <div className="flex justify-between md:items-center items-start border-b border-t py-6">
        <div className="space-y-4">
          <Link href={"/"}>
            <IgraphLogoSquare />
          </Link>

          <ul className="md:flex space-x-10 space-y-5 md:space-y-0 md:space-x-0 md:text-base text-nowrap md:gap-10 text-gray-600 columns-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-black text-sm">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <SocialsIcon />
        </div>

        <a
          className="w-[90px] h-[120px] rounded-sm overflow-hidden bg-slate-50"
          referrerPolicy="origin"
          target="_blank"
          href="https://trustseal.enamad.ir/?id=214895&Code=1Wgxc21JlxfhD1Coppnv"
        >
          <img
            referrerPolicy="origin"
            data-code="1Wgxc21JlxfhD1Coppnv"
            src="https://trustseal.enamad.ir/logo.aspx?id=214895&Code=1Wgxc21JlxfhD1Coppnv"
            alt="e-namad"
            className="cursor-pointer"
          />
        </a>
      </div>

      <div className="text-xs md:text-sm md:flex-row flex-col items-center gap-1 text-gray-500 pt-3  flex justify-between">
        <p>
          مطالعه{" "}
          <Link
            href={"/terms-and-conditions"}
            className="underline text-primary"
          >
            قوانین و حریم شخصی
          </Link>{" "}
          آی‌گرافیکال
        </p>

        <p className="flex gap-2">
          <Copyright size={18} />
          تمامی حقوق برای شرکت آی‌گرافیکال محفوظ می باشد!
        </p>
      </div>
    </div>
  );
};

const menuItems = [
  { label: "صفحه اصلی", href: "/" },
  { label: "تماس با ما", href: "/contact" },
  { label: "سوالات متداول", href: "/faq" },
];

export default Footer;
