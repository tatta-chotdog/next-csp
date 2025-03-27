import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDB();

  try {
    if (req.method === "GET") {
      const phrases = db.prepare("SELECT * FROM phrases").all();
      res.status(200).json(phrases || []);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
