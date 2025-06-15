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
    <div className="flex items-center justify-center">
      <div className="flex max-w-xs items-center justify-between gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <h1 className="font-semibold">Term {currentTermNum}</h1>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!canGoNext}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
