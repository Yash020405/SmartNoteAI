import type { Metadata } from "next";
import CombinedAuth from "@/components/auth/combined-auth";
import { BackgroundBlur } from "@/components/ui/background-blur";

export const metadata: Metadata = {
  title: "SmartNote AI | Authentication",
  description: "Sign in or create a new account for SmartNote AI",
};

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 sm:p-6 md:p-8">
      <BackgroundBlur className="fixed inset-0">
        {/* This empty fragment satisfies the children requirement */}
        <></>
      </BackgroundBlur>
      
      <div className="animate-fade-in max-w-md w-full">
        <div className="text-center mb-5">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2">
            SmartNote AI
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-sm mx-auto">
            The intelligent note-taking app that works for you
          </p>
        </div>
        
        <CombinedAuth />
        
        <p className="text-center mt-4 text-gray-500 text-xs px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}