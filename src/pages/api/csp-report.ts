import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // CSPレポートをログに出力
    console.log("CSP Violation Report:", req.body);

    // レポートの詳細をログに出力
    if (req.body["csp-report"]) {
      const report = req.body["csp-report"];
      console.log("Blocked URI:", report["blocked-uri"]);
      console.log("Violated Directive:", report["violated-directive"]);
      console.log("Original Policy:", report["original-policy"]);
    }

    res.status(204).end();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
