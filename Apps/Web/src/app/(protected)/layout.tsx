import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar/sidebar";
import { NavUser } from "@/components/ui/sidebar/nav-user";
import { getCurrentUser } from "@/lib/session";

// Lee la sesión dentro de un Suspense para no bloquear el resto del layout
// (requisito de cacheComponents).
async function CurrentUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <NavUser user={user} />;
}

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <AppSidebar
        user={
          <Suspense fallback={<Skeleton className="h-12 w-full rounded-lg" />}>
            <CurrentUser />
          </Suspense>
        }
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b md:border-b-0">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <span className="text-sm text-muted-foreground">TaskFlow</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-2 md:p-6 md:pt-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
