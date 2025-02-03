"use client"

import { cn } from "@/lib/utils";
import { useConfigStore } from "@/stores/config/provider";
import { TIMETABLE_THEMES, TimetableThemeName } from "@/utils/timetable/colours";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroupItem } from "./ui/toggle-group";

type websiteTheme = {
    description: string;
    value: string;
    icon?: React.ReactNode;
}
const websiteThemes : websiteTheme[] = [
    {
        description: "Off",
        value: "light",
        icon: <Sun className="mr-2"/>
    },
    {
        description: "On",
        value: "dark",
        icon: <Moon className="mr-2"/>
    },
    {
        description: "System",
        value: "system",
        icon: <Monitor className="mr-2"/>
    },
];

export function ToggleWebsiteTheme() {
    const { theme, setTheme } = useTheme();

    return(
        <ToggleGroup
            type="single"
            className="flex flex-wrap w-fit gap-1 items-center justify-center"
            value={theme}
            onValueChange={(theme) => setTheme(theme)}
        >
            {websiteThemes.map((theme) => {
                return (
                    <ToggleGroupItem 
                        key={theme.value}
                        value={theme.value}
                        variant={"primary"}
                        className="data-[state=on]:text-primary-foreground data-[state=on]:bg-primary"
                    >
                        {theme.icon}
                        {theme.description}
                    </ToggleGroupItem>
                )
            })}
        </ToggleGroup>
    )   
}

export function ToggleTimetableTheme() {
    const { timetableTheme, changeTimetableTheme } = useConfigStore((state) => state);

    return (
        <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(TIMETABLE_THEMES).map(([themeName, theme], index) => {
                return (
                    <div 
                        key={index}
                        className={cn(
                            "w-full rounded-lg border p-2 shadow-sm hover:border-foreground/30 md:w-fit",
                            themeName == timetableTheme
                            ? "border-primary"
                            : "border-foreground/10",
                        )}
                        onClick={() =>
                            changeTimetableTheme(themeName as TimetableThemeName)
                        }
                    >
                        <div className="flex flex-col">
                            <p className="text-center">
                            {themeName
                                .replace(/_/g, " ")
                                .replace(/^\w/, (c) => c.toUpperCase())}
                            </p>
                            <div className="flex justify-center">
                            {theme.map((color, index) => (
                                <div
                                key={index}
                                className="size-4"
                                style={{
                                    backgroundColor: color.backgroundColor,
                                }}
                                />
                            ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}