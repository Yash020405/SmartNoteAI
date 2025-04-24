import { Metadata } from "next";
import AuthForm from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login | Mini AI Note",
  description: "Login to your account and continue organizing your notes",
};

export default function LoginPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <AuthForm isRegister={false} />
    </div>
  );
} 