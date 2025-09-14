import { GetObjectCommand } from "@aws-sdk/client-s3";

import { ModuleBank } from "@/types/banks/moduleBank";

import { S3_BUCKET, s3Client } from "../lib/s3";

export async function getModuleJson() {
  try {
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

    return jsonData as ModuleBank;
  } catch (error) {
    console.error("Error downloading and parsing JSON from S3:", error);
    throw error;
  }
}
