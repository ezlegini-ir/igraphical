import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@igraph/ui/components/ui/sidebar";
import { ChartNoAxesCombined } from "lucide-react";
import Link from "next/link";
import SideBarMenu from "./SideBarMenu";

const DashboardSidebarContent = () => {
  return (
    <SidebarContent className={`${scrollBarStyleOverwrite} pb-10 gap-0`}>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {headerMenuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton size={"lg"} asChild className="px-3">
                  <Link href={item.href}>
                    <item.icon className="scale-125 mr-2" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SideBarMenu />
    </SidebarContent>
  );
};

const headerMenuItems = [
  { label: "Dashboard", href: "/", icon: ChartNoAxesCombined },
];

export default DashboardSidebarContent;

const scrollBarStyleOverwrite = `[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-slate-200 overflow-y-auto
 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300
`;
