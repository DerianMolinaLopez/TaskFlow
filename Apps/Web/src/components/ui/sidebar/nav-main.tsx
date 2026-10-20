"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
};

function NavMenu({ items, pathname }: { items: NavItem[]; pathname: string | null }) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          pathname !== null &&
          (item.url === "/" ? pathname === "/" : pathname.startsWith(item.url));
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              render={<Link href={item.url} />}
            >
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function ActiveNavMenu({ items }: { items: NavItem[] }) {
  return <NavMenu items={items} pathname={usePathname()} />;
}

// usePathname() solo existe en tiempo de ejecución; el Suspense permite
// prerenderizar el menú sin el estado activo (requisito de cacheComponents).
export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <Suspense fallback={<NavMenu items={items} pathname={null} />}>
        <ActiveNavMenu items={items} />
      </Suspense>
    </SidebarGroup>
  );
}
