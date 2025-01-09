"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { APP_CONFIG } from "@/config";
import { useConfigStore } from "@/stores/config/provider";
import { useMultiplePlannerStore } from "@/stores/multiplePlanners/provider";
import { useTimetableStore } from "@/stores/timetable/provider";
import { api } from "@/trpc/react";
import { Logger } from "@/utils/Logger";

export default function Page({ params }: { params: { token: string } }) {
  const { mutateAsync: getToken } = api.iSync.getContent.useMutation();
  const { iSync: iSyncTimeTable } = useTimetableStore((state) => state);
  const { iSync: iSyncPlanners } = useMultiplePlannerStore((state) => state);
  const { iSync: iSyncConfig } = useConfigStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      const { content } = await getToken({ token: params.token });
      const data = JSON.parse(content);
      try {
        iSyncTimeTable(data.timetable);
        iSyncPlanners(data.planners);
        iSyncConfig(
          data.timetableTheme,
          data.roomTheme,
          data.matriculationYear,
        );
      } catch (e) {
        Logger.error(e);
      }
      router.push(`/timetable/${APP_CONFIG.currentTerm}`);
    };

    fetchContent();
  }, []);

  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      Loading...
    </div>
  );
}
