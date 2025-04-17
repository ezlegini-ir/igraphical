"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@igraph/ui/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@igraph/ui/components/ui/sidebar";
import { sideBarMenuItems } from "@igraph/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBarMenu = () => {
  const pathName = usePathname();

  return (
    <>
      {sideBarMenuItems.map((group, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.subMenuItems.map((tab, index) => (
                <Collapsible
                  defaultOpen={pathName.includes(tab.tabName.toLowerCase())}
                  key={index}
                  className="group/collapsible text-gray-500"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`text-base py-5 ${
                          pathName.includes(tab.tabHref) && "bg-slate-100"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="flex items-center gap-2.5">
                            <Link
                              href={tab.tabHref}
                              className={`flex items-center gap-3`}
                            >
                              <tab.tabIcon
                                className="text-primary"
                                size={17}
                                strokeWidth={2.5}
                              />
                              {tab.tabName}
                            </Link>
                          </span>
                          <span>
                            {tab.subMenuItems.length > 0 && (
                              <ChevronRight size={14} />
                            )}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {tab.subMenuItems.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub className="text-sm font-medium py-2">
                          {tab.subMenuItems.map((item, index) => (
                            <Link
                              href={`${item.href}`}
                              key={index}
                              className={`${
                                pathName === item.href &&
                                "bg-slate-100 text-primary font-medium"
                              }  px-3 py-1.5 hover:bg-slate-100 rounded-sm`}
                            >
                              <SidebarMenuSubItem>
                                {item.label}
                              </SidebarMenuSubItem>
                            </Link>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SideBarMenu;
