"use client";

import { useEffect, useState } from "react";

import type { Module, ModuleCode } from "@/types/primitives/module";
import { useModuleBankStore } from "@/stores/moduleBank/provider";
import { searchModule } from "@/utils/moduleBank";

import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SearchModuleProps {
  handleModSelect: (mod: Module) => void;
  showResults?: boolean;
  callback?: (modules: Module[]) => void;
  takenModule?: ModuleCode[];
}

export function SearchModule({
  handleModSelect,
  callback,
  showResults = true,
  takenModule = [],
}: SearchModuleProps) {
  const { modules } = useModuleBankStore((state) => state);
  const [inputValue, setInputValue] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);

  const [searchResults, setSearchResults] = useState<Module[]>([]);

  useEffect(() => {
    setSearchResults(searchModule(modules, inputValue));
    if (callback) {
      callback(searchModule(modules, inputValue));
    }
  }, [inputValue]);
  return (
    <div className="flex justify-center gap-24">
      <div className="relative w-full space-y-2">
        <div>
          <Label htmlFor="searchModule">Search for a module</Label>
          <Input
            variant="timetable"
            autoComplete="off"
            placeholder="Search by module name or code"
            value={inputValue}
            id="searchModule"
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              if (!hovering) {
                setFocused(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setInputValue("");
              } else if (e.key === "Enter") {
                if (searchResults[0]) {
                  handleModSelect(searchResults[0]);
                  setInputValue("");
                }
              }
            }}
          />
        </div>
        {!showResults ? (
          <></>
        ) : (
          inputValue != "" &&
          focused && (
            <ul
              className="md absolute left-0 right-0 z-30 max-h-40 overflow-auto rounded border bg-background text-sm shadow-lg"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {searchResults.length == 0 ? (
                <li className="p-2">No results found.</li>
              ) : (
                searchResults.map((mod, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 hover:bg-accent"
                    onClick={() => {
                      setInputValue("");
                      handleModSelect(mod);
                      setHovering(false);
                    }}
                  >
                    {mod.moduleCode} - {mod.name}
                    {takenModule.includes(mod.moduleCode) && (
                      <Badge variant={"secondary"} className="ms-2">
                        Added
                      </Badge>
                    )}
                  </li>
                ))
              )}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
