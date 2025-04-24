import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the URL that the user is being redirected to
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Create a Supabase client using the route handler helper with properly awaited cookies
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Always use the current request's origin for redirecting
  // This ensures local development stays on localhost and production stays on production
  const redirectOrigin = requestUrl.origin;
  
  // URL to redirect to after sign in completes
  return NextResponse.redirect(new URL('/dashboard', redirectOrigin));
}