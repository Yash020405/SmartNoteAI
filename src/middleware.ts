import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url);
  
  // Skip the middleware for the callback route
  if (requestUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }

  // Create a response to modify
  const res = NextResponse.next();
  
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req: request, res });

    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession();

    // Check if the user is authenticated
    const isAuthenticated = !!session;
    
    // Define protected routes (routes that require authentication)
    const isProtectedRoute = requestUrl.pathname.startsWith('/dashboard');
    
    // Define authentication routes
    const isAuthRoute = requestUrl.pathname.startsWith('/auth') || 
                        requestUrl.pathname === '/login' || 
                        requestUrl.pathname === '/signup';

    // If the user is on the home page and authenticated, redirect to dashboard
    if (requestUrl.pathname === '/' && isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }

    // If the user is on a protected route and not authenticated, redirect to the login page
    if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL('/auth', requestUrl.origin));
    }

    // If the user is on an auth route and authenticated, redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }

  // For all other cases, continue with the request
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*', '/login', '/signup'],
};