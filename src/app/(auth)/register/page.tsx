import { Metadata } from "next";
import AuthForm from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign Up | Mini AI Note",
  description: "Create a new account and start your AI note-taking journey",
};

export default function RegisterPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <AuthForm isRegister={true} />
    </div>
  );
} 