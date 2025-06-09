"use client";

import { BidAnalytics } from "@/components/BidAnalytics";
import { SearchModule } from "@/components/SearchModule";
import { PADDING } from "@/config";
import { useQueryState } from "nuqs";

export default function BidAnalyticsPage() {
  const [selectedModule, setSelectedModule] = useQueryState("module");
  return (
    <div
      style={{
        padding: PADDING,
      }}
      className="space-y-4"
    >
      <h1 className="text-2xl font-bold">Search Bid Price Analytics</h1>
      <SearchModule
        handleModSelect={(mod) => {
          setSelectedModule(mod.moduleCode);
        }}
      />
      {selectedModule && (
        <BidAnalytics
          params={{
            moduleCode: selectedModule,
          }}
        />
      )}
    </div>
  );
}
