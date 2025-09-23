import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  POSTGRES_URL: z.string(),
  AUTH_SECRET: z.string(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
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
