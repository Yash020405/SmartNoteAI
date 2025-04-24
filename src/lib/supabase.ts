import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is a safe browser check that works with SSR
const isBrowser = () => typeof window !== 'undefined';

// This client is used on the client side
export const supabase = isBrowser()
  ? createClientComponentClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      }
    });

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary?: string;
  created_at: string;
  updated_at: string;
} 