"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { useTutorial } from './TutorialProvider';
import { tutorialSteps } from './tutorialSteps';

export function OnboardingTutorial() {
  const {
    isOpen,
    currentStep,
    totalSteps,
    closeTutorial,
    nextStep,
    previousStep,
    completeTutorial,
  } = useTutorial();

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          closeTutorial();
          break;
        case 'ArrowLeft':
          if (!isFirstStep) previousStep();
          break;
        case 'ArrowRight':
          if (isLastStep) {
            completeTutorial();
          } else {
            nextStep();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirstStep, isLastStep, closeTutorial, previousStep, nextStep, completeTutorial]);

  // Prevent body scroll when tutorial is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentStepData) return null;

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextStep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="mx-4 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeTutorial}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Description */}
            <p className="text-muted-foreground mb-6 text-xl leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Media */}
            {currentStepData.media && (
              <div className="mb-6 flex justify-center">
                <div className="rounded-lg border bg-muted/30 p-6">
                  {currentStepData.media.type === 'gif' || currentStepData.media.type === 'image' ? (
                    <img
                      src={currentStepData.media.src}
                      alt={currentStepData.media.alt || currentStepData.title}
                      className="max-h-80 w-auto rounded-md"
                    />
                  ) : currentStepData.media.type === 'video' ? (
                    <video
                      src={currentStepData.media.src}
                      className="max-h-80 w-auto rounded-md"
                      autoPlay
                      loop
                      muted
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t p-6">
            {/* Step counter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep
                        ? 'bg-primary'
                        : index < currentStep
                        ? 'bg-primary/60'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={isFirstStep}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              <Button
                onClick={handleNext}
                className="flex items-center space-x-1"
              >
                <span>{isLastStep ? 'Complete' : 'Next'}</span>
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
