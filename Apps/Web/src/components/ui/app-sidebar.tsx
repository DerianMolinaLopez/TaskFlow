"use client";

import * as React from "react";
import Link from "next/link";

import { NavMain } from "@/components/ui/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  CheckListIcon,
  FolderKanbanIcon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons";

const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />,
  },
  {
    title: "Tareas",
    url: "/tasks",
    icon: <HugeiconsIcon icon={CheckListIcon} strokeWidth={2} />,
  },
  {
    title: "Proyectos",
    url: "/projects",
    icon: <HugeiconsIcon icon={FolderKanbanIcon} strokeWidth={2} />,
  },
];

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: React.ReactNode }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <HugeiconsIcon icon={TaskDaily01Icon} strokeWidth={2} className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">TaskFlow</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>{user}</SidebarFooter>
    </Sidebar>
  );
}
