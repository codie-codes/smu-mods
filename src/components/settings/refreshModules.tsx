"use client";

import { RefreshCw } from "lucide-react";

import { useModuleBankStore } from "@/stores/moduleBank/provider";

import { Button } from "../ui/button";

export function RefreshModulesSetting() {
  const { refreshAll } = useModuleBankStore((state) => state);

  return (
    <Button onClick={async () => await refreshAll()}>
      <RefreshCw className="mr-2" />
      Update
    </Button>
  );
}
