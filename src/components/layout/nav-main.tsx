"use client";

import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { SheetClose } from "../ui/sheet";

export type SubLinks = {
  title: string;
  url: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  description?: string;
};

export type MainLink = {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  isCollapsible: false;
  url: string;
};

export type CollapsibleLink = {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  isCollapsible: true;
  items: SubLinks[];
  isActive?: boolean;
};

export type Links = MainLink | CollapsibleLink;

export function NavMain({
  className,
  items,
}: {
  items: Links[];
} & React.ComponentProps<"ul">) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  return (
    <ul className={cn("grid gap-0.5", className)}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {item.isCollapsible ? (
            <Collapsible asChild defaultOpen={item.isActive}>
              <li>
                <div className="relative flex items-center">
                  <CollapsibleTrigger className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <div className="flex flex-1 overflow-hidden">
                      <div className="line-clamp-1 pr-6">{item.title}</div>
                    </div>
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="px-4 py-0.5">
                  <ul className="grid border-l px-2">
                    {item.items?.map((subItem) => (
                      <li key={subItem.title}>
                        {isMobile ? (
                          <SheetClose asChild>
                            <Link
                              href={subItem.url}
                              className="flex h-8 min-w-8 items-center gap-2 overflow-hidden rounded-md px-2 text-sm font-medium text-muted-foreground ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
                            >
                              <div className="line-clamp-1">
                                {subItem.title}
                              </div>
                            </Link>
                          </SheetClose>
                        ) : (
                          <Link
                            href={subItem.url}
                            className="flex h-8 min-w-8 items-center gap-2 overflow-hidden rounded-md px-2 text-sm font-medium text-muted-foreground ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2"
                          >
                            <div className="line-clamp-1">{subItem.title}</div>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </li>
            </Collapsible>
          ) : (
            <li>
              {isMobile ? (
                <SheetClose asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2",
                      pathname.startsWith(item.url) &&
                        item.url !== "/" &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <div className="flex flex-1 overflow-hidden">
                      <div className="line-clamp-1 pr-6">{item.title}</div>
                    </div>
                  </Link>
                </SheetClose>
              ) : (
                <Link
                  href={item.url}
                  className={cn(
                    "flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2",
                    pathname.startsWith(item.url) &&
                      item.url !== "/" &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <div className="flex flex-1 overflow-hidden">
                    <div className="line-clamp-1 pr-6">{item.title}</div>
                  </div>
                </Link>
              )}
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );
}
