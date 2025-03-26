import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let db;
  try {
    // データベース接続
    db = await open({
      filename: path.join(process.cwd(), "src", "data", "phrases.db"),
      driver: sqlite3.Database,
    });

    // フレーズを削除
    const result = await db.run("DELETE FROM phrases WHERE id = ?", id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Phrase not found" });
    }

    res.status(200).json({ message: "Phrase deleted successfully" });
  } catch (error: Error | unknown) {
    console.error("Error deleting phrase:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  } finally {
    if (db) {
      await db.close();
    }
  }
}
