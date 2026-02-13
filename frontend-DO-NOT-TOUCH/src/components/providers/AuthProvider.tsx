"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

interface Session {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  session: Session;
  isLoading: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth_session";

/**
 * AuthProvider wraps the app with authentication context.
 * Per FR-011, User Story 2 acceptance scenario 3.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session>({ user: null, token: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessionState(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const setSession = (newSession: Session) => {
    setSessionState(newSession);
    if (newSession.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    }
  };

  const clearSession = () => {
    setSessionState({ user: null, token: null });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
