import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { CASE_SESSION_COOKIE } from "@/lib/case-session";

const SUPABASE_URL = "https://mxholbwepyzurhykoinx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oRW5ZFLbdMrLAQN5qV_86Q_D8A8bRmF";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gate the beta client flow: no case session cookie -> back to the access gate.
  if (pathname.startsWith("/onboarding") || pathname.startsWith("/portal")) {
    const token = request.cookies.get(CASE_SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/access", request.url));
    }
    return NextResponse.next();
  }

  // Gate the staff portal: require a signed-in Supabase auth session.
  if (pathname.startsWith("/staff") && pathname !== "/staff/login") {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding/:path*", "/portal/:path*", "/staff/:path*"],
};
