"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { APP_CONFIG } from "@/config";
import { useConfigStore } from "@/stores/config/provider";
import { useMultiplePlannerStore } from "@/stores/multiplePlanners/provider";
import { useTimetableStore } from "@/stores/timetable/provider";
import { api } from "@/trpc/react";
import { Logger } from "@/utils/Logger";

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { mutateAsync: getToken } = api.iSync.getContent.useMutation();
  const { iSync: iSyncTimeTable } = useTimetableStore((state) => state);
  const { iSync: iSyncPlanners } = useMultiplePlannerStore((state) => state);
  const { iSync: iSyncConfig } = useConfigStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      const { token } = await params;
      const { content } = await getToken({ token });
      const data = JSON.parse(content);
      try {
        iSyncTimeTable(data.timetable);
        iSyncPlanners(data.planners);
        iSyncConfig(data.timetableTheme, data.matriculationYear);
      } catch (e) {
        Logger.error(e);
      }
      router.push(`/timetable/${APP_CONFIG.currentTerm}`);
    };

    fetchContent();
  }, [getToken, iSyncTimeTable, iSyncPlanners, iSyncConfig, router, params]);

  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      Loading...
    </div>
  );
}
