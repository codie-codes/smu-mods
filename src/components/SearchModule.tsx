"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle, Search, X } from "lucide-react";

import type { Module, ModuleCode } from "@/types/primitives/module";
import { cn } from "@/lib/utils";
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
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Clean up any pending blur timeout on unmount
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const results = searchModule(modules, inputValue);
    setSearchResults(results);
    setSelectedIndex(-1);

    if (callback) {
      callback(results);
    }
  }, [inputValue, modules, callback]);

  const handleSelectModule = useCallback(
    (module: Module) => {
      // Clear any pending blur timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }

      handleModSelect(module);
      setInputValue("");
      setSelectedIndex(-1);
      setFocused(false);
      inputRef.current?.blur();
    },
    [handleModSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!focused || !showResults) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : prev,
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
    [focused, showResults, selectedIndex, filteredResults, handleSelectModule],
  );

  const clearSearch = () => {
    setInputValue("");
    setSelectedIndex(-1);
    // Keep focus
    if (inputRef.current) {
      inputRef.current.focus();
      setFocused(true);
    }
  };

  const showDropdown = focused && inputValue.trim() !== "" && showResults;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="space-y-2">
        <Label
          htmlFor="searchModule"
          className="text-foreground text-sm font-medium"
        >
          Search for a module
        </Label>

        <div className="relative">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              ref={inputRef}
              id="searchModule"
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => {
                // Clear any pending blur timeout
                if (blurTimeoutRef.current) {
                  clearTimeout(blurTimeoutRef.current);
                  blurTimeoutRef.current = null;
                }
                setFocused(true);
              }}
              onBlur={() => {
                // Delay blur to allow click events on results
                blurTimeoutRef.current = setTimeout(() => {
                  setFocused(false);
                  blurTimeoutRef.current = null;
                }, 150);
              }}
              onKeyDown={handleKeyDown}
              className="focus:border-primary border-2 py-3 pr-20 pl-10 text-base transition-colors"
              autoComplete="off"
              spellCheck={false}
            />
            {inputValue ? (
              <button
                onClick={clearSearch}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors"
                type="button"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 text-xs">
                <kbd className="bg-muted border-border rounded border px-1.5 py-0.5 font-mono text-[10px]">
                  {typeof navigator !== "undefined" &&
                  navigator?.platform?.toLowerCase().includes("mac")
                    ? "⌘"
                    : "Ctrl"}
                </kbd>
                <span>+</span>
                <kbd className="bg-muted border-border rounded border px-1.5 py-0.5 font-mono text-[10px]">
                  K
                </kbd>
              </div>
            )}
          </div>

          {showDropdown && (
            <div className="bg-popover border-border absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border shadow-lg">
              {filteredResults.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center">
                  <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">No modules found</p>
                  <p className="mt-1 text-xs">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-border bg-muted/50 border-b p-2">
                    <p className="text-muted-foreground text-xs">
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
                            "relative cursor-pointer border-l-4 border-transparent px-4 py-3 transition-colors",
                            isSelected && "bg-accent border-l-primary",
                            !isSelected && "hover:bg-accent/50",
                          )}
                          onClick={() => handleSelectModule(mod)}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <code className="text-primary font-mono text-sm font-semibold">
                                  {mod.moduleCode}
                                </code>
                                {isTaken && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                              <p className="text-foreground line-clamp-1 text-sm font-medium">
                                {mod.name}
                              </p>
                              {mod.description && (
                                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
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
                                <span className="text-muted-foreground text-xs">
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
          <p className="text-muted-foreground text-xs">
            Press Enter to search, or focus the input to see results
          </p>
        )}
      </div>
    </div>
  );
}
