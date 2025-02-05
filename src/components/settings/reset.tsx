"use client";

import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";

export function ResetApplicationSetting() {
  async function ResetApplication() {
    localStorage.clear();
    toast.success("Application has been reset");
    window.location.reload();
  }

  return (
    <Button onClick={ResetApplication} variant={"destructive"}>
      <X className="mr-2" />
      Reset Application
    </Button>
  );
}
