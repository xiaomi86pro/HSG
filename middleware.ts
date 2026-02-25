import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set() {},
        remove() {},
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // ===== Chưa login =====
  if (!session) {
    if (
      pathname.startsWith('/student') ||
      pathname.startsWith('/teacher') ||
      pathname.startsWith('/admin')
    ) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  const role = session.user.app_metadata?.role

  // ===== Đã login → route protection =====
  if (pathname.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/teacher') && role !== 'teacher') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ===== Nếu đã login mà vào /login hoặc /register =====
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.redirect(new URL(`/${role}`, req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}