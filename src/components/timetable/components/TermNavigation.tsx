import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TermNavigationProps {
  currentTermNum: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function TermNavigation({
  currentTermNum,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: TermNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-24">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <h1 className="my-5 font-semibold">Term {currentTermNum}</h1>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={!canGoNext}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
