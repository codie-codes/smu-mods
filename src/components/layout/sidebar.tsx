"use client";

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
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config";

import type { Links, MainLink } from "./nav-main";
import { Button } from "../ui/button";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

export type SidebarProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
};

export type SidebarData = {
  navMain: Links[];
  navSecondary: MainLink[];
};

// timetable
// planner
// courses
// stress relief

const ROOM_TITLE = "Room";
const data: SidebarData = {
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
  navSecondary: [
    {
      title: "Support",
      url: "mailto:knyanlin@johnnyknl.me",
      icon: LifeBuoy,
      isCollapsible: false,
    },
  ],
};

export function AppSidebar() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>SMUMODS</SidebarLabel>
          <NavMain items={data.navMain} />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <Button
            onClick={() =>
              setTheme(resolvedTheme === "light" ? "dark" : "light")
            }
            variant={"ghost"}
            className="h-8 w-full justify-between gap-2 p-1 pl-2"
          >
            <Sun className="block size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
            <div className="flex-grow text-left">Change Theme</div>
          </Button>
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  );
}
