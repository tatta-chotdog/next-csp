import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // CSPレポートをログに出力
    console.log("CSP Violation Report:", req.body);

    // レポートの詳細をログに出力
    if (req.body["csp-report"]) {
      const report = req.body["csp-report"];
      const timestamp = new Date().toISOString();

      // 詳細なログ出力
      console.log(`
        [${timestamp}] CSP Violation Details:
        - Blocked URI: ${report["blocked-uri"]}
        - Violated Directive: ${report["violated-directive"]}
        - Original Policy: ${report["original-policy"]}
        - Document URI: ${report["document-uri"]}
        - Source File: ${report["source-file"]}
        - Line Number: ${report["line-number"]}
        - User Agent: ${req.headers["user-agent"]}
      `);

      // TODO: ここに監視システムへの通知やデータベースへの保存ロジックを追加
    }

    res.status(204).end();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
