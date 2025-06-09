"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function CustomToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme as "light" | "dark" | "system"}
      richColors
      closeButton
      position="top-right"
    />
  );
}
