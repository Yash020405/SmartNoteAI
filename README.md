# AI-Powered Notes App

A responsive web application for creating, editing, and managing notes with AI summarization capabilities. Built with Next.js, TypeScript, TailwindCSS, and Supabase.

## Features

- **User Authentication**: Sign up and login with email/password or Google authentication
- **Note Management**: Create, edit, and delete notes
- **AI Summarization**: Automatically summarize notes using DeepSeek API
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: A futuristic dark theme for a modern look and feel

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Supabase (Authentication, Database)
- **State Management**: React Query for data fetching and caching
- **AI**: DeepSeek API for note summarization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- DeepSeek API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-powered-notes.git
cd ai-powered-notes
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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

4. Set up Supabase

- Create a new project in Supabase
- Set up authentication (Email and Google OAuth)
- Create a `notes` table with the following schema:

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

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the environment variables to your Vercel project
4. Deploy

### Live Demo

The application is currently deployed and available at [https://smart-note-ai.vercel.app/](https://smart-note-ai.vercel.app/)

## License

MIT
