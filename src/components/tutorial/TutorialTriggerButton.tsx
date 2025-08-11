"use client";

import { Button } from '@/components/ui/button';
import { useTutorial } from '@/hooks/use-tutorial';
import { HelpCircle } from 'lucide-react';

interface TutorialTriggerButtonProps {
  stepId?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  className?: string;
}

export function TutorialTriggerButton({ 
  stepId, 
  variant = "outline", 
  size = "sm",
  children,
  className 
}: TutorialTriggerButtonProps) {
  const { openTutorial, goToStep } = useTutorial();
  
  const handleClick = () => {
    if (stepId) {
      // Find the step index by ID and navigate to it
      const { tutorialSteps } = require('./tutorialSteps');
      const stepIndex = tutorialSteps.findIndex((step: any) => step.id === stepId);
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
