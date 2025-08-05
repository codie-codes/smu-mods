import posthog from "posthog-js";

if (
  !window.location.host.includes("127.0.0.1") &&
  !window.location.host.includes("localhost")
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2025-05-24",
  });
}
