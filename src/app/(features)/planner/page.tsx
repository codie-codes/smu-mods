"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { PADDING } from "@/config";
import { type PlannerFull } from "@/stores/multiplePlanners";
import { useMultiplePlannerStore } from "@/stores/multiplePlanners/provider";
import { usePlannerStore } from "@/stores/planner/provider";

export default function Planner() {
  const [newPlannerName, setNewPlannerName] = useState("");

  const { planners, addPlanner } = useMultiplePlannerStore((state) => state);
  const { planner, plannerState, isSpecialHidden } = usePlannerStore(
    (state) => state,
  );

  useEffect(() => {
    if (!!planner && !!plannerState && !!isSpecialHidden) {
      addPlanner("Default", {
        planner,
        plannerState,
        isSpecialHidden,
      });
      localStorage.removeItem("planner");
    }
  }, [planner, plannerState, isSpecialHidden]);

  return (
    <div
      style={{
        padding: PADDING,
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-start gap-4">
        <h2 className="text-xl font-bold">Your Plans</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="mr-2 size-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Planner</DialogTitle>
              <DialogDescription>
                Add a new planner to your list
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
                <Button onClick={() => addPlanner(newPlannerName)}>Add</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {Object.keys(planners).length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(planners).map(([id, planner]) => (
            <PlannerCard key={id} planner={planner} id={id} />
          ))}
        </div>
      ) : (
        <p className="text-lg">No planners yet</p>
      )}
    </div>
  );
}

function PlannerCard({ planner, id }: { planner: PlannerFull; id: string }) {
  const { removePlanner } = useMultiplePlannerStore((state) => state);

  return (
    <div className="flex max-w-full rounded-md border-2 p-4 hover:border-primary/50">
      <div className="h-full w-5/6">
        <Link
          href={`/planner/${id}`}
          className="flex h-full flex-col justify-between"
        >
          <div>
            <h3 className="break-words text-lg font-semibold">
              {planner.name}
            </h3>
          </div>
          <div>
            <p className="text-wrap align-bottom text-sm">
              {Object.keys(planner.plannerState.modules).length} modules
            </p>
          </div>
        </Link>
      </div>
      <div className="mt-0 w-1/6 text-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"icon"} variant={"destructiveOutline"}>
              <Trash2></Trash2>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Planner</DialogTitle>
              <DialogDescription>
                {`Are you sure you want to delete planner ${planner.name}?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"destructive"}>Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => removePlanner(id)}>Delete</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
