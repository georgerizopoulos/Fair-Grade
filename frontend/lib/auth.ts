"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, TOKEN_KEY } from "./api";

export type Role = "instructor" | "ta";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Where each role lands after logging in (and when visiting "/").
export const HOME_BY_ROLE: Record<Role, string> = {
  instructor: "/upload",
  ta: "/ta",
};

// POST /auth/login. Saves the token and returns the user.
// Throws ApiError("Invalid email or password") on bad credentials.
export async function login(email: string, password: string): Promise<User> {
  const { token, user } = await apiFetch<{ token: string; user: User }>(
    "/auth/login",
    { method: "POST", body: { email, password } },
  );
  localStorage.setItem(TOKEN_KEY, token);
  return user;
}

// No logout endpoint: dropping the token is enough.
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login";
}

// GET /auth/me. null when there's no token at all; an invalid/expired token
// makes apiFetch redirect to /login.
export async function getCurrentUser(): Promise<User | null> {
  if (!localStorage.getItem(TOKEN_KEY)) return null;
  return apiFetch<User>("/auth/me");
}

// Protects a page:
//   const { user, loading } = useRequireRole("instructor");
//   if (loading || !user) return null;
// Not logged in → /login. Logged in with the other role → that role's home page.
export function useRequireRole(role: Role) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then((u) => {
        if (cancelled) return;
        if (!u) {
          router.replace("/login");
        } else if (u.role !== role) {
          router.replace(HOME_BY_ROLE[u.role]);
        } else {
          setUser(u);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/login");
      });
    return () => {
      cancelled = true;
    };
  }, [role, router]);

  return { user, loading };
}
