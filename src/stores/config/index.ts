import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AcademicYear, Banner } from "@/config";
import type { TimetableThemeName } from "@/utils/timetable/colours";
import { APP_CONFIG } from "@/config";
import { Logger } from "@/utils/Logger";

export type ISyncRecord = {
  id: string;
  hash: string;
  dateTime: string;
};

export type ConfigAction = {
  changeISyncLatestRecord: (newRecord: ISyncRecord | null) => void;
  changeTimetableTheme: (newTheme: TimetableThemeName) => void;
  changeMatriculationYear: (matriculationYear: AcademicYear) => void;
  iSync: (
    timetableTheme: TimetableThemeName,
    matriculationYear: AcademicYear,
  ) => void;
  dismissBanner: (bannerIndex: number) => void;
  dismissWarning: () => void;
  refreshBanners: () => void;
  changeAppVersion: (newVersion: string) => void;
  dimissNavigationPopup: () => void;
};

export type BannerState = Banner & { dismissed: boolean };

export type ConfigStore = {
  iSyncLatestRecord: ISyncRecord | null;
  timetableTheme: TimetableThemeName;
  matriculationYear: AcademicYear;
  banners: BannerState[];
  warningDismissedTime: number;
  appVersion: string | null;
  navigationPopupDismissed: boolean;
} & ConfigAction;

export const createConfigBank = (
  defaultLastRecord: ISyncRecord | null = null,
  defaultTimetableTheme: TimetableThemeName = "default",
  defaultAcademicYear: AcademicYear = APP_CONFIG.academicYear,
  defaultBanners: BannerState[] = APP_CONFIG.banners.map((banner) => ({
    ...banner,
    dismissed: false,
  })),
) => {
  return create<ConfigStore>()(
    persist(
      (set) => ({
        iSyncLatestRecord: defaultLastRecord,
        timetableTheme: defaultTimetableTheme,
        matriculationYear: defaultAcademicYear,
        banners: defaultBanners,
        warningDismissedTime: Date.now() - 1000 * 60 * 60 * 24 * 7,
        appVersion: null,
        navigationPopupDismissed: false,
        changeISyncLatestRecord: (newRecord) => {
          set({ iSyncLatestRecord: newRecord });
        },
        changeTimetableTheme: (newTheme) => {
          set({ timetableTheme: newTheme });
        },
        changeMatriculationYear: (newMatriculationYear) => {
          set({ matriculationYear: newMatriculationYear });
        },
        iSync: (timetableTheme, matriculationYear) => {
          set({
            timetableTheme,
            matriculationYear,
          });
        },
        dismissBanner: (bannerIndex) => {
          set((state) => {
            const banners = JSON.parse(
              JSON.stringify(state.banners),
            ) as BannerState[];
            if (banners[bannerIndex]) {
              banners[bannerIndex].dismissed = true;
            }
            return { banners };
          });
        },
        dismissWarning: () => {
          set({ warningDismissedTime: Date.now() });
        },
        refreshBanners: () => {
          set((state) => {
            const newBanners: BannerState[] = [];

            APP_CONFIG.banners.forEach((banner) => {
              const existingBanner = state.banners.find(
                (b) => b.id === banner.id,
              );
              if (existingBanner) {
                newBanners.push(existingBanner);
              } else {
                newBanners.push({ ...banner, dismissed: false });
              }
            });
            return { banners: newBanners };
          });
        },
        changeAppVersion: (newVersion) => {
          Logger.log("Changing app version to", newVersion);
          set({ appVersion: newVersion });
        },
        dimissNavigationPopup: () => {
          set({ navigationPopupDismissed: true });
        },
      }),
      {
        name: "config",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
