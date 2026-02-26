import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // ===== Not logged in =====
  if (!user || error) {
    if (
      pathname.startsWith('/student') ||
      pathname.startsWith('/teacher') ||
      pathname.startsWith('/admin')
    ) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  const role = user.app_metadata?.role

  if (!role) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ===== Protected routes =====
  if (
    pathname.startsWith('/student') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/admin')
  ) {
    const prefix = pathname.split('/')[1]

    if (role !== prefix) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // ===== Prevent accessing auth pages when logged in =====
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