import { createClient } from "redis";

import { env } from "@/env";

export const redis = createClient({
  url: env.REDIS_URL,
});

let isConnected = false;

// Ensure Redis is connected
export async function ensureRedisConnection() {
  if (!isConnected && !redis.isOpen) {
    await redis.connect().catch((err) => {
      console.error("Failed to connect to Redis:", err);
      throw err;
    });
    isConnected = true;
  }
}

// Handle Redis connection events
redis.on("error", (err) => {
  console.error("Redis error:", err);
  isConnected = false;
});

redis.on("connect", () => {
  isConnected = true;
});

redis.on("disconnect", () => {
  isConnected = false;
});
