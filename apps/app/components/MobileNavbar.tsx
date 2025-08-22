"use client";

import { BookOpen, CheckCircle, Home, TvMinimalPlay, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const rootItems = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/courses", label: "دوره ها", icon: TvMinimalPlay },
  { href: "/blog", label: "بلاگ", icon: BookOpen },
  { href: "/verify-cert", label: "استعلام مدرک", icon: CheckCircle },
  { href: "/panel", label: "حساب کاربری", icon: User },
];

export default function MobileNavbar() {
  const pathName = usePathname();
  const hideMobileNavbar = pathName.startsWith("/courses/");

  return (
    !hideMobileNavbar && (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md md:hidden z-50">
        <ul className="flex justify-around items-center h-14">
          {rootItems.map(({ href, label, icon: Icon }) => (
            <li key={href} className="w-1/5">
              <Link
                href={href}
                className="flex flex-col gap-0.5 items-center text-slate-500 hover:text-primary"
              >
                <Icon size={20} />
                <span className="text-[11px]">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  );
}
