import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // データベース接続
    const db = await open({
      filename: path.join(process.cwd(), "src", "database.sqlite"),
      driver: sqlite3.Database,
    });

    // 全フレーズを取得
    const phrases = await db.all("SELECT * FROM phrases");

    if (phrases.length === 0) {
      return res.status(404).json({ error: "No phrases found" });
    }

    // ランダムなフレーズを選択
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const randomPhrase = phrases[randomIndex];

    // データベース接続を閉じる
    await db.close();

    res.status(200).json(randomPhrase);
  } catch (error) {
    console.error("Error fetching random phrase:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
