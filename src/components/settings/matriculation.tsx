import { getMatriculationYears } from "@/app/modules/settings/matriculationYear/matriculationYear";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { AcademicYear } from "@/config";
import { useConfigStore } from "@/stores/config/provider";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";

export function MatriculationYearSettings() {
    const matriculationYears: AcademicYear[] = getMatriculationYears();
    const { matriculationYear, changeMatriculationYear } = useConfigStore((state) => state);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button onClick={() => changeMatriculationYear}>
                    <Calendar className="mr-2"/>
                    {matriculationYear ?? "Select Year"}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {matriculationYears.map((academicYear) => {
                    return(
                        <DropdownMenuItem 
                            key={academicYear}
                            onClick={() => changeMatriculationYear(academicYear)}
                            className="justify-center"
                        >
                            AY{academicYear}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}