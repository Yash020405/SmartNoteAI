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

  // Determine the appropriate origin - support both localhost and deployed URL
  // Handles the case when we're in a development environment (localhost)
  // or in the production environment (smart-note-ai.vercel.app)
  const redirectOrigin = requestUrl.origin.includes('localhost') 
    ? requestUrl.origin 
    : 'https://smart-note-ai.vercel.app';

  // URL to redirect to after sign in completes
  return NextResponse.redirect(new URL('/dashboard', redirectOrigin));
}