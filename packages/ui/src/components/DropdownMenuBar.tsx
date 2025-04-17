"use client";

import { ChevronDown, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";
import { Button } from "@igraph/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@igraph/ui/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Image, User } from "@igraph/database";
import Avatar from "./Avatar";

interface Props {
  user?: (User & { image: Image | null }) | null;
  menuItems: {
    label: string;
    href: string;
    icon: JSX.Element;
  }[];
}

const DropDownMenuBar = ({ user, menuItems }: Props) => {
  return (
    <DropdownMenu dir="rtl" modal={false}>
      <DropdownMenuTrigger asChild>
        {!user ? (
          <Button variant={"outline"} size={"icon"}>
            <Menu className="scale-125" />
          </Button>
        ) : (
          <Button variant={"outline"}>
            <Avatar src={user.image?.url} size={25} />
            {user.fullName}
            <ChevronDown />
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 mx-3 md:mr-0">
        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <DropdownMenuItem className="py-3 gap-3 cursor-pointer">
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            </Link>
          ))}

          {user && (
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-destructive/60 cursor-pointer py-3 gap-3"
            >
              <LogOut />
              <span>خروج از حساب</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuBar;
