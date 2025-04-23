"use client";

import { loginPageRoute } from "@/middleware";
import { Image, User } from "@igraph/database";
import Avatar from "@igraph/ui/components/Avatar";
import IgraphLogo from "@igraph/ui/components/IgraphLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@igraph/ui/components/ui/sidebar";
import {
  CreditCard,
  Headset,
  LogOut,
  PanelRight,
  Pencil,
  TvMinimalPlay,
  User as UserIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

interface UserType extends User {
  image: Image | null;
}

interface Props {
  user: UserType | null | undefined;
}
export function SideBar({ user }: Props) {
  if (!user) return redirect(loginPageRoute);

  const pathName = usePathname();

  return (
    <Sidebar
      side="right"
      className="p-2 border-dashed border-gray-300 bg-background"
    >
      <SidebarHeader className="p-4 space-y-8">
        <Link href={"/"}>
          <IgraphLogo />
        </Link>

        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Avatar src={user.image?.url} />
            <div className="flex flex-col">
              <span className="font-medium text-gray-600">{user.fullName}</span>
              <span className="text-xs text-gray-400">{user.phone}</span>
            </div>
          </div>

          <Link href={"/panel/profile"} className="p-1">
            <Pencil size={14} className="text-gray-400" />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>منو کاربری</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenu.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton size={"lg"} asChild>
                    <Link
                      href={item.href}
                      className={` ${pathName === item.href ? "bg-slate-100 text-primary" : "hover:bg-slate-100/70"}`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="mb-5">
          {footerMenu.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="cursor-pointer" onClick={() => signOut()}>
                <LogOut />
                <span>خروج از حساب</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// CONTENT MENI ITEMS
const contentMenu = [
  {
    title: "داشبورد",
    href: "/panel",
    icon: PanelRight,
  },
  {
    title: "دوره‌ها",
    href: "/panel/courses",
    icon: TvMinimalPlay,
  },
  {
    title: "پشتیبانی",
    href: "/panel/tickets",
    icon: Headset,
  },
  {
    title: "پرداخت‌ها",
    href: "/panel/payments",
    icon: CreditCard,
  },
];

// FOOTER MENU ITEMS
const footerMenu = [
  {
    title: "پروفایل",
    href: "/panel/profile",
    icon: UserIcon,
  },
];
