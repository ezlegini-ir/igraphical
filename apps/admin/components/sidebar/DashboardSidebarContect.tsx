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
    <SidebarContent className={`pb-10 gap-0`}>
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
  // { label: "Contacts", href: "/dashboard/contacts", icon: Phone },
];

export default DashboardSidebarContent;
