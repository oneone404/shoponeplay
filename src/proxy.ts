import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { APP_VERSION } from "./lib/version";

const { auth } = NextAuth(authConfig);

export default auth(async function proxy(req) {
  const { nextUrl, auth, cookies } = req;

  // 1. Version Check
  const clientVersion = cookies.get("app_version")?.value;
  
  if (clientVersion !== APP_VERSION) {
    if (nextUrl.searchParams.get("v") !== APP_VERSION) {
      const url = nextUrl.clone();
      url.searchParams.set("v", APP_VERSION);
      const response = NextResponse.redirect(url);
      response.cookies.set("app_version", APP_VERSION, { maxAge: 31536000, path: '/' });
      return response;
    }
  }

  // 2. Auth logic
  if (!auth && nextUrl.pathname.startsWith("/user")) {
    const signinUrl = new URL("/signin", nextUrl.origin);
    return NextResponse.redirect(signinUrl);
  }

  // 3. Admin Route Protection
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!auth) {
      const signinUrl = new URL("/signin", nextUrl.origin);
      return NextResponse.redirect(signinUrl);
    }
    if ((auth?.user as any)?.role !== "ADMIN") {
      const homeUrl = new URL("/", nextUrl.origin);
      return NextResponse.redirect(homeUrl);
    }
  }

  // 4. Security Shield — Only Rate Limit + Ban Check
  const isProtectedPage = !nextUrl.pathname.startsWith("/api") &&
                          !nextUrl.pathname.startsWith("/admin") &&
                          !nextUrl.pathname.startsWith("/signin") &&
                          !nextUrl.pathname.startsWith("/signup") &&
                          !nextUrl.pathname.startsWith("/_next");

  if (isProtectedPage) {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";

    try {
      const rateRes = await fetch(`${nextUrl.origin}/api/public/rate-check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": ip,
          ...(process.env.RATE_CHECK_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
            ? { "x-shoponeplay-rate-check": process.env.RATE_CHECK_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "" }
            : {}),
        },
        body: JSON.stringify({
          path: nextUrl.pathname,
          userAgent: req.headers.get("user-agent") || "Unknown"
        })
      });
      const rateData = await rateRes.json();

      if (!rateData.allowed) {
        if (rateData.reason === "BANNED") {
          return new NextResponse(
            `<html><body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;background:#0a0a0a;color:white;text-align:center">
              <div>
                <h1 style="font-size:3rem;font-weight: 700;margin-bottom:1rem">🚫 403</h1>
                <p style="color:#888;font-size:0.875rem;letter-spacing:0.2em;text-transform:uppercase">Truy cập bị từ chối</p>
                <p style="color:#555;font-size:0.75rem;margin-top:1rem">IP của bạn đã bị chặn do hoạt động đáng ngờ.</p>
              </div>
            </body></html>`,
            { status: 403, headers: { "Content-Type": "text/html" } }
          );
        }

        if (rateData.reason === "RATE_LIMITED") {
          return new NextResponse(
            `<html><body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;background:#0a0a0a;color:white;text-align:center">
              <div>
                <h1 style="font-size:3rem;font-weight: 700;margin-bottom:1rem">⚠️ 429</h1>
                <p style="color:#888;font-size:0.875rem;letter-spacing:0.2em;text-transform:uppercase">Quá nhiều yêu cầu</p>
                <p style="color:#555;font-size:0.75rem;margin-top:1rem">Vui lòng đợi vài giây rồi thử lại.</p>
              </div>
            </body></html>`,
            { status: 429, headers: { "Content-Type": "text/html", "Retry-After": "10" } }
          );
        }
      }
    } catch (e) {
      // Fail-open
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|icons|uploads).*)"],
};
