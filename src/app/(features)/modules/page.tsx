"use client";

import { useState } from "react";
import { ChevronDown, Star, StarOff } from "lucide-react";

import type { Module } from "@/types/primitives/module";
// import ui components
import ModuleDetails from "@/components/ModuleDetails";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PADDING } from "@/config";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/stores/config/provider";
import { useModuleBankStore } from "@/stores/moduleBank/provider";

export default function CourseCatalogue() {
  // Extract categories from baskets
  const { modules, toggleFavourites, favouriteModules, baskets } =
    useModuleBankStore((state) => state);
  const { banners } = useConfigStore((state) => state);
  const activeBanners = banners.filter((banner) => !banner.dismissed);

  const [selectedCategories, _setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code">("name");
  const [filterByFavorites, setFilterByFavorites] = useState(false); // Toggle to filter by favorites

  // Function to get all modules in a selected category
  const getModulesByCategory = (category: string) => {
    const basket = baskets.find((basket) => basket.name === category);
    return basket ? basket.modules : [];
  };

  // Get all modules from the baskets based on selected categories and deduplicate
  const filteredModules = Object.values(modules)
    .filter((module) => {
      const moduleCategories = selectedCategories.length
        ? selectedCategories.flatMap(getModulesByCategory) // Get all module codes for selected categories
        : Object.keys(modules); // If no category is selected, show all modules

      // If filter by favorites is enabled, show only favorite modules
      if (filterByFavorites && !favouriteModules.includes(module.moduleCode)) {
        return false;
      }

      return (
        moduleCategories.includes(module.moduleCode) &&
        (module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.moduleCode.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .reduce((acc, current) => {
      const found = acc.find((item) => item.moduleCode === current.moduleCode);
      if (!found) {
        acc.push(current);
      }
      return acc;
    }, [] as Module[])
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return a.moduleCode.localeCompare(b.moduleCode);
      }
    });

  const isMobile = useIsMobile();

  return (
    <div
      className="relative w-full space-y-4"
      style={{
        paddingTop: PADDING,
        paddingLeft: PADDING,
        paddingRight: PADDING,
      }}
    >
      <h1 className="text-2xl font-bold">Module Catalogue</h1>
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Search Bar */}
        <div className="flex-1">
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            variant="ModulesPage"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        {/* Sort By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              Sort by {sortBy === "name" ? "Name" : "Module Code"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={sortBy === "name"}
              onCheckedChange={() => setSortBy("name")}
            >
              Name
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortBy === "code"}
              onCheckedChange={() => setSortBy("code")}
            >
              Module Code
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Toggle Filter by Favorites */}
      <div className="flex items-center">
        <Checkbox
          checked={filterByFavorites}
          onCheckedChange={(checked) => setFilterByFavorites(Boolean(checked))}
          className="hover:bg-primary/50"
          id="filterByFavorites"
        />
        <Label className="ml-2" htmlFor="filterByFavorites">
          Show Favorites Only
        </Label>
      </div>
      <div className="flex gap-4">
        {/* Filter by Categories */}
        {/* <div className="w-fit max-w-24 space-y-2 md:max-w-none">
          <h2 className="font-semibold">Basket</h2>
          <ScrollArea className="h-[calc(100dvh-20.5rem)] w-full md:h-[calc(100dvh-17.5rem)]">
            {baskets
              .map((basket) => basket.name)
              .map((category, index) => (
                <div key={index} className="mb-2 flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      _setSelectedCategories(
                        checked
                          ? [...selectedCategories, category]
                          : selectedCategories.filter((c) => c !== category),
                      );
                    }}
                    className="hover:bg-primary/50"
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
          </ScrollArea>
        </div> */}

        {/* Display Modules */}
        <div className="flex-grow">
          <h2 className="mb-2 font-semibold">
            Modules ({filteredModules.length})
          </h2>
          <ScrollArea
            className={cn(
              "h-[calc(100dvh-20.5rem)] w-full md:h-[calc(100dvh-17.5rem)]",
              activeBanners.length > 0 &&
                "h-[calc(100dvh-24rem)] md:h-[calc(100dvh-21rem)]",
            )}
          >
            {filteredModules.map((module) => (
              // Wrap the module card with ModuleDetails to open the dialog when clicked
              <ModuleDetails
                moduleCode={module.moduleCode}
                key={module.moduleCode}
              >
                {/* <div className="mb-4 flex transform cursor-pointer items-center justify-between rounded-lg border p-4 shadow-md shadow-transparent transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-primary"> */}
                <div className="hover:border-1 my-4 flex transform cursor-pointer items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:-translate-y-1 hover:border-sky-950 hover:shadow-[0_4px_15px_0_rgba(8,47,73,0.3)] dark:border-slate-500 dark:hover:border-white dark:hover:shadow-[0_4px_15px_0_rgba(255,255,255,0.6)]">
                  <div className="flex-grow">
                    <h3 className="font-semibold">{module.name}</h3>
                    <p className="text-sm text-foreground/70">
                      {module.moduleCode} | {module.credit} CU | Exam Date:{" "}
                      {module.exam
                        ? new Date(module.exam.dateTime).toLocaleDateString()
                        : "No Exam"}
                    </p>
                  </div>

                  {/* Favorite Icon */}
                  <div
                    className={cn(
                      "flex w-fit items-center",
                      isMobile ? "flex-col" : "flex-row",
                    )}
                  >
                    <button
                      className={cn(
                        "right-0 mx-4 align-middle text-yellow-500",
                        isMobile && "mb-4",
                      )}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering the dialog when clicking the star
                        toggleFavourites(module.moduleCode);
                      }}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 fill-current",
                          favouriteModules.includes(module.moduleCode)
                            ? "block"
                            : "hidden",
                        )}
                      />
                      <StarOff
                        className={cn(
                          "h-6 w-6",
                          favouriteModules.includes(module.moduleCode)
                            ? "hidden"
                            : "block",
                        )}
                      />
                    </button>
                  </div>
                </div>
              </ModuleDetails>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
