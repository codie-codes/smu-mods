import { CustomToaster } from "@/components/custom-toaster";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppVersionCheck } from "@/components/layout/AppVersionCheck";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { NavHeader } from "@/components/layout/nav-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreProviders from "@/stores/StoreProviders";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMU MODs",
  description: "Plan your SMU modules with ease",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <TRPCReactProvider>
          <HydrateClient>
            <StoreProviders>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <NuqsAdapter>
                  <TooltipProvider>
                    <SidebarProvider>
                      <AppVersionCheck />
                      <Disclaimer />
                      <AppSidebar />
                      <SidebarInset>
                        <NavHeader />
                        <div className="flex flex-1 flex-col gap-4 p-4">
                          {children}
                        </div>
                      </SidebarInset>
                    </SidebarProvider>
                  </TooltipProvider>
                </NuqsAdapter>
                <CustomToaster />
              </ThemeProvider>
            </StoreProviders>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
