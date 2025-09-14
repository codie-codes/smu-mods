import { S3Client } from "@aws-sdk/client-s3";

import { env } from "@/env";

// Create S3 client that works with both AWS S3 and MinIO
export const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  // Use custom endpoint for MinIO (local testing)
  ...(env.AWS_S3_ENDPOINT && {
    endpoint: env.AWS_S3_ENDPOINT,
  }),
  // Force path style for MinIO compatibility
  forcePathStyle: env.FORCE_PATH_STYLE === "true",
});

// Export bucket name for convenience
export const S3_BUCKET = env.AWS_S3_BUCKET;
