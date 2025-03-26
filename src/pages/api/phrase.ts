import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDB();

  try {
    if (req.method === "GET") {
      // 全フレーズを取得
      const phrases = db
        .prepare("SELECT * FROM phrases ORDER BY created_at DESC")
        .all();
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
      const result = db
        .prepare("INSERT INTO phrases (japanese, english) VALUES (?, ?)")
        .run(japanese, english);

      res.status(201).json({
        id: result.lastInsertRowid,
        japanese,
        english,
      });
    } else if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // フレーズを削除
      const result = db.prepare("DELETE FROM phrases WHERE id = ?").run(id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Phrase not found" });
      }

      res.status(200).json({ message: "Phrase deleted successfully" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
}
