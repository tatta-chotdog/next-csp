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

  try {
    // データベース接続
    const db = await open({
      filename: path.join(process.cwd(), "src", "database.sqlite"),
      driver: sqlite3.Database,
    });

    // フレーズを削除
    const result = await db.run("DELETE FROM phrases WHERE id = ?", id);

    // データベース接続を閉じる
    await db.close();

    if (result.changes === 0) {
      return res.status(404).json({ error: "Phrase not found" });
    }

    res.status(200).json({ message: "Phrase deleted successfully" });
  } catch (error) {
    console.error("Error deleting phrase:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
