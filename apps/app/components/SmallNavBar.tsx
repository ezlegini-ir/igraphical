import DropDownMenuBar from "@igraph/ui/components/DropdownMenuBar";
import IgraphLogoSquare from "@igraph/ui/components/IgraphLogoSquare";
import { Button } from "@igraph/ui/components/ui/button";
import {
  BookOpen,
  CircleCheckBig,
  Phone,
  ShoppingCart,
  TvMinimalPlay,
  UserIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { JSX } from "react";
import { NavbarProps } from "./NavBar";

const SmallNavBar = ({ user, isThereItemsInCart }: NavbarProps) => {
  return (
    <div className="px-2">
      <div className="flex justify-between">
        <Link href={"/"}>
          <IgraphLogoSquare size={48} />
        </Link>

        <div className="flex gap-2 text-gray-500">
          <Link href={"/cart"} className="relative">
            <Button variant={"outline"} size={"icon"}>
              <ShoppingCart className="scale-125" />
            </Button>
            {isThereItemsInCart && (
              <div className="h-2.5 animate-pulse w-2.5 rounded-full bg-red-500 z-10 absolute top-0 right-0 m-1" />
            )}
          </Link>

          <DropDownMenuBar menuItems={dropDownMenuItems} user={user} />
        </div>
      </div>
    </div>
  );
};

export default SmallNavBar;

const dropDownMenuItems: { label: string; href: string; icon: JSX.Element }[] =
  [
    { label: "حساب کاربری", href: "/panel", icon: <UserIcon /> },
    { label: "دوره‌ها", href: "/courses", icon: <TvMinimalPlay /> },
    { label: "وبلاگ", href: "/blog", icon: <BookOpen /> },
    { label: "مدرسین", href: "/tutors", icon: <Users /> },
    { label: "استعلام مدرک", href: "/verify-cert", icon: <CircleCheckBig /> },
    { label: "تماس با ما", href: "/contact", icon: <Phone /> },
  ];
