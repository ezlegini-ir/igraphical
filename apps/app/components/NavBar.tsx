import { database, Image, User } from "@igraph/database";
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
import DropDownMenuBar from "@igraph/ui/components/DropdownMenuBar";
import IgraphLogo from "@igraph/ui/components/IgraphLogo";
import IgraphLogoSquare from "@igraph/ui/components/IgraphLogoSquare";
import UserBar from "@igraph/ui/components/UserBar";
import { getSessionUser } from "@/data/user";

interface Props {
  user: (User & { image: Image | null }) | undefined | null;
}

const NavBar = async () => {
  const user = await getSessionUser();

  return (
    <>
      <div className="md:hidden z-50">
        <SmallNavBar user={user} />
      </div>
      <div className="hidden md:block">
        <WideNavBar user={user} />
      </div>
    </>
  );
};

const WideNavBar = async ({ user }: Props) => {
  const cart = await database.cart.findFirst({
    where: { userId: user?.id },
    include: {
      _count: {
        select: {
          cartItem: true,
        },
      },
    },
  });
  const isThereItems = (cart?._count.cartItem || 0) > 0;

  return (
    <div className="flex justify-between items-center">
      <Link href={"/"}>
        <IgraphLogo size={142} />
      </Link>
      <ul className="flex gap-12 text-gray-700">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Link href={"/cart"} className="relative">
          <Button variant={"outline"} size={"icon"}>
            <ShoppingCart />
          </Button>
          {isThereItems && (
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

const SmallNavBar = async ({ user }: Props) => {
  return (
    <div className="space-y-">
      <div className="flex justify-between">
        <Link href={"/"}>
          <IgraphLogoSquare />
        </Link>

        <div className="flex gap-2 text-gray-500">
          <Link href={"/cart"}>
            <Button variant={"outline"} size={"icon"}>
              <ShoppingCart className="scale-125" />
            </Button>
          </Link>

          {/* {user ? (
            <UserBar user={user} />
          ) : (
            <DropDownMenuBar menuItems={dropDownMenuItems} user={user} />
          )} */}
          <DropDownMenuBar menuItems={dropDownMenuItems} user={user} />
        </div>
      </div>
    </div>
  );
};

const dropDownMenuItems: { label: string; href: string; icon: JSX.Element }[] =
  [
    { label: "حساب کاربری", href: "/panel", icon: <UserIcon /> },
    { label: "دوره‌ها", href: "/courses", icon: <TvMinimalPlay /> },
    { label: "وبلاگ", href: "/blog", icon: <BookOpen /> },
    { label: "مدرسین", href: "/tutors", icon: <Users /> },
    { label: "استعلام مدرک", href: "/verify-cert", icon: <CircleCheckBig /> },
    { label: "تماس با ما", href: "/contact", icon: <Phone /> },
  ];

const menuItems: { label: string; href: string }[] = [
  { label: "دوره‌ها", href: "/courses" },
  { label: "وبلاگ", href: "/blog" },
  { label: "مدرسین", href: "/tutors" },
  { label: "استعلام مدرک", href: "/verify-cert" },
];

export default NavBar;
