"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { BidAnalyticChart } from "@/components/BidAnalytics/Chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModuleBankStore } from "@/stores/moduleBank/provider";
import { api } from "@/trpc/react";
import { type ModuleCode } from "@/types/primitives/module";

import { Button } from "../ui/button";

interface BidAnalyticsProps {
  params: {
    moduleCode: string;
    instructor?: string;
  };
}

export function BidAnalytics({ params }: BidAnalyticsProps) {
  const { modules } = useModuleBankStore((state) => state);
  const [selectedInstructor, setSelectedInstructor] = useState<number>(0);
  const [selectedTerm, setSelectedTerm] = useState<number>(0);
  const [selectedSection, setSelectedSection] = useState<number>(0);

  const {
    data: instructors,
    isLoading,
    isError,
    error,
  } = api.bidAnalytics.getInstructors.useQuery({
    moduleCode: params.moduleCode,
  });

  const { data: terms, refetch: refetchTerms } =
    api.bidAnalytics.getTermsAvailable.useQuery(
      {
        moduleCode: params.moduleCode,
        instructor: instructors?.at(selectedInstructor)!,
      },
      {
        enabled: !!instructors?.at(selectedInstructor),
      },
    );

  const { data: sections, refetch: refetchSections } =
    api.bidAnalytics.getSections.useQuery(
      {
        moduleCode: params.moduleCode,
        instructor: instructors?.at(selectedInstructor)!,
        term: terms?.at(selectedTerm)!,
      },
      {
        enabled:
          !!instructors?.at(selectedInstructor) && !!terms?.at(selectedTerm),
      },
    );

  const { data: chartData, refetch: refetchChart } =
    api.bidAnalytics.getChartData.useQuery(
      {
        moduleCode: params.moduleCode,
        instructor: instructors?.at(selectedInstructor)!,
        term: terms?.at(selectedTerm)!,
        section: sections?.at(selectedSection)!,
      },
      {
        enabled:
          !!instructors?.at(selectedInstructor) &&
          !!terms?.at(selectedTerm) &&
          !!sections?.at(selectedSection),
      },
    );

  if (modules[params.moduleCode as ModuleCode] === undefined) {
    return <div>Module not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Bid Price Analytics for {params.moduleCode} -{" "}
        {modules[params.moduleCode as ModuleCode]!.name}
      </h2>
      <div className="flex flex-wrap items-center justify-start gap-2">
        <Button
          asChild
          size={"icon"}
          variant={"ghost"}
          disabled={!selectedInstructor}
        >
          <Link
            href={`https://www.afterclass.io/professor/smu-${instructors
              ?.at(selectedInstructor)
              ?.split(" ")
              .map((e) => e.toLowerCase())
              .join("-")}`}
            target="_blank"
          >
            <Image
              src="/afterclass.png"
              width={24}
              height={24}
              alt="Afterclass"
            />
          </Link>
        </Button>
        <Select
          value={selectedInstructor.toString()}
          onValueChange={async (e) => {
            setSelectedInstructor(parseInt(e));
            await refetchTerms();
            setSelectedTerm(0);
            await refetchSections();
            setSelectedSection(0);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an Instructor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Instructors</SelectLabel>
              {instructors
                ?.filter((e) => e.length > 0)
                .map((instructor, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {instructor}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={selectedTerm.toString()}
          onValueChange={async (e) => {
            setSelectedTerm(parseInt(e));
            await refetchSections();
            setSelectedSection(0);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Terms</SelectLabel>
              {terms
                ?.filter((e) => e.length > 0)
                .map((term, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {term}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={selectedSection.toString()}
          onValueChange={async (e) => {
            setSelectedSection(parseInt(e));
            await refetchChart();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sections</SelectLabel>
              {sections
                ?.filter((e) => e.length > 0)
                .map((section, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {section}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <BidAnalyticChart chartData={chartData ?? []} />
    </div>
  );
}
