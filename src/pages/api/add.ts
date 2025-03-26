import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { japanese, english } = req.body;

  if (!japanese || !english) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = getDB();
    const result = db
      .prepare("INSERT INTO phrases (japanese, english) VALUES (?, ?)")
      .run(japanese, english);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error adding phrase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
