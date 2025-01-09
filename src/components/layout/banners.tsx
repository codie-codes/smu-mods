"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Marquee from "react-fast-marquee";

import { useConfigStore } from "@/stores/config/provider";

import { Button } from "../ui/button";

const ANIMATION_DURATION = 10;

export function Banners() {
  const { banners, dismissBanner } = useConfigStore((state) => state);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(
          (prevIndex) =>
            (prevIndex + 1) %
            banners.filter((banner) => !banner.dismissed).length,
        );
      }, ANIMATION_DURATION * 1000);
      return () => clearInterval(interval);
    }
  }, [isHovered, banners]);

  const HandleDismissBanner = (id?: string) => {
    const index = banners.findIndex((banner) => banner.id === id);
    if (!banners[index]) return;
    banners[index].dismissed = true; // Update your state to dismiss the banner
    setCurrentBannerIndex(0); // Reset to the first available banner after dismissal
    dismissBanner(index);
  };

  const activeBanners = banners.filter((banner) => !banner.dismissed);
  if (!isClient) {
    return null;
  }
  return (
    <>
      {activeBanners.length > 0 && (
        <div
          className="mb-2 flex items-center justify-start rounded-lg border-2 bg-background p-2 shadow-md"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        >
          <div className="flex w-full items-center justify-between">
            <div className="w-full overflow-hidden">
              <Marquee
                pauseOnHover
                onFinish={() =>
                  setCurrentBannerIndex((orig) =>
                    orig + 1 >= activeBanners.length ? 0 : orig + 1,
                  )
                }
              >
                <div className="w-full">
                  {activeBanners[currentBannerIndex]?.message}
                </div>
              </Marquee>
            </div>
            <Button
              onClick={() =>
                HandleDismissBanner(activeBanners[currentBannerIndex]?.id)
              }
              size={"icon"}
              variant={"ghost"}
              className="size-6 rounded-full"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
