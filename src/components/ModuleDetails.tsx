import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import type { Module, ModuleCode } from "@/types/primitives/module";
import { useModuleBankStore } from "@/stores/moduleBank/provider";
import { Logger } from "@/utils/Logger";

import { ModuleTreeComponent } from "./ModuleTree";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface ModuleDetailsProps {
  moduleCode: ModuleCode;
  children: ReactNode;
}

export default function ModuleDetails({
  moduleCode,
  children,
}: ModuleDetailsProps) {
  const { getModule } = useModuleBankStore((state) => state);
  const [module, setModule] = useState<Module>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getModule(moduleCode)
      .catch((e) => Logger.log(e))
      .then((mod) => {
        if (!mod) return;
        setModule(mod);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dialog-content min-w-[300px] p-10 md:min-w-[80vw]">
        {!loading ? (
          !!module ? (
            <div className="max-h-[80dvh] overflow-y-scroll">
              <DialogHeader>
                <DialogTitle>{module.moduleCode}</DialogTitle>
                <DialogDescription>
                  {module.name} ({module.credit} MCs)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p>{module.description}</p>
                </div>
                <div>
                  <ModuleTreeComponent
                    moduleCode={module.moduleCode}
                    prereqTree={module.preReq}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p>Module not found</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
