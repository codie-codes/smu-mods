"use client";

import { useTheme } from "next-themes";

import { Toaster } from "@/components/ui/sonner";

export const ToastProvider = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      richColors
      theme={theme as "light" | "dark" | "system" | undefined}
      closeButton
      position="top-right"
    />
  );
};
