import path from "path";
const SQLITE_DB_PATH = path.resolve(import.meta.dir, "sqlite.db");

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database(SQLITE_DB_PATH, { create: true });
const database = drizzle(sqlite);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS package_compatibility (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    compatible INTEGER NOT NULL
  )
`);

export default database;
export * from "./schemas";
