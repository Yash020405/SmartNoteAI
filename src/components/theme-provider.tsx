"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Import the proper types directly from next-themes
type ThemeProviderProps = {
  children: React.ReactNode;
} & Parameters<typeof NextThemesProvider>[0];

export function ThemeProvider({ 
  children, 
  ...props 
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}