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

// Where each role lands when nothing more specific is known.
export const HOME_BY_ROLE: Record<Role, string> = {
  instructor: "/courses",
  ta: "/courses",
};

interface CourseSummary {
  id: string;
}

// Where to go after signing in: instructors to their courses, TAs to the course
// they grade in (where they see each exam of the session and their papers). If a
// TA is in exactly one course, go straight into it.
export async function homeFor(user: User): Promise<string> {
  if (user.role === "instructor") return HOME_BY_ROLE.instructor;
  try {
    const { courses } = await apiFetch<{ courses: CourseSummary[] }>("/courses");
    if (courses.length === 1) return `/courses/${courses[0].id}`;
  } catch {
    // fall through to the course list
  }
  return HOME_BY_ROLE.ta;
}

// POST /auth/login. Saves the token and returns the user.
// Throws ApiError("Invalid email or password") on bad credentials.
export async function login(email: string, password: string): Promise<User> {
  const { token, user } = await apiFetch<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  localStorage.setItem(TOKEN_KEY, token);
  sessionPromise = Promise.resolve(user);
  return user;
}

// POST /auth/register. Sign-up is for instructors only; a TA gets their account
// from the course instructor, and the backend answers 403 to role "ta".
export async function registerInstructor(name: string, email: string, password: string): Promise<void> {
  await apiFetch("/auth/register", {
    method: "POST",
    body: { name, email, password, role: "instructor" },
  });
}

// No logout endpoint: dropping the token is enough.
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  sessionPromise = null;
  // Hard redirect on purpose: also resets in-memory state, and this is not a component.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/login";
}

// The signed-in user, fetched once and shared by every page until logout.
let sessionPromise: Promise<User | null> | null = null;

function loadSession() {
  sessionPromise ??= getCurrentUser().catch(() => null);
  return sessionPromise;
}

// For the app shell: the signed-in user, or a redirect to /login.
//   const user = useSession(); // null while loading
export function useSession(): User | null {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSession().then((u) => {
      if (cancelled) return;
      if (u) setUser(u);
      else {
        sessionPromise = null;
        router.replace("/login");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return user;
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
