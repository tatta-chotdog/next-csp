import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ブロック対象のドメインを環境変数から取得
const BLOCKED_DOMAINS =
  process.env.NEXT_PUBLIC_BLOCKED_DOMAINS?.split(",") || [];

// 許可されたリダイレクト先
const ALLOWED_REDIRECT_HOSTS = [
  process.env.NEXT_PUBLIC_APP_URL,
  "https://accounts.google.com",
  "https://*.youtube.com",
  "https://*.supabase.co",
];

export function middleware(request: NextRequest) {
  const referer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");

  // 特定のプロトコルやパスは処理をスキップ
  if (
    request.url.startsWith("chrome-error://") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname === "/favicon.ico" ||
    request.nextUrl.pathname.startsWith("/static/") ||
    request.nextUrl.pathname.startsWith("/auth/") || // 認証関連のパスをスキップ
    request.nextUrl.pathname.startsWith("/api/auth") // 認証APIをスキップ
  ) {
    return NextResponse.next();
  }

  // リダイレクトチェック
  const redirectUri = request.nextUrl.searchParams.get("redirect_uri");
  if (redirectUri) {
    try {
      const redirectUrl = new URL(redirectUri);
      const isAllowedRedirect = ALLOWED_REDIRECT_HOSTS.some((host) => {
        if (!host) return false;
        const pattern = new RegExp(
          `^${host.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`
        );
        return pattern.test(redirectUrl.origin);
      });

      if (!isAllowedRedirect) {
        console.log(`Blocked unauthorized redirect to: ${redirectUri}`);
        return new NextResponse(null, { status: 403 });
      }
    } catch (error) {
      console.error("Invalid redirect URI:", error);
      return new NextResponse(null, { status: 400 });
    }
  }

  // ブロック対象のドメインをチェック
  if (BLOCKED_DOMAINS.length > 0) {
    const isBlocked = BLOCKED_DOMAINS.some((domain) => {
      const domainPattern = new RegExp(
        domain.replace(/\./g, "\\.").replace(/\*/g, ".*"),
        "i"
      );
      return (
        (referer && domainPattern.test(referer)) ||
        (userAgent && domainPattern.test(userAgent))
      );
    });

    if (isBlocked) {
      console.log(
        `Blocked access: URL=${request.url}, Referer=${referer}, UserAgent=${userAgent}`
      );
      return new NextResponse(null, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
