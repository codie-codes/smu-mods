"use client";

import { RefreshCw } from "lucide-react";

import { useModuleBankStore } from "@/stores/moduleBank/provider";
import { useTimetableStore } from "@/stores/timetable/provider";

import { Button } from "../ui/button";

export function RefreshModulesSetting() {
  const { refreshAll } = useModuleBankStore((state) => state);
  const { refreshFromModuleBank } = useTimetableStore((state) => state);

  return (
    <Button
      onClick={async () => {
        const moduleBank = await refreshAll();
        refreshFromModuleBank(moduleBank);
      }}
    >
      <RefreshCw className="mr-2" />
      Update
    </Button>
  );
}
