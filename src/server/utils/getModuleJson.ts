import { GetObjectCommand } from "@aws-sdk/client-s3";

import { ModuleBank } from "@/types/banks/moduleBank";

import { redis } from "../lib/redis";
import { S3_BUCKET, s3Client } from "../lib/s3";

export async function getModuleJson() {
  try {
    await redis.connect();
    const cachedData = await redis.get("modules");
    if (cachedData) {
      redis.destroy();
      const jsonData = JSON.parse(cachedData);
      return jsonData as ModuleBank;
    }
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: "modules.json",
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("No data received from S3");
    }

    // Convert stream to string
    const bodyString = await response.Body.transformToString();

    // Parse JSON
    const jsonData = JSON.parse(bodyString);

    await redis.set("modules", JSON.stringify(jsonData));
    redis.destroy();

    return jsonData as ModuleBank;
  } catch (error) {
    console.error("Error downloading and parsing JSON from S3:", error);
    throw error;
  }
}
