# Google Authentication Setup Instructions

Follow these steps to set up Google Authentication with Supabase:

## 1. Configure Environment Variables

Replace the placeholders in your `.env.local` file with actual values:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# DeepSeek API for AI summarization
DEEPSEEK_API_KEY=your-deepseek-api-key
```

The Supabase URL should be in the format `https://your-project-id.supabase.co`.

## 2. Set Up Google OAuth Provider in Supabase

1. Go to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Navigate to "Authentication" > "Providers"
4. Find "Google" in the list and click on it
5. Toggle the "Enable Google OAuth" switch to ON

## 3. Create Google OAuth Credentials

1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Choose "Web application" as the application type
6. Add a name for your OAuth client
7. Add the following URLs to "Authorized JavaScript origins":
   - http://localhost:3000 (for development)
   - https://your-production-domain.com (for production)
8. Add the following URLs to "Authorized redirect URIs":
   - http://localhost:3000/auth/callback (for development)
   - https://your-production-domain.com/auth/callback (for production)
   - https://your-project-id.supabase.co/auth/v1/callback
9. Click "Create" to generate your client ID and client secret

## 4. Add Google OAuth Credentials to Supabase

1. Go back to your Supabase dashboard > "Authentication" > "Providers" > "Google"
2. Enter the Client ID and Client Secret from Google Cloud Console
3. Add the following redirect URLs:
   - http://localhost:3000/auth/callback
   - Your production domain URL with the /auth/callback path
4. Save the changes

## 5. Restart Your Application

After completing these steps, restart your Next.js development server:

```bash
npm run dev
```

Now Google authentication should work properly.

## Troubleshooting

If you encounter issues:

1. Check that all environment variables are set correctly
2. Ensure the redirect URLs match exactly in both Google Cloud Console and Supabase
3. Make sure you've enabled the Google OAuth provider in Supabase
4. Check browser console for any errors during the authentication flow 