import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useConfigStore } from "@/stores/config/provider";

export default function NavigationPopup() {
  const navigationPopupDismissed = useConfigStore(
    (state) => state.navigationPopupDismissed,
  );
  const dismissNavigationPopup = useConfigStore(
    (state) => state.dimissNavigationPopup,
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    if (isMobileDevice && !navigationPopupDismissed) {
      setIsVisible(true);
    }
  }, [navigationPopupDismissed]);

  const handleClose = () => {
    dismissNavigationPopup(); // Persist the dismissal state
    setIsVisible(false); // Close the popup
  };

  if (!isVisible) return null;

  return (
    <AlertDialog
      open={isVisible}
      onOpenChange={(open) => !open && handleClose()}
    >
      <AlertDialogTrigger className="hidden" />{" "}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>How to Navigate</AlertDialogTitle>
          <AlertDialogDescription>
            Drag and hold your finger on the screen to navigate the page and
            release your finger on the component you want to interact with!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>Got it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
