"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Ensure client-side hydration is complete before rendering the session provider
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent hydration errors by only rendering on client
  if (!mounted) return null;

  // Use the basic configuration to avoid errors
  return (
    <SessionProvider 
      refetchWhenOffline={false}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
} 