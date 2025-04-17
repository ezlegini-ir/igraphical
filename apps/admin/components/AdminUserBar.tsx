import { signOut } from "@igraph/auth";
import { Admin, Image } from "@igraph/database";
import Avatar from "@igraph/ui/components/Avatar";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@igraph/ui/components/ui/popover";
import {
  FilePlus2,
  GalleryHorizontal,
  LogOut,
  MessageCircle,
  Percent,
  Plus,
  User as UserIcon,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Props {
  user: Admin & { image: Image | null };
}

const UserBar = ({ user }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="cursor-pointer drop-shadow-lg">
          <Avatar src={user?.image?.url} size={40} />
        </div>
      </PopoverTrigger>

      <PopoverContent className="mr-3" dir="ltr">
        <div className="space-y-6">
          <div className="bg-slate-100 p-3 px-2 rounded-sm border-dashed border-slate-400/60 border-[1px] flex gap-2 items-center">
            <Avatar src={user?.image?.url} size={37} />
            <div className="flex flex-col">
              <span>{user?.name}</span>
              <span className="text-xs text-primary font-semibold">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            {menuItems.map((group, index) => (
              <div key={index}>
                <span className="text-gray-400 text-xs">
                  {group.groupLabel}
                </span>
                {group.items.map((items, index) => (
                  <Link key={index} href={items.href}>
                    <Button className="w-full justify-start" variant={"ghost"}>
                      <items.icon />
                      <span>{items.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant={"lightRed"} className="w-full text-left">
              <LogOut />
              Sign Out
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const menuItems = [
  {
    groupLabel: "Add Content",
    items: [
      { label: "New Post", href: "/posts/new", icon: FilePlus2 },
      { label: "New Course", href: "/courses/new", icon: Plus },
    ],
  },
  {
    groupLabel: "Quick Access",
    items: [
      { label: "Students", href: "/students", icon: Users },
      {
        label: "Announcements",
        href: "announcements",
        icon: GalleryHorizontal,
      },
      { label: "Tickets", href: "/tickets", icon: MessageCircle },
      { label: "Coupons", href: "/marketing/coupons", icon: Percent },
    ],
  },
  {
    groupLabel: "Profile",
    items: [{ label: "My Profile", href: "#", icon: UserIcon }],
  },
];

export default UserBar;
