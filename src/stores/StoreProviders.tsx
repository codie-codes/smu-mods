import { ConfigStoreProvider } from "./config/provider";
import { EventStoreProvider } from "./event/provider";
import { ModuleBankStoreProvider } from "./moduleBank/provider";
import { MultiplePlannerStoreProvider } from "./multiplePlanners/provider";
import { PlannerStoreProvider } from "./planner/provider";
import { TimetableStoreProvider } from "./timetable/provider";

export default function StoreProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigStoreProvider>
      <MultiplePlannerStoreProvider>
        <ModuleBankStoreProvider>
          <TimetableStoreProvider>
            <PlannerStoreProvider>
              <EventStoreProvider>{children}</EventStoreProvider>
            </PlannerStoreProvider>
          </TimetableStoreProvider>
        </ModuleBankStoreProvider>
      </MultiplePlannerStoreProvider>
    </ConfigStoreProvider>
  );
}
