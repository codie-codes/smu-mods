import { GenerateQRCode } from "../iSync/QRCode";
import { MatriculationYearSettings } from "./matriculation";
import { RefreshModulesSetting } from "./refreshModules";
import { ResetApplicationSetting } from "./reset";
import { ToggleTimetableTheme } from "./ToggleTimetableTheme";

export type setting = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const settings: setting[] = [
  {
    title: "Matriculation Year",
    children: <MatriculationYearSettings />,
  },
  {
    title: "iSync",
    description: "Synchronize your timetable",
    children: <GenerateQRCode />,
  },
  {
    title: "Get Latest Module List",
    description:
      "Get the latest module list from the server. This is to ensure that you have the latest modules and their information",
    children: <RefreshModulesSetting />,
  },
  {
    title: "Timetable Theme",
    children: <ToggleTimetableTheme />,
  },
  {
    title: "Reset Application",
    description:
      "If you are facing issues with the application, you can reset the data stored in the application. This will remove all your Planner and Timetable data",
    children: <ResetApplicationSetting />,
  },
];
