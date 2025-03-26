import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // データベース接続
  const db = await open({
    filename: path.join(process.cwd(), "src", "database.sqlite"),
    driver: sqlite3.Database,
  });

  try {
    if (req.method === "GET") {
      // 全フレーズを取得
      const phrases = await db.all("SELECT * FROM phrases");

      // 空の配列を返す（404ではなく）
      res.status(200).json(phrases || []);
    } else if (req.method === "POST") {
      const { japanese, english } = req.body;

      // バリデーション
      if (!japanese || !english) {
        return res
          .status(400)
          .json({ error: "Japanese and English text are required" });
      }

      // フレーズを登録
      const result = await db.run(
        "INSERT INTO phrases (japanese, english) VALUES (?, ?)",
        [japanese, english]
      );

      res.status(201).json({
        id: result.lastID,
        japanese,
        english,
      });
    } else if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // フレーズを削除
      const result = await db.run("DELETE FROM phrases WHERE id = ?", id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Phrase not found" });
      }

      res.status(200).json({ message: "Phrase deleted successfully" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // データベース接続を閉じる
    await db.close();
  }
}
