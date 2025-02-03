import type { AcademicYear } from "@/config";

export function getMatriculationYears() : AcademicYear[] {
    const currentYear = new Date().getFullYear();
    const matriculationYears : AcademicYear[] = [];

    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
        const academicYear = `${i}/${i+1}`
        matriculationYears.push(academicYear as AcademicYear);
    }

    return matriculationYears;
}