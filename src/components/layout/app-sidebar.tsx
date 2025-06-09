"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BookA,
  Calendar,
  ChartArea,
  LifeBuoy,
  Moon,
  NotebookPen,
  Settings,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config";

const data = {
  navMain: [
    {
      title: "Timetable",
      url: `/timetable/${APP_CONFIG.currentTerm}`,
      icon: Calendar,
      isCollapsible: false,
    },
    {
      title: "Bid Price Analytics",
      url: "/bid-analytics",
      icon: ChartArea,
      isCollapsible: false,
    },
    {
      title: "Planner",
      url: "/planner",
      icon: NotebookPen,
      isCollapsible: false,
    },
    {
      title: "Modules",
      url: "/modules",
      icon: BookA,
      isCollapsible: false,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      isCollapsible: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      pathname.startsWith(item.url) && item.url !== "/"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    <a href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="mt-auto">
            <SidebarMenuButton
              onClick={() =>
                setTheme(resolvedTheme === "light" ? "dark" : "light")
              }
            >
              <Sun className="mr-2 block size-4 dark:hidden" />
              <Moon className="mr-2 hidden size-4 dark:block" />
              <div className="flex-grow text-left">Change Mode</div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="mailto:knyanlin@johnnyknl.com">
                <LifeBuoy className="mr-2 size-4" />
                Help
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
