"use client";

import { HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTutorial } from "@/hooks/use-tutorial";

import { tutorialSteps } from "./tutorialSteps";

interface TutorialTriggerButtonProps {
  stepId?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  className?: string;
}

export function TutorialTriggerButton({
  stepId,
  variant = "outline",
  size = "sm",
  children,
  className,
}: TutorialTriggerButtonProps) {
  const { openTutorial, goToStep } = useTutorial();

  const handleClick = () => {
    if (stepId) {
      // Find the step index by ID and navigate to it
      const stepIndex = tutorialSteps.findIndex(
        (step: any) => step.id === stepId,
      );
      if (stepIndex !== -1) {
        goToStep(stepIndex);
      }
    }
    openTutorial();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      {children || (
        <>
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </>
      )}
    </Button>
  );
}
