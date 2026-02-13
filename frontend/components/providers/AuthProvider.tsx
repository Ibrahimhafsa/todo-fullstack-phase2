"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { signOut as signOutAuth, getSession } from "@/lib/auth-client";

interface AuthContextType {
  session: any;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthProvider] useEffect: Starting session load on mount");

    const loadSession = async () => {
      console.log("[AuthProvider.loadSession] Starting...");

      try {
        // Check if token exists
        const token = localStorage.getItem("auth_token");
        console.log("[AuthProvider.loadSession] Token exists:", !!token);

        if (!token) {
          console.log("[AuthProvider.loadSession] No token, setting session null");
          setSession(null);
          setIsLoading(false);
          return;
        }

        // Fetch session data from backend
        console.log("[AuthProvider.loadSession] Calling getSession()");
        const userResponse = await getSession();

        if (!userResponse) {
          console.log("[AuthProvider.loadSession] getSession returned null");
          setSession(null);
          setIsLoading(false);
          return;
        }

        // SUCCESS: Wrap response and set session
        console.log("[AuthProvider.loadSession] ✅ Got user response:", userResponse.email);
        const wrappedSession = {
          user: userResponse,
        };

        console.log("[AuthProvider.loadSession] Setting session with user.id:", userResponse.id);
        setSession(wrappedSession);

        // Immediately verify it was set
        console.log("[AuthProvider.loadSession] ✅ Session state set");

      } catch (error) {
        console.error("[AuthProvider.loadSession] ❌ Error:", error);
        setSession(null);
      } finally {
        console.log("[AuthProvider.loadSession] Setting isLoading to false");
        setIsLoading(false);
      }
    };

    // Start loading on mount
    loadSession();

    // Reload when token changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token") {
        console.log("[AuthProvider] Storage change detected for auth_token");
        if (e.newValue) {
          console.log("[AuthProvider] Token was added, reloading session");
          loadSession();
        } else {
          console.log("[AuthProvider] Token was removed, clearing session");
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    // Reload when custom signin event fires (same-window signin)
    const handleAuthTokenChanged = () => {
      console.log("[AuthProvider] Custom auth_token_changed event received");
      loadSession();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth_token_changed", handleAuthTokenChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth_token_changed", handleAuthTokenChanged);
    };
  }, []);

  const signOutHandler = () => {
    console.log("[AuthProvider] Sign out called");
    signOutAuth();
    setSession(null);
    setIsLoading(false);
  };

  const contextValue: AuthContextType = {
    session,
    isLoading,
    signOut: signOutHandler,
  };

  console.log("[AuthProvider] Rendering with state:", {
    hasSession: !!session,
    userId: session?.user?.id,
    isLoading,
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
