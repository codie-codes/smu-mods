import { SidebarLayout } from "@/components/ui/sidebar";

import { AppVersionCheck } from "./AppVersionCheck";
import { Banners } from "./banners";
import { Disclaimer } from "./disclaimer";
import NavHeader from "./nav-header";
import { AppSidebar } from "./sidebar";

export interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const { cookies } = await import("next/headers");
  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <AppVersionCheck />
      <AppSidebar />
      <main className="flex h-[100dvh] max-h-[100dvh] max-w-full flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
        <Banners />
        <Disclaimer />
        <div className="h-full max-h-full overflow-y-scroll rounded-md border-2 border-dashed">
          <NavHeader />
          {children}
        </div>
      </main>
    </SidebarLayout>
  );
}
