import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // ===== Not logged in =====
  if (!session) {
    if (
      pathname.startsWith("/student") ||
      pathname.startsWith("/teacher") ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return response;
  }

  const role = (session.user as any)?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ===== Protected routes =====
  if (
    pathname.startsWith("/student") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/admin")
  ) {
    const prefix = pathname.split("/")[1];

    if (role !== prefix) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ===== Prevent login/register when logged in =====
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/student/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};