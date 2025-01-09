import type { ReactNode } from "react";

import type { ModuleCode } from "@/types/primitives/module";

import { BidAnalytics } from ".";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

interface BidAnalyticsPopoverProps {
  children: ReactNode;
  moduleCode: ModuleCode;
  instructor?: string;
}

export default function BidAnalyticsPopover({
  children,
  moduleCode,
  instructor,
}: BidAnalyticsPopoverProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dialog-content min-w-[300px] p-10 md:min-w-[80vw]">
        <BidAnalytics
          params={{
            moduleCode,
            instructor,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
