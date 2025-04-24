"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilePenLine, Plus, Sparkles, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => setIsCollapsed((v) => !v);

  const NavItem = ({
    href,
    icon,
    label,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className="w-full">
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-2 text-lg",
            isCollapsed ? "px-3" : "px-3",
            isActive
              ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
              : ""
          )}
          size="icon"
        >
          {/* Always large icons */}
          <span className="flex items-center justify-center">{icon}</span>
          {!isCollapsed && <span className="ml-3 font-semibold">{label}</span>}
        </Button>
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "h-screen border-r transition-all duration-300 ease-in-out flex flex-col bg-background",
        isCollapsed ? "w-[60px] md:w-[70px]" : "w-[200px]"
      )}
    >
      {/* Top: Logo/Brand as Dashboard Link */}
      <div className="h-[60px] flex items-center pl-3 pr-2 border-b sticky top-0 bg-background/95 backdrop-blur-sm">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Sparkles className="h-7 w-7 text-indigo-500 transition-transform group-hover:scale-110" />
          {!isCollapsed && (
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
              SmartNote AI
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className={cn("p-2 pt-4 flex-1 overflow-auto", isCollapsed ? "px-1.5" : "px-2")}>
        <nav className="flex flex-col">
          <NavItem
            href="/dashboard"
            icon={<FilePenLine className="h-7 w-7" />}
            label="All Notes"
          />
          <NavItem
            href="/dashboard/notes/new"
            icon={<Plus className="h-7 w-7" />}
            label="New Note"
          />
          <NavItem
            href="/dashboard/settings"
            icon={<User className="h-7 w-7" />}
            label="Account"
          />
        </nav>
      </div>

      {/* Collapse Icon at Bottom */}
      <div className="flex items-center justify-center py-4 border-t">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="h-7 w-7" /> : <X className="h-7 w-7" />}
        </Button>
      </div>
    </aside>
  );
}