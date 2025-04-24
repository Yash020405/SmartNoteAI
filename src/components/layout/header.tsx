"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { LogOut, User, Sparkles, FilePlus, Home } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };

    getUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Error logging out");
    }
  };
  
  // Extract user's name from email or user metadata
  const getUserName = () => {
    if (!user) return 'User';
    
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    const emailName = user.email?.split('@')[0];
    return emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : 'User';
  };

  return (
    <header className="h-14 border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2 font-medium">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
              SmartNote AI
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 px-2 hover:bg-muted/60 rounded-full h-9"
                >
                  <Avatar className="h-7 w-7 border border-border/50">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-medium">
                      {getUserName().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm hidden sm:inline-block">
                    {getUserName()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
} 