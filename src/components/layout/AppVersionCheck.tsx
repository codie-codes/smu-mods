"use client";

import { useEffect } from "react";

import { env } from "@/env";
import { useConfigStore } from "@/stores/config/provider";
import { useModuleBankStore } from "@/stores/moduleBank/provider";
import { Logger } from "@/utils/Logger";

const APP_VERSION = env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
const TURN_ON_REFRESH = false;

export const AppVersionCheck = () => {
  const { refreshBanners, appVersion, changeAppVersion } = useConfigStore(
    (state) => state,
  );
  const { refreshAll } = useModuleBankStore((state) => state);
  useEffect(() => {
    if (
      appVersion != APP_VERSION ||
      (appVersion == "development" && TURN_ON_REFRESH)
    ) {
      Logger.log("Version:", appVersion, true);
      Logger.log("New version detected, refreshing data...", true);
      if (appVersion != "development") {
        refreshAll();
      }
      refreshBanners();
      changeAppVersion(APP_VERSION);
    }
  }, [appVersion]);
  return <></>;
};
