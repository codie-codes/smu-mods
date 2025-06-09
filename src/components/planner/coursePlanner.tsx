"use client";

import type { DropResult } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { CalendarArrowUp, ChevronDown, ChevronUp, Edit } from "lucide-react";

import type { Term, Year } from "@/types/planner";
import type { Module, ModuleCode } from "@/types/primitives/module";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_CONFIG, PADDING } from "@/config";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/stores/config/provider";
import { useModuleBankStore } from "@/stores/moduleBank/provider";
import { useMultiplePlannerStore } from "@/stores/multiplePlanners/provider";
import { useTimetableStore } from "@/stores/timetable/provider";
import {
  EXEMPTION_YEAR,
  MODSTOTAKE_TERM,
  MODSTOTAKE_YEAR,
} from "@/types/planner";
import { type StatusNode } from "@/utils/checkPrerequisites";
import { getUserYear } from "@/utils/getUserYear";
import { Logger } from "@/utils/Logger";

import { SearchModule } from "../SearchModule";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ModuleCard from "./moduleCard";

import "./scrollBar.css";

const DELIMITER = "/$/";

const CoursePlanner = ({ plannerId }: { plannerId: string }) => {
  const isMobile = useIsMobile();
  const {
    addModule: addModuleToPlanner,
    changeTerm,
    planners,
    removeModule,
    hideSpecial,
    changePlannerName,
  } = useMultiplePlannerStore((state) => state);
  const { modules, addModule: addModuleToBank } = useModuleBankStore(
    (state) => state,
  );

  const { AddModuleToTimetable: addModuleTimetable } = useTimetableStore(
    (state) => state,
  );
  const { timetableTheme, matriculationYear } = useConfigStore(
    (state) => state,
  );

  const planner = planners[plannerId];
  const [newPlannerName, setNewPlannerName] = useState(planner?.name ?? "");

  useEffect(() => {
    if (!!planner) {
      setNewPlannerName(planner.name);
    }
  }, [planner]);

  const studentYear = getUserYear(matriculationYear, APP_CONFIG.academicYear);
  const [isOpen, setIsOpen] = React.useState<Set<string>>(new Set());

  if (!planner) {
    return <div>Planner not found</div>;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const dest = result.destination.droppableId.split(DELIMITER);
    const src = result.source.droppableId.split(DELIMITER);

    if (src[0] == dest[0] && src[1] == dest[1]) {
      return;
    }
    changeTerm(
      src[0] as Year,
      src[1] as Term,
      dest[0] as Year,
      dest[1] as Term,
      result.draggableId as ModuleCode,
      modules,
      plannerId,
    );
  };

  const HandleSyncTimetable = (year: Year) => {
    for (const termNo in planner.planner[year]) {
      Logger.log(planner);
      const moduleCodes = Object.keys(
        planner.planner[year][termNo as Term],
      ) as ModuleCode[];
      moduleCodes.forEach((moduleCode) => {
        const temp = modules[moduleCode];
        if (!!temp) {
          addModuleTimetable(temp, termNo as Term, timetableTheme);
        }
      });
    }
  };

  const HandleAddMod = (module: Module) => {
    addModuleToBank(module);
    addModuleToPlanner(
      module.moduleCode,
      {
        year: MODSTOTAKE_YEAR as Year,
        term: MODSTOTAKE_TERM as Term,
        id: module.moduleCode,
      },
      { ...modules, [module.moduleCode]: module },
      plannerId,
    );
    toggleYear(MODSTOTAKE_YEAR, true);
  };

  const handleRemoveModuleFromPlanner = (
    moduleCode: ModuleCode,
    year: Year,
    term: Term,
  ) => {
    removeModule(moduleCode, year, term, modules, plannerId);
  };

  const toggleYear = (year: string, forceOpen = false) => {
    setIsOpen((prevExpandedYears) => {
      if (forceOpen) {
        return new Set([...prevExpandedYears, year]);
      }
      const newOpenYears = new Set(prevExpandedYears);
      if (newOpenYears.has(year)) {
        newOpenYears.delete(year);
      } else {
        newOpenYears.add(year);
      }
      return newOpenYears;
    });
  };

  const handleHideSpecial = (year: Year) => {
    hideSpecial(year, plannerId);
  };

  return (
    <div
      style={{
        paddingLeft: PADDING,
        paddingBottom: PADDING,
      }}
    >
      <div
        className="mb-3 flex max-w-full items-start justify-start gap-4"
        style={{ paddingRight: PADDING }}
      >
        <div className="w-fit">
          <h1 className="text-2xl font-bold break-words">{planner.name}</h1>
        </div>
        <div className="w-fit">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="size-8 rounded-full" size={"icon"}>
                <Edit className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Planner Name</DialogTitle>
                <DialogDescription className="sr-only">
                  Edit the name of your planner
                </DialogDescription>
              </DialogHeader>
              <Input
                value={newPlannerName}
                onChange={(e) => setNewPlannerName(e.target.value)}
                placeholder="Planner Name"
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"destructive"}>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() => changePlannerName(plannerId, newPlannerName)}
                  >
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div
        className="mb-6 flex flex-col"
        style={{
          paddingRight: PADDING,
        }}
      >
        <div className="flex">
          <div className="w-full">
            <SearchModule
              handleModSelect={HandleAddMod}
              takenModule={
                Object.keys(planner.plannerState.modules) as ModuleCode[]
              }
            />
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={cn(
            "mb-6",
            isMobile
              ? "sticky top-12 z-20 grid grid-cols-1 gap-6"
              : "flex flex-wrap px-1",
          )}
          style={{
            paddingRight: PADDING,
          }}
        >
          <div
            key={MODSTOTAKE_YEAR}
            className={cn(
              "bg-muted flex flex-col overflow-hidden rounded-lg shadow-md",
              !isMobile && "mr-6 mb-6 w-full flex-shrink-0",
            )}
          >
            <div
              className={cn(
                "bg-smu-blue flex h-14 items-center justify-between p-3",
                isMobile && "cursor-pointer",
              )}
              onClick={() => isMobile && toggleYear(MODSTOTAKE_YEAR)}
            >
              <h2 className="text-lg font-semibold">Plan to Take</h2>

              {isMobile &&
                (!isMobile || isOpen.has(MODSTOTAKE_YEAR) ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                ))}
            </div>

            <div>
              {(!isMobile || isOpen.has(MODSTOTAKE_YEAR)) &&
                Object.entries(planner.planner[MODSTOTAKE_YEAR as Year]).map(
                  ([term, termModules]) => (
                    <Droppable
                      droppableId={`${MODSTOTAKE_YEAR}${DELIMITER}${term}`}
                      key={`${MODSTOTAKE_YEAR}${DELIMITER}${term}`}
                      direction="horizontal"
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "grid min-h-12 grid-cols-1 gap-4 p-3 transition-colors duration-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
                            snapshot.isDraggingOver
                              ? "bg-blue-100/10"
                              : "bg-muted",
                            !isMobile && "flex-grow",
                          )}
                        >
                          {Object.entries(termModules).map(
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            ([moduleCode, { conflicts }], index) => (
                              <Draggable
                                key={moduleCode}
                                draggableId={moduleCode}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <ModuleCard
                                    moduleCode={moduleCode}
                                    moduleName={
                                      modules[moduleCode as ModuleCode]?.name ??
                                      ""
                                    }
                                    year={MODSTOTAKE_YEAR as Year}
                                    term={MODSTOTAKE_TERM as Term}
                                    provided={provided}
                                    snapshot={snapshot}
                                    removeModule={handleRemoveModuleFromPlanner}
                                  />
                                )}
                              </Draggable>
                            ),
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ),
                )}
            </div>
            <div className="text-muted-foreground my-3 ml-3 text-xs">
              Add modules. Hold and drag them to their respective terms.
            </div>
          </div>
        </div>
        <div
          className={cn(
            "mb-6",
            isMobile
              ? "grid grid-cols-1 gap-6"
              : "scrollbar-hide flex flex-nowrap overflow-x-auto scroll-smooth px-1",
          )}
          style={{
            paddingRight: !!isMobile ? PADDING : "0rem",
          }}
        >
          {Object.keys(planner.planner)
            .filter((year) => year !== MODSTOTAKE_YEAR)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((year) => {
              const terms = planner.planner[year as Year];
              const isHidden = planner.isSpecialHidden[year as Year];
              return (
                <div
                  key={year}
                  className={cn(
                    "bg-accent flex flex-col overflow-hidden rounded-lg shadow-md",
                    !isMobile && "mr-6 mb-6 w-96 flex-shrink-0",
                  )}
                >
                  <div
                    className={cn(
                      "bg-smu-gold flex h-14 items-center justify-between p-3",
                      isMobile && "cursor-pointer",
                    )}
                    onClick={() => isMobile && toggleYear(year)}
                  >
                    <h2 className="text-lg font-semibold">
                      {year === EXEMPTION_YEAR
                        ? "Exemptions"
                        : year === MODSTOTAKE_YEAR
                          ? "Plan to Take"
                          : `Year ${year}`}
                    </h2>

                    {year === studentYear
                      ? !isMobile && (
                          <Button
                            onClick={() => HandleSyncTimetable(year)}
                            size={"icon"}
                            variant={"secondary"}
                          >
                            <CalendarArrowUp className="size-4" />
                          </Button>
                        )
                      : ""}

                    {isMobile &&
                      (!isMobile || isOpen.has(year) ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      ))}
                  </div>
                  {(!isMobile || isOpen.has(year)) && (
                    <>
                      {year !== EXEMPTION_YEAR && (
                        <div className="flex-cols flex justify-center">
                          <Button
                            onClick={() => handleHideSpecial(year as Year)}
                            variant={"outline"}
                          >
                            {isHidden
                              ? "Show Special Terms"
                              : "Hide Special Terms"}
                          </Button>

                          {year === studentYear
                            ? isMobile && (
                                <Button
                                  onClick={() => HandleSyncTimetable(year)}
                                  size={"icon"}
                                  className="me-2 mt-2"
                                  variant={"outline"}
                                >
                                  <CalendarArrowUp className="size-4" />
                                </Button>
                              )
                            : ""}
                        </div>
                      )}
                      {Object.entries(terms).map(([term, termModules]) => (
                        <Droppable
                          droppableId={`${year}${DELIMITER}${term}`}
                          key={`${year}${DELIMITER}${term}`}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={cn(
                                "p-3 transition-colors duration-200",
                                snapshot.isDraggingOver
                                  ? "bg-blue-100/10"
                                  : "bg-muted",
                                term === "Term 3A" && isHidden ? "hidden" : "",
                                term === "Term 3B" && isHidden ? "hidden" : "",
                                year === EXEMPTION_YEAR && !isMobile
                                  ? "flex-grow"
                                  : year === MODSTOTAKE_YEAR && !isMobile
                                    ? "flex-grow"
                                    : "min-h-[120px]",
                              )}
                            >
                              <h3 className="text-foreground mb-3 font-medium">
                                {year === EXEMPTION_YEAR
                                  ? ""
                                  : year === MODSTOTAKE_YEAR
                                    ? ""
                                    : `${term}`}
                              </h3>

                              {Object.entries(termModules).map(
                                ([moduleCode, { conflicts }], index) => {
                                  const conflictList: string[] = [];

                                  // For each module, check the conflicts present
                                  if (conflicts && year !== EXEMPTION_YEAR) {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    Object.entries(conflicts).map(
                                      ([, conflict]) => {
                                        "checkpoint";
                                        if (
                                          conflict.type === "prereq" &&
                                          (conflict.statusNode?.children
                                            ?.length ?? 0) > 0
                                        ) {
                                          const reqGate =
                                            conflict.statusNode?.type ?? "";
                                          const sliceAmt = reqGate.length + 2;
                                          let msg =
                                            "These modules may need to be taken first: ";

                                          // Extracted Append Message to handle potential nested pre-req
                                          function appendMsg(
                                            preReqMod: StatusNode,
                                            innerReqGate: string,
                                          ) {
                                            // if it's not nested pre-req :)
                                            if (
                                              !preReqMod.fulfilled &&
                                              (!preReqMod.children ||
                                                preReqMod.children.length === 0)
                                            ) {
                                              return `${preReqMod.module} ${innerReqGate} `;
                                            }

                                            // Else process nested pre-req recursively
                                            let innerMsg = `[`;
                                            for (const child of preReqMod.children ??
                                              []) {
                                              innerMsg += appendMsg(
                                                child,
                                                preReqMod.type,
                                              );
                                            }

                                            innerMsg = innerMsg.slice(
                                              0,
                                              -(preReqMod.type.length + 2),
                                            );
                                            innerMsg += `] ${innerReqGate} `;

                                            return innerMsg;
                                          }

                                          for (const preReqMod of conflict
                                            ?.statusNode?.children ?? []) {
                                            msg += appendMsg(
                                              preReqMod,
                                              reqGate,
                                            );
                                          }
                                          conflictList.push(
                                            msg.slice(0, -sliceAmt),
                                          );
                                        }

                                        if (conflict.type === "term") {
                                          let msg =
                                            "Terms offering this module: ";
                                          for (const termOffered of conflict.termsOffered) {
                                            msg += `${termOffered}, `;
                                          }
                                          conflictList.push(msg.slice(0, -2));
                                        }

                                        if (conflict.type === "exam") {
                                          if (
                                            conflict.conflictModules.length > 1
                                          ) {
                                            let msg =
                                              "This module has clashing exam timings with: ";
                                            for (const modExam of conflict.conflictModules) {
                                              if (moduleCode !== modExam) {
                                                msg += `${modExam}, `;
                                              }
                                            }
                                            conflictList.push(msg.slice(0, -2));
                                          }
                                        }
                                      },
                                    );
                                  }

                                  return (
                                    <Draggable
                                      key={moduleCode}
                                      draggableId={moduleCode}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <ModuleCard
                                          moduleCode={moduleCode}
                                          moduleName={
                                            modules[moduleCode as ModuleCode]
                                              ?.name ?? ""
                                          }
                                          year={year as Year}
                                          term={term as Term}
                                          provided={provided}
                                          snapshot={snapshot}
                                          conflictList={conflictList}
                                          removeModule={
                                            handleRemoveModuleFromPlanner
                                          }
                                        />
                                      )}
                                    </Draggable>
                                  );
                                },
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CoursePlanner;
