import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ブロック対象のドメインを環境変数から取得
const BLOCKED_DOMAINS = process.env.NEXT_PUBLIC_BLOCKED_DOMAINS?.split(",") || [
  "infird.com",
];

export function middleware(request: NextRequest) {
  const referer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");

  // ブロック対象のドメインをチェック
  const isBlocked = BLOCKED_DOMAINS.some((domain) => {
    const domainPattern = new RegExp(domain.replace(/\./g, "\\."), "i");
    return (
      (referer && domainPattern.test(referer)) ||
      (userAgent && domainPattern.test(userAgent))
    );
  });

  if (isBlocked) {
    // ブロックされたアクセスをログに記録
    console.log(`Blocked access from blocked domain: ${request.url}`);
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
