"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Search, X, CheckCircle } from "lucide-react";

import type { Module, ModuleCode } from "@/types/primitives/module";
import { useModuleBankStore } from "@/stores/moduleBank/provider";
import { searchModule } from "@/utils/moduleBank";

import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

interface SearchModuleProps {
  handleModSelect: (mod: Module) => void;
  showResults?: boolean;
  callback?: (modules: Module[]) => void;
  takenModule?: ModuleCode[];
  placeholder?: string;
  maxResults?: number;
}

export function SearchModule({
  handleModSelect,
  callback,
  showResults = true,
  takenModule = [],
  placeholder = "Search by module name or code...",
  maxResults = 8,
}: SearchModuleProps) {
  const { modules } = useModuleBankStore((state) => state);
  const [inputValue, setInputValue] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const [searchResults, setSearchResults] = useState<Module[]>([]);

  const filteredResults = searchResults.slice(0, maxResults);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const results = searchModule(modules, inputValue);
    setSearchResults(results);
    setSelectedIndex(-1);

    if (callback) {
      callback(results);
    }
  }, [inputValue, modules, callback]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!focused || !showResults) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
            handleSelectModule(filteredResults[selectedIndex]);
          } else if (filteredResults[0]) {
            handleSelectModule(filteredResults[0]);
          }
          break;
        case "Escape":
          setInputValue("");
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [focused, showResults, selectedIndex, filteredResults]
  );

  const handleSelectModule = useCallback(
    (module: Module) => {
      handleModSelect(module);
      setInputValue("");
      setSelectedIndex(-1);
      setFocused(false);
    },
    [handleModSelect]
  );

  const clearSearch = () => {
    setInputValue("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const showDropdown = focused && inputValue.trim() !== "" && showResults;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label
          htmlFor="searchModule"
          className="text-sm font-medium text-foreground"
        >
          Search for a module
        </Label>

        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={inputRef}
              id="searchModule"
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                // Delay blur to allow click events on results
                setTimeout(() => setFocused(false), 150);
              }}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-20 py-3 text-base border-2 focus:border-primary transition-colors"
              autoComplete="off"
              spellCheck={false}
            />
            {inputValue ? (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">
                  {typeof navigator !== "undefined" &&
                  navigator?.platform?.toLowerCase().includes("mac")
                    ? "⌘"
                    : "Ctrl"}
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">
                  K
                </kbd>
              </div>
            )}
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
              {filteredResults.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No modules found</p>
                  <p className="text-xs mt-1">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-2 border-b border-border bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      {searchResults.length} module
                      {searchResults.length !== 1 ? "s" : ""} found
                      {searchResults.length > maxResults &&
                        ` (showing top ${maxResults})`}
                    </p>
                  </div>
                  <ul
                    ref={resultsRef}
                    className="max-h-80 overflow-auto"
                    role="listbox"
                    aria-label="Search results"
                  >
                    {filteredResults.map((mod, index) => {
                      const isSelected = index === selectedIndex;
                      const isTaken = takenModule.includes(mod.moduleCode);

                      return (
                        <li
                          key={mod.moduleCode}
                          role="option"
                          aria-selected={isSelected}
                          className={cn(
                            "relative px-4 py-3 cursor-pointer transition-colors border-l-4 border-transparent",
                            isSelected && "bg-accent border-l-primary",
                            !isSelected && "hover:bg-accent/50"
                          )}
                          onClick={() => handleSelectModule(mod)}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="text-sm font-mono font-semibold text-primary">
                                  {mod.moduleCode}
                                </code>
                                {isTaken && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                              <p className="text-sm text-foreground font-medium line-clamp-1">
                                {mod.name}
                              </p>
                              {mod.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {mod.description}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {isTaken && (
                                <Badge variant="secondary" className="text-xs">
                                  Added
                                </Badge>
                              )}
                              {mod.credit && (
                                <span className="text-xs text-muted-foreground">
                                  {mod.credit} MCs
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {inputValue && !showDropdown && (
          <p className="text-xs text-muted-foreground">
            Press Enter to search, or focus the input to see results
          </p>
        )}
      </div>
    </div>
  );
}
