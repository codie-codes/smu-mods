"use client";

import { Calendar } from "lucide-react";

import type { AcademicYear } from "@/config";
import { getMatriculationYears } from "@/utils/getMatriculationYear";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfigStore } from "@/stores/config/provider";

import { Button } from "../ui/button";

export function MatriculationYearSettings() {
  const matriculationYears: AcademicYear[] = getMatriculationYears();
  const { matriculationYear, changeMatriculationYear } = useConfigStore(
    (state) => state
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-cy="matriculation-setting-button">
          <Calendar className="mr-2" />
          {matriculationYear ?? "Select Year"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent data-cy="matriculation-setting-content">
        {matriculationYears.map((academicYear) => {
          return (
            <DropdownMenuItem
              key={academicYear}
              onClick={() => changeMatriculationYear(academicYear)}
              className="justify-center"
              data-cy="matriculation-setting-option"
            >
              AY{academicYear}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
