"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { TutorialState } from "@/types/tutorial";

import { tutorialSteps } from "./tutorialSteps";

interface TutorialContextValue extends TutorialState {
  openTutorial: () => void;
  closeTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextValue | undefined>(
  undefined,
);

const TUTORIAL_STORAGE_KEY = "smu-mods-tutorial-completed";

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TutorialState>({
    isOpen: false,
    currentStep: 0,
    totalSteps: tutorialSteps.length,
    hasCompleted: false,
  });

  // Load tutorial completion status from localStorage
  useEffect(() => {
    const hasCompleted = localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
    setState((prev) => ({ ...prev, hasCompleted }));
  }, []);

  const openTutorial = () => {
    setState((prev) => ({ ...prev, isOpen: true, currentStep: 0 }));
  };

  const closeTutorial = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const nextStep = () => {
    setState((prev) => {
      if (prev.currentStep < prev.totalSteps - 1) {
        return { ...prev, currentStep: prev.currentStep + 1 };
      }
      return prev;
    });
  };

  const previousStep = () => {
    setState((prev) => {
      if (prev.currentStep > 0) {
        return { ...prev, currentStep: prev.currentStep - 1 };
      }
      return prev;
    });
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < state.totalSteps) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  };

  const completeTutorial = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    setState((prev) => ({
      ...prev,
      hasCompleted: true,
      isOpen: false,
    }));
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setState((prev) => ({
      ...prev,
      hasCompleted: false,
      currentStep: 0,
      isOpen: false,
    }));
  };

  const value: TutorialContextValue = {
    ...state,
    openTutorial,
    closeTutorial,
    nextStep,
    previousStep,
    goToStep,
    completeTutorial,
    resetTutorial,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
