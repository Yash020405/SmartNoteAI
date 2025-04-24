# Smart Notes - AI-Powered Note Taking Application

A responsive web application for creating, editing, and managing notes with AI summarization capabilities. Built with Next.js, TypeScript, TailwindCSS, and Supabase.

## Live Demo

The application is currently deployed and available at [https://smart-note-ai.vercel.app/](https://smart-note-ai.vercel.app/)

## Demo Video

[Watch the demo video](https://www.loom.com/share/3509a50a1df34dab903e3203795bbb80?sid=0108c085-224c-4937-9475-0169ec06fb01) to see Smart Notes in action.

## Features

- **User Authentication**:

  - Sign up and login with email/password
  - Google OAuth authentication
  - Secure session management with Supabase Auth

- **Note Management**:

  - Create, edit, and delete notes
  - Real-time updates with Supabase
  - Responsive interface for all devices

- **AI Summarization**:

  - Automatically summarize notes using OpenRouter API
  - Preview summaries before saving
  - Edit AI-generated summaries

- **Responsive Design**:

  - Works on desktop, tablet, and mobile devices
  - Adaptive layout that adjusts to screen size

- **Dark Mode**:
  - A futuristic dark theme designed for reduced eye strain
  - Modern UI with elegant transitions

## Tech Stack

- **Frontend**:

  - Next.js 14 (App Router)
  - TypeScript for type safety
  - TailwindCSS for styling
  - Shadcn UI components
  - React Hook Form for form management

- **Backend**:

  - Supabase for authentication and database
  - Serverless functions for API endpoints
  - Row-level security for data protection

- **State Management**:

  - React Query for data fetching and caching
  - Optimistic updates for a responsive UX
  - Stale data revalidation

- **AI**:
  - OpenRouter API for intelligent note summarization
  - Integration with serverless functions

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenRouter API key

### Installation

1. Clone the repository

```bash
git clone git@github.com:Yash020405/SmartNoteAI.git
cd SmartNoteAI
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter API (for AI summarization)
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Set up Supabase

#### Authentication Configuration

- Enable Email/Password authentication in Supabase dashboard
- Set up Google OAuth provider:
  - Create OAuth credentials in Google Cloud Console
  - Add the following redirect URLs to your Google Cloud OAuth configuration:
    - http://localhost:3000/auth/callback (development)
    - https://smart-note-ai.vercel.app/auth/callback (production)
  - Add the client ID and secret to Supabase Auth settings

#### Database Schema

Create a `notes` table with the following schema:

```sql
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their notes
CREATE POLICY "Users can only see their own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own notes
CREATE POLICY "Users can insert their own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own notes
CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own notes
CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);
```

5. Run the development server

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Implementation Details

### Authentication Flow

The application uses Supabase Auth for secure authentication:

1. **Email/Password Authentication**:

   - User credentials are securely handled by Supabase Auth
   - Password resets are handled through email

2. **Google OAuth**:
   - The OAuth flow redirects users to Google's authentication page
   - After successful authentication, users are redirected back to the app
   - The auth callback route (`/auth/callback`) exchanges the code for a session

### Data Management

1. **React Query Integration**:

   - All API calls are wrapped with React Query for efficient caching
   - Background refetching provides fresh data without disrupting the user experience
   - Error states are elegantly handled with toast notifications

2. **Supabase Real-time**:
   - Changes to the database trigger real-time updates in the UI
   - User-specific data is protected with row-level security policies

### AI Summarization

The note summarization feature is implemented using the OpenRouter API:

1. When a user requests summarization, the content is sent to a serverless function
2. The function calls the OpenRouter API with appropriate prompting
3. The summary is returned to the client and displayed for review
4. Users can edit the summary before saving it to the database

### UI Components

The application uses a combination of custom components and Shadcn UI:

- **Form Components**: Built with React Hook Form for validation
- **UI Elements**: Enhanced with TailwindCSS for consistent styling
- **Layout**: Responsive design with mobile-first approach
- **Theme**: Dark mode implementation with system preference detection

## Deployment

The application is deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in the Vercel project settings
3. Deploy the main branch
4. Update OAuth redirect URLs in both Supabase dashboard and Google Cloud Console

## License

MIT
