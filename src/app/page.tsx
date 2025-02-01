import { APP_CONFIG } from "@/config";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(`/timetable/${APP_CONFIG.currentTerm}`);
}
