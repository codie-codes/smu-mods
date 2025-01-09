"use client";

import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfigStore } from "@/stores/config/provider";

export function Disclaimer() {
  const { warningDismissedTime, dismissWarning } = useConfigStore(
    (state) => state,
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <AlertDialog
      defaultOpen={Date.now() - warningDismissedTime > 1000 * 60 * 60 * 24 * 7}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disclaimer</AlertDialogTitle>
          <AlertDialogDescription>
            This application is a work in progress and may contain bugs, module
            list may not be updated and may not be accurate. Please refer to
            official SMU sources for the most accurate information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={dismissWarning}>
            Dismiss
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
