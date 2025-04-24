import { BackgroundBlur } from "@/components/ui/background-blur";
import AuthForm from "@/components/auth/auth-form";
import { redirect } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

export default async function SignupPage() {
  // Check if user is already logged in
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data } = await supabase.auth.getSession();
  
  if (data?.session) {
    redirect('/dashboard');
  }

  return (
    <div className="w-full p-4">
      <BackgroundBlur>
        <div className="w-full max-w-md p-8">
          <AuthForm />
        </div>
      </BackgroundBlur>
    </div>
  );
} 