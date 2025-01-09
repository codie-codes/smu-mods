"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import type { ExtendedSchoolEvent } from "@/stores/event";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { EventCard } from "./EventCard";

type TabsProps = {
  tabsData: Record<string, ExtendedSchoolEvent[]>;
  eventCardActions?: ((
    event: ExtendedSchoolEvent,
    index: string | number,
  ) => ReactNode)[];
};

export default function EventTabs({
  tabsData,
  eventCardActions: addToStarred,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    Object.keys(tabsData)[0] ?? "clubs",
  ); // Default to the first tab

  const tabs = Object.keys(tabsData);

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab} value={tab}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {tabsData[tab]?.map((event, index) => (
              <EventCard key={index} event={event} actions={addToStarred} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
