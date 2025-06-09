"use client";

import { Suspense } from "react";
import { useQueryState } from "nuqs";

import { BidAnalytics } from "@/components/BidAnalytics";
import { SearchModule } from "@/components/SearchModule";
import { PADDING } from "@/config";

function BidAnalyticsContent() {
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

export default function BidAnalyticsPage() {
  return (
    <Suspense fallback={<div style={{ padding: PADDING }}>Loading...</div>}>
      <BidAnalyticsContent />
    </Suspense>
  );
}
