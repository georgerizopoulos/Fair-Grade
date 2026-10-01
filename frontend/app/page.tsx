// Owner: Γιώργος — role-based entry point
// instructor → /upload | ta → /ta | logged out → /login
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser, HOME_BY_ROLE } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then((user) => router.replace(user ? HOME_BY_ROLE[user.role] : "/login"))
      .catch(() => router.replace("/login"));
  }, [router]);

  return null;
}
