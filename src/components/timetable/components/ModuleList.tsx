import type { Module, ModuleCode } from "@/types/primitives/module";
import type { Timetable } from "@/types/primitives/timetable";
import type { TimetableThemeName } from "@/utils/timetable/colours";

import { ModuleCard } from "./ModuleCard";

interface ModuleListProps {
  modules: (Module & { colorIndex: number; visible: boolean })[];
  timetable: Timetable;
  timetableTheme: TimetableThemeName;
  termId: string;
  onRemoveModule: (moduleCode: ModuleCode, termId: string) => void;
  onToggleVisibility: (moduleCode: ModuleCode, termId: string) => void;
  onColorChange: (
    termId: string,
    moduleCode: ModuleCode,
    colorIndex: number,
  ) => void;
}

export function ModuleList({
  modules,
  timetable,
  timetableTheme,
  termId,
  onRemoveModule,
  onToggleVisibility,
  onColorChange,
}: ModuleListProps) {
  if (modules.length === 0) {
    return null;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((mod, index) => (
        <ModuleCard
          key={index}
          module={mod}
          timetable={timetable}
          timetableTheme={timetableTheme}
          termId={termId}
          onRemove={(moduleCode) => onRemoveModule(moduleCode, termId)}
          onToggleVisibility={(moduleCode) =>
            onToggleVisibility(moduleCode, termId)
          }
          onColorChange={(moduleCode, colorIndex) =>
            onColorChange(termId, moduleCode, colorIndex)
          }
        />
      ))}
    </div>
  );
}
