"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser, homeFor } from "@/lib/auth";

// Signed in → the role's home (instructor: courses, TA: their open exam). Otherwise → /login.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(async (u) => router.replace(u ? await homeFor(u) : "/login"))
      .catch(() => router.replace("/login"));
  }, [router]);

  return null;
}
