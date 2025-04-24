import Link from "next/link";
import { BackgroundBlur } from "@/components/ui/background-blur";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <BackgroundBlur>
        <header className="px-8 py-5 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur-lg supports-[backdrop-filter]:bg-black/50 sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">
              SmartNote AI
            </span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
        <footer className="py-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SmartNote AI. All rights reserved.</p>
        </footer>
      </BackgroundBlur>
    </div>
  );
} 