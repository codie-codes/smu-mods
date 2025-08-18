export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  media?: {
    type: "gif" | "video" | "image";
    src: string;
    alt?: string;
  };
  targetElement?: string; // CSS selector for highlighting specific elements
  position?: "center" | "top" | "bottom" | "left" | "right";
}

export interface TutorialState {
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  hasCompleted: boolean;
}
