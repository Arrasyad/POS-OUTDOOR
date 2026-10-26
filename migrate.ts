import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "./src/db";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Running migrations...");
  const poolConnection = mysql.createPool(process.env.DATABASE_URL as string);
  const { drizzle } = await import("drizzle-orm/mysql2");
  const migrationDb = drizzle(poolConnection);
  
  await migrate(migrationDb, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
