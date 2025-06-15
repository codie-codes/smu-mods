import { NuqsAdapter } from "nuqs/adapters/next/app";

import { CustomToaster } from "@/components/custom-toaster";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppVersionCheck } from "@/components/layout/AppVersionCheck";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { NavHeader } from "@/components/layout/nav-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreProviders from "@/stores/StoreProviders";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProviders>
      <NuqsAdapter>
        <TooltipProvider>
          <SidebarProvider>
            <AppVersionCheck />
            <Disclaimer />
            <AppSidebar />
            <SidebarInset>
              <NavHeader />
              <div className="flex flex-1 flex-col gap-4 p-2">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </NuqsAdapter>
      <CustomToaster />
    </StoreProviders>
  );
}
