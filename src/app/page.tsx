import { redirect } from "next/navigation";

import { APP_CONFIG } from "@/config";

export default function Home() {
  redirect(`/timetable/${APP_CONFIG.currentTerm}`);
}
