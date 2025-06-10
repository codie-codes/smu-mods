import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { CircleAlert, X } from "lucide-react";

import type { PlannerModule, Term, Year } from "@/types/planner";
import type { ModuleCode } from "@/types/primitives/module";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import ModuleDetails from "../ModuleDetails";
import { InteractiveTooltip } from "./customTooltip";

interface ModuleCardProps {
  moduleCode: string;
  year: Year;
  term: Term;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  conflictList?: string[];
  removeModule: (moduleCode: ModuleCode, year: Year, term: Term) => void;
  plannerModule: PlannerModule["module"];
}

const ModuleCard = ({
  moduleCode,
  year,
  term,
  provided,
  snapshot,
  conflictList = [],
  removeModule,
  plannerModule,
}: ModuleCardProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        "mb-2 flex items-center justify-between gap-2 rounded-lg border px-2",
        "hover-effect",
        "hover:shadow-[0_4px_15px_0_rgba(8,47,73,0.3)]",
        "dark:hover:shadow-[0_4px_15px_0_rgba(255,255,255,0.3)]",

        snapshot.isDragging
          ? "bg-accent h-fit w-fit shadow-lg"
          : "bg-background hover:border-foreground border",
      )}
    >
      {conflictList.length > 0 && (
        <InteractiveTooltip
          content={
            <div>
              {conflictList.map((conflictMsg, idx) => (
                <li key={idx}>{conflictMsg}</li>
              ))}
              <p>Click on Module for more information</p>
            </div>
          }
        >
          <CircleAlert color="orange" size={18} />
        </InteractiveTooltip>
      )}

      <ModuleDetails
        moduleCode={moduleCode as ModuleCode}
        plannerModule={plannerModule}
      >
        <div className="flex-grow text-sm">
          {/* <div className="w-fit text-nowrap pe-1"></div>
          <div></div> */}
          {moduleCode}: {plannerModule.name}
        </div>
      </ModuleDetails>

      <Button
        onClick={() => removeModule(moduleCode as ModuleCode, year, term)}
        variant={"ghost"}
        size="icon"
        className="cross-btn-planner"
      >
        <X className="size-5" />
      </Button>
    </div>
  );
};

export default ModuleCard;
