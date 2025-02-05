import { Suspense } from "react";

import type { setting } from "@/components/settings";
import { settings } from "@/components/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PADDING } from "@/config";

interface SettingsCardProps {
  setting: setting;
}

function SettingsCard({ setting }: SettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{setting.title}</CardTitle>
        <CardDescription>{setting.description}</CardDescription>
      </CardHeader>
      <Suspense fallback={<SettingsCardLoading />}>
        <CardContent>{setting.children}</CardContent>
      </Suspense>
    </Card>
  );
}

function SettingsCardLoading() {
  return <Skeleton />;
}

export default function SettingsPage() {
  return (
    <div
      className="mx-auto max-w-md space-y-4"
      style={{
        padding: PADDING,
      }}
    >
      <h2 className="text-xl font-bold">Settings</h2>
      {settings.map((setting, idx) => (
        <SettingsCard key={idx} setting={setting} />
      ))}
    </div>
  );
}
