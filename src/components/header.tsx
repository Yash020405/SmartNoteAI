import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@/components/ui/user-button";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";

const Header = () => {
  const { register } = useForm();
  const pathname = usePathname();
  const user = true; // Replace with actual user authentication logic

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
            Smart Notes
          </span>
        </div>
        
        <div className="hidden md:flex">
          {user && pathname === "/dashboard" ? (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="h-8 w-[180px] md:w-[200px] bg-muted/20 border-muted/30 focus-visible:ring-0 focus-visible:border-muted-foreground"
                {...register("search")}
              />
            </div>
          ) : (
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className={cn(
                  "hover:text-foreground transition-colors",
                  pathname === "/"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className={cn(
                  "hover:text-foreground transition-colors",
                  pathname === "/pricing"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className={cn(
                  "hover:text-foreground transition-colors",
                  pathname === "/blog"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                Blog
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          
          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Button asChild size="sm" variant="default">
              <Link href="/sign-in">
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile search - only visible on dashboard */}
      {user && pathname === "/dashboard" && (
        <div className="pt-2 pb-3 px-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="w-full pl-9 h-9 bg-muted/20 border-muted/30 focus-visible:ring-0 focus-visible:border-muted-foreground"
              {...register("search")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;