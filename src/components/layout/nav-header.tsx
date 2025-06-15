import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config";
import { termMap } from "@/types/planner";

import { Logo } from "../Logo";

export function NavHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Logo />
      <div className="flex-grow text-right text-sm">
        <p>AY{APP_CONFIG.academicYear}</p>
        <p>{termMap[APP_CONFIG.currentTerm]}</p>
      </div>
    </header>
  );
}
