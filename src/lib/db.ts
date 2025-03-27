import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: InstanceType<typeof Database>;

export function getDB() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "src", "data", "phrases.db");
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(dbPath);
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS phrases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        japanese TEXT NOT NULL,
        english TEXT NOT NULL
      )
    `
    ).run();
  }
  return db;
}
