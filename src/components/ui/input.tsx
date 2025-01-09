import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva(
  "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring",
        error: "border-red-500 focus-visible:ring-red-500",
        timetable: "border-input focus-visible:ring-blue-500",
        beyondStudies:
          "border border-white text-white placeholder:text-white focus-visible:shadow-blue-500/50 focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        ModulesPage:
          "border border-foreground/20 text-foreground placeholder:text-foreground focus-visible:shadow-blue-500/50 focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
