import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from './client';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/my-farm',
  '/settings',
  '/profile',
  '/onboarding',
];

const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

/**
 * Validates that a redirect path is safe and internal to prevent Open Redirect attacks.
 */
export function sanitizeRedirectPath(path: string | null | undefined, fallback: string = '/dashboard'): string {
  if (!path) return fallback;
  // Ensure starts with a single slash and doesn't contain protocol or double slashes
  if (path.startsWith('/') && !path.startsWith('//') && !path.includes('://')) {
    return path;
  }
  return fallback;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey !== 'your-anon-public-key'
  );

  // If Supabase credentials are not configured, allow pages to load and let client UI display configuration notice
  if (!isConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Unauthenticated users visiting protected routes
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    const returnUrl = pathname + request.nextUrl.search;
    loginUrl.searchParams.set('next', returnUrl);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users visiting auth routes (login, register, forgot-password)
  // except reset-password which might be resetting an active session
  if (isAuthRoute && pathname !== '/reset-password' && user) {
    const nextParam = request.nextUrl.searchParams.get('next');
    const destination = sanitizeRedirectPath(nextParam, '/dashboard');
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return supabaseResponse;
}
