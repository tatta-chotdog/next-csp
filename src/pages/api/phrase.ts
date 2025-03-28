import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createServerSupabaseClient({ req, res });

    if (req.method === "GET") {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { data, error } = await supabase
        .from("phrases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      res.status(200).json(data || []);
    } else if (req.method === "POST") {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { japanese, english } = req.body;

      if (!japanese || !english) {
        return res
          .status(400)
          .json({ error: "Japanese and English text are required" });
      }

      const { data, error } = await supabase
        .from("phrases")
        .insert([{ japanese, english }])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({
          error: "Database error",
          details: error.message,
        });
      }

      res.status(201).json(data);
    } else if (req.method === "DELETE") {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const { error } = await supabase.from("phrases").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({
          error: "Database error",
          details: error.message,
        });
      }

      res.status(200).json({ message: "Phrase deleted successfully" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
