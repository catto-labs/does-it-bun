import path from "path";
const SQLITE_DB_PATH = path.resolve(import.meta.dir, "sqlite.db");

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database(SQLITE_DB_PATH, { create: true });
const database = drizzle(sqlite);

export default database;
export * from "./schemas";
