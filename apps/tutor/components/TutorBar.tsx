import { signOut } from "@igraph/auth";
import Avatar from "@igraph/ui/components/Avatar";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@igraph/ui/components/ui/popover";
import { Image, Tutor } from "@igraph/database";
import {
  CircleArrowOutDownLeft,
  ChartNoAxesCombined,
  LogOut,
  MessageCircleQuestion,
} from "lucide-react";
import Link from "next/link";

interface TutorType extends Tutor {
  image: Image | null;
}

interface Props {
  tutor: TutorType | null;
}

const TutorBar = ({ tutor }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="cursor-pointer drop-shadow-lg">
          <Avatar src={tutor?.image?.url} size={40} />
        </div>
      </PopoverTrigger>

      <PopoverContent className="mr-3" dir="ltr">
        <div className="space-y-6">
          <div className="bg-slate-100 p-3 px-2 rounded-sm border-dashed border-slate-400/60 border-[1px] flex gap-2 items-center">
            <Avatar src={tutor?.image?.url} size={37} />
            <div className="flex flex-col">
              <span>{tutor?.name}</span>
              <span className="text-xs text-primary font-semibold">
                {tutor?.phone}
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
    groupLabel: "Fast Menu",
    items: [
      { label: "Dashboard", href: "/", icon: ChartNoAxesCombined },
      { label: "Q & A", href: "/qa", icon: MessageCircleQuestion },
      {
        label: "Settlements",
        href: "/settlements",
        icon: CircleArrowOutDownLeft,
      },
    ],
  },
];

export default TutorBar;
