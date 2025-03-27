import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = getDB();
    const result = db.prepare("DELETE FROM phrases WHERE id = ?").run(id);

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
  }
}
