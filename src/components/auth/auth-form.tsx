"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { LockIcon, MailIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthError } from "@supabase/supabase-js";

interface AuthFormProps {
  isRegister?: boolean;
}

export default function AuthForm({ isRegister = false }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (isRegister) {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (result.error) {
        throw result.error;
      }

      if (isRegister) {
        toast.success("Account created! Check your email to confirm your account.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof AuthError ? error.message : "Authentication failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }
      
      // Supabase handles redirection automatically
    } catch (error: unknown) {
      const errorMessage = error instanceof AuthError ? error.message : "Google authentication failed";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-black/50 backdrop-blur-xl border border-white/10 shadow-xl animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600">
          {isRegister ? "Create Account" : "Welcome Back"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {isRegister 
            ? "Sign up to start organizing your notes with AI" 
            : "Sign in to continue to your notes"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <MailIcon className="h-5 w-5" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus-visible:ring-purple-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <LockIcon className="h-5 w-5" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus-visible:ring-purple-500"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRegister ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              isRegister ? "Sign Up" : "Sign In"
            )}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-black px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleGoogleAuth} 
          disabled={isLoading} 
          className="w-full border-white/10 text-white hover:bg-white/10 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
          </svg>
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        {isRegister ? (
          <Link href="/login" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Already have an account? Sign In
          </Link>
        ) : (
          <Link href="/register" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Don&apos;t have an account? Sign Up
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}