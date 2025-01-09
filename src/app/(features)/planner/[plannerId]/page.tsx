"use client";

import { ChevronLeft } from "lucide-react";

import CoursePlanner from "@/components/planner/coursePlanner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PADDING } from "@/config";

interface PlannerIdPageProps {
  params: {
    plannerId: string;
  };
}
export default function PlannerIdPage({ params }: PlannerIdPageProps) {
  return (
    <>
      <div
        style={{
          paddingLeft: PADDING,
          paddingRight: PADDING,
          paddingTop: PADDING,
          paddingBottom: "calc(0.5 * " + PADDING + ")",
        }}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator>
              <ChevronLeft />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink href="/planner">Planner</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <CoursePlanner plannerId={params.plannerId} />
    </>
  );
}
