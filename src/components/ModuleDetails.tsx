import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BookOpen, Clock, Users, AlertCircle, Loader2 } from "lucide-react";

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
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading module details...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="font-semibold text-lg">Unable to load module</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
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

            <div className="flex-1 overflow-y-auto space-y-6">
              <Card className="border shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {module.description}
                  </p>
                </CardContent>
              </Card>

              {module.preReq && (
                <Card className="border shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
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
                  <CardTitle className="text-lg flex items-center gap-2">
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
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">Module not found</h3>
                <p className="text-sm text-muted-foreground mt-1">
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
