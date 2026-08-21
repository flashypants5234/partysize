import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";

const PROTECTED_PATHS = ["/portal", "/onboarding"];

export function middleware(request: NextRequest) {
  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    const token = request.cookies.get(CASE_SESSION_COOKIE)?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/access";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/onboarding/:path*"],
};