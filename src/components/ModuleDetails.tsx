import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AlertCircle, BookOpen, Clock, Loader2, Users } from "lucide-react";

import type { ModuleCode } from "@/types/primitives/module";
import { useModuleBankStore } from "@/stores/moduleBank/provider";
import { PlannerModule } from "@/types/planner";
import { Logger } from "@/utils/Logger";

import { ModuleTreeComponent } from "./ModuleTree";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
  plannerModule?: PlannerModule["module"];
  children: ReactNode;
}

export default function ModuleDetails({
  moduleCode,
  plannerModule,
  children,
}: ModuleDetailsProps) {
  const { getModule } = useModuleBankStore((state) => state);
  const [module, setModule] = useState<PlannerModule["module"]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (plannerModule) {
      setModule(plannerModule);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getModule(moduleCode)
      .catch((e) => {
        Logger.log(e);
        setError("Failed to load module details");
      })
      .then((mod) => {
        if (!mod) {
          setError("Module not found");
          return;
        }
        setModule(mod);
      })
      .finally(() => setLoading(false));
  }, [moduleCode, getModule]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Loading module details...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="text-destructive h-12 w-12" />
              <div>
                <h3 className="text-lg font-semibold">Unable to load module</h3>
                <p className="text-muted-foreground mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        ) : module ? (
          <>
            <DialogHeader className="space-y-3 pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    {module.moduleCode}
                  </DialogTitle>
                  <DialogDescription className="text-base font-medium">
                    {module.name}
                  </DialogDescription>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {module.credit} MCs
                </Badge>
              </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto">
              <Card className="border shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {module.description}
                  </p>
                </CardContent>
              </Card>

              {module.preReq && (
                <Card className="border shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5" />
                      Prerequisites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ModuleTreeComponent
                      moduleCode={module.moduleCode}
                      prereqTree={module.preReq}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Additional module info sections can be added here */}
              <Card className="border shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Module Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Module Code:</span>
                      <p className="text-muted-foreground">
                        {module.moduleCode}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Credits:</span>
                      <p className="text-muted-foreground">
                        {module.credit} MCs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="text-muted-foreground h-12 w-12" />
              <div>
                <h3 className="text-lg font-semibold">Module not found</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  The requested module could not be found.
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
