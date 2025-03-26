import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: InstanceType<typeof Database>;

export function getDB() {
  if (!db) {
    // Vercel環境では一時ディレクトリを使用
    const dbPath =
      process.env.NODE_ENV === "production"
        ? "/tmp/phrases.db"
        : path.join(process.cwd(), "src", "data", "phrases.db");

    // 開発環境でのみディレクトリを作成
    if (process.env.NODE_ENV !== "production") {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    db = new Database(dbPath);

    // テーブルが存在しない場合は作成
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS phrases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        japanese TEXT NOT NULL,
        english TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    ).run();
  }
  return db;
}
