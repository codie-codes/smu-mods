"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Background } from "@/components/Background";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_CONFIG } from "@/config";

const roadmapItems = [
  {
    stage: "completed",
    items: [
      "Module search and filtering",
      "Interactive timetable builder",
      "Module information display",
      "Basic responsive design",
      "Prerequisite tracking",
    ],
  },
  {
    stage: "in-progress",
    items: [
      "Timetable optimization",
      "Better data visualization for Bidding prices",
    ],
  },
  {
    stage: "planned",
    items: ["Integration with Afterclass", "Degree progress tracker"],
  },
];

const StageIcon = ({ stage }: { stage: string }) => {
  switch (stage) {
    case "completed":
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    case "in-progress":
      return <Clock className="h-6 w-6 text-yellow-500" />;
    case "planned":
      return <Circle className="h-6 w-6 text-gray-400" />;
    default:
      return <Circle className="h-6 w-6 text-gray-400" />;
  }
};

const RoadmapComponent = () => {
  const inProgressItem = roadmapItems.find(
    (item) => item.stage === "in-progress",
  );
  const plannedItem = roadmapItems.find((item) => item.stage === "planned");
  const completedItem = roadmapItems.find((item) => item.stage === "completed");

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Development Roadmap</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Track our progress as we continuously improve SMUMods to better
            serve the SMU community
          </p>
        </div>

        <div className="space-y-8">
          {/* In Progress and Planned - Side by Side */}
          <div className="grid gap-8 md:grid-cols-2">
            {[inProgressItem, plannedItem].map(
              (item, index) =>
                item && (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-3">
                        <StageIcon stage={item.stage} />
                        <Badge
                          variant={
                            item.stage === "completed"
                              ? "default"
                              : item.stage === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {item.stage.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {item.items.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="bg-primary mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                            <span
                              className={
                                item.stage === "completed"
                                  ? "text-muted-foreground line-through"
                                  : ""
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ),
            )}
          </div>

          {/* Completed - Full Width with Auto-flowing Columns */}
          {completedItem && (
            <Card className="relative">
              <CardHeader>
                <div className="mb-2 flex items-center gap-3">
                  <StageIcon stage={completedItem.stage} />
                  <Badge variant="default">
                    {completedItem.stage.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="columns-2 gap-6 space-y-2 md:columns-3 lg:columns-4">
                  {completedItem.items.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex break-inside-avoid items-start gap-2 text-sm"
                    >
                      <div className="bg-primary mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      <span className="text-muted-foreground line-through">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

const NavBar = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-screen justify-center border-y backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Logo />

        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href={`/timetable/${APP_CONFIG.currentTerm}`}>
              <Calendar className="mr-2 h-4 w-4" />
              Timetable
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "light" ? "dark" : "light")
            }
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Background />
      <NavBar />
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="from-primary to-foreground mb-6 bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            SMUMods
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl md:text-2xl">
            A web application designed to help SMU students plan their modules
            effectively
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 text-lg">
              <Link href={`/timetable/${APP_CONFIG.currentTerm}`}>
                Start Planning <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 text-lg"
              asChild
            >
              <Link
                href="https://github.com/codie-codes/smu-mods"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Key Features</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Everything you need to plan your SMU academic journey efficiently
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Search className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Module Search</CardTitle>
                <CardDescription>
                  Find and filter through all available SMU modules with
                  advanced search capabilities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Calendar className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Timetable Planning</CardTitle>
                <CardDescription>
                  Create and optimize your class schedule with our intuitive
                  timetable builder
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <BookOpen className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Module Information</CardTitle>
                <CardDescription>
                  Access comprehensive details about each module including
                  prerequisites and descriptions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <RoadmapComponent />

      {/* CTA Section */}
      <section className="bg-primary/5 px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Plan Your Modules?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of SMU students who are already using SMUMods to plan
            their academic journey
          </p>
          <Button asChild size="lg" className="px-8 text-lg">
            <Link href={`/timetable/${APP_CONFIG.currentTerm}`}>
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="text-muted-foreground mx-auto max-w-6xl text-center">
          <p>
            Open sourced under the{" "}
            <Link
              href="https://github.com/codie-codes/smu-mods/blob/main/LICENSE.md"
              className="hover:text-foreground underline"
            >
              MIT License
            </Link>
            {" • "}
            <Link
              href="https://github.com/codie-codes/smu-mods/blob/main/docs/CONTRIBUTING.md"
              className="hover:text-foreground underline"
            >
              Contributing Guide
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
