const API = process.env.NEXT_PUBLIC_API_URL!;

export const signUp = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Sign up failed`);
    }

    if (!data.token) {
      throw new Error("No token in response");
    }

    localStorage.setItem("auth_token", data.token);
    return data;
  } catch (error) {
    console.error("[signUp error]", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log("[signIn] 1️⃣  Starting signin for:", email);
    console.log("[signIn] 1️⃣  API URL:", `${API}/api/auth/signin`);

    const res = await fetch(`${API}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("[signIn] 2️⃣  HTTP Status:", res.status, res.statusText);

    const data = await res.json();
    console.log("[signIn] 3️⃣  Response body (full):", JSON.stringify(data, null, 2));
    console.log("[signIn] 3️⃣  Has token field?", "token" in data);
    console.log("[signIn] 3️⃣  Token value:", data.token || "UNDEFINED/NULL");

    if (!res.ok) {
      throw new Error(data.detail || `HTTP ${res.status}: Sign in failed`);
    }

    if (!data.token) {
      console.error("[signIn] ❌ NO TOKEN IN RESPONSE - data:", data);
      throw new Error("No token in response");
    }

    // CRITICAL: Save token IMMEDIATELY (synchronous operation)
    console.log("[signIn] 4️⃣  Saving token to localStorage...");
    console.log("[signIn] 4️⃣  Token to save:", data.token.substring(0, 30) + "...");

    localStorage.setItem("auth_token", data.token);
    console.log("[signIn] 4️⃣  localStorage.setItem() called");

    // VERIFY save worked
    const saved = localStorage.getItem("auth_token");
    console.log("[signIn] 5️⃣  Verify read back from localStorage:", saved ? "✅ SUCCESS" : "❌ FAILED");

    if (!saved) {
      console.error("[signIn] ❌ localStorage.setItem() did NOT persist!");
      throw new Error("localStorage.setItem() failed to persist token");
    }

    if (saved !== data.token) {
      console.error("[signIn] ❌ Saved token differs from original!");
      throw new Error("Token mismatch in localStorage");
    }

    console.log("[signIn] ✅ SUCCESS - Token saved and verified in localStorage");

    // Dispatch custom event so AuthProvider knows token changed (same-window storage change)
    window.dispatchEvent(new CustomEvent("auth_token_changed", { detail: { token: data.token } }));
    console.log("[signIn] 🔔 Dispatched auth_token_changed event");

    return data;
  } catch (error) {
    console.error("[signIn] ❌ ERROR:", error);
    console.log("[signIn] Clearing any partial data...");
    localStorage.removeItem("auth_token");
    throw error;
  }
};

export const signOut = () => {
  localStorage.removeItem("auth_token");
};

export const getSession = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    console.log("[getSession] Token from localStorage:", token ? `✓ exists (${token.substring(0, 20)}...)` : "✗ missing");

    if (!token) {
      console.log("[getSession] No token, returning null session");
      return null;
    }

    // CRITICAL: Always use http://localhost:8000, never port 3000
    const meUrl = `${API}/api/auth/me`;
    console.log("[getSession] Calling:", meUrl);
    console.log("[getSession] Authorization header:", `Bearer ${token.substring(0, 20)}...`);

    // Match the exact fetch format that works in console (no Content-Type, no explicit method)
    const res = await fetch(meUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[getSession] Response status:", res.status);

    if (!res.ok) {
      console.error("[getSession] Failed with status", res.status);
      console.error("[getSession] Status text:", res.statusText);
      if (res.status === 401) {
        console.log("[getSession] Token expired (401), removing from storage");
        localStorage.removeItem("auth_token");
      }
      return null;
    }

    const data = await res.json();
    console.log("[getSession] ✓ User authenticated:", data.email);
    return data;
  } catch (error) {
    console.error("[getSession] ✗ Fetch failed with error:");
    console.error("[getSession] Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("[getSession] Error message:", error instanceof Error ? error.message : String(error));
    console.error("[getSession] Full error object:", error);
    return null;
  }
};
