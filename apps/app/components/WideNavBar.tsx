import IgraphLogo from "@igraph/ui/components/IgraphLogo";
import { Button } from "@igraph/ui/components/ui/button";
import UserBar from "@igraph/ui/components/UserBar";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { NavbarProps } from "./NavBar";

const WideNavBar = ({ user, isThereItemsInCart }: NavbarProps) => {
  return (
    <div className="flex justify-between items-center">
      <Link href={"/"}>
        <IgraphLogo size={142} />
      </Link>
      <ul className="flex gap-14 text-gray-700">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Link href={"/cart"} className="relative">
          <Button variant={"outline"} size={"icon"}>
            <ShoppingCart />
          </Button>
          {isThereItemsInCart && (
            <div className="h-2.5 animate-pulse w-2.5 rounded-full bg-red-500 z-10 absolute top-0 right-0 m-1" />
          )}
        </Link>

        {!user ? (
          <Link href={"/panel"}>
            <Button>حساب کاربری</Button>
          </Link>
        ) : (
          <UserBar user={user} />
        )}
      </div>
    </div>
  );
};

export default WideNavBar;

const menuItems: { label: string; href: string }[] = [
  { label: "دوره‌ها", href: "/courses" },
  { label: "وبلاگ", href: "/blog" },
  { label: "مدرسین", href: "/tutors" },
  { label: "استعلام مدرک", href: "/verify-cert" },
];
