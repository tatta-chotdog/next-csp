import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // infird.comからのアクセスをブロック
  const referer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");

  if (
    (referer && referer.includes("infird.com")) ||
    (userAgent && userAgent.includes("infird.com"))
  ) {
    // ブロックされたアクセスをログに記録
    console.log(`Blocked access from infird.com: ${request.url}`);
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
