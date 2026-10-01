"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser, HOME_BY_ROLE } from "@/lib/auth";

// instructor ? /upload | ta ? /ta | logged out ? /login
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        router.replace(u ? HOME_BY_ROLE[u.role] : "/login");
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  return null;
}
