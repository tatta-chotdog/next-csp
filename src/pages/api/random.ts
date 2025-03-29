import type { NextApiRequest, NextApiResponse } from "next";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

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

      if (error) throw error;

      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No phrases found" });
      }

      const randomPhrase = data[Math.floor(Math.random() * data.length)];
      res.status(200).json(randomPhrase);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
