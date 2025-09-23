import { drizzle } from "drizzle-orm/node-postgres";
import env from "@/env";

const db = drizzle(env.POSTGRES_URL);

export default db;
