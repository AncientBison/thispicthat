import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  POSTGRES_URL: z.string(),
  S3_ENDPOINT: z.string(),
  S3_REGION: z.string(),
  S3_BUCKET: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_PUBLIC_ENDPOINT: z.url(),
  AUTH_SECRET: z.string(),
  AUTH_URL : z.url(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  MAX_IMAGE_DIMENSION: z.coerce.number(),
  ENV: z
    .union([
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .default("development"),
});

const env = envSchema.parse(process.env);

export default env;
