"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut, Mail, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setEmail(session.user.email || "");
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    getProfile();
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

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error("No user found to delete");
      return;
    }
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        await supabase
          .from('notes')
          .delete()
          .eq('user_id', user.id);
        // Placeholder: in production, use a secure server endpoint
        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
        if (authError) {
          await supabase.auth.signOut();
        }
        toast.success("Account deleted successfully");
        router.push("/");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete account");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getUserName = () => {
    if (!user) return "User";
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    const emailName = user.email?.split("@")[0];
    return emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : "User";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border border-border/50">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-2xl font-bold">
              {getUserName().charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{getUserName()}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Mail className="h-5 w-5" />
              <span className="text-sm">{email}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-6 w-6" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Once you delete your account, all of your notes and data will be permanently removed. This action cannot be undone.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? "Processing..." : <><Trash2 className="h-5 w-5" /> Delete Account</>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}