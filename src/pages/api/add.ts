import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDB();

  try {
    if (req.method === "POST") {
      const { japanese, english } = req.body;

      if (!japanese || !english) {
        return res
          .status(400)
          .json({ error: "Japanese and English text are required" });
      }

      const result = db
        .prepare("INSERT INTO phrases (japanese, english) VALUES (?, ?)")
        .run(japanese, english);
      res.status(201).json({ id: result.lastInsertRowid, japanese, english });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
