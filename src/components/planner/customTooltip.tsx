import type { ReactNode } from "react";
import React, { useState } from "react";
import { TooltipPortal } from "@radix-ui/react-tooltip";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InteractiveTooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  children,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip open={isOpen}>
      <TooltipTrigger asChild>
        <div
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          style={{ cursor: "pointer", display: "inline-block" }}
        >
          {children}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="max-w-sm border border-orange-300 bg-muted text-foreground shadow-md">
          {content}{" "}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
