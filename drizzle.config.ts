import { defineConfig } from "drizzle-kit";
import env from "@/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
});
