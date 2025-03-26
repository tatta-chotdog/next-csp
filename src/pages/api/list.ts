import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = getDB();
    const results = db.prepare("SELECT * FROM phrases ORDER BY id DESC").all();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching phrases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
