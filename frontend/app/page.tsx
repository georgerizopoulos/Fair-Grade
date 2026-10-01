<<<<<<< HEAD
=======
// Owner: Γιώργος — role-based entry point
// instructor → /upload | ta → /ta | logged out → /login
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser, HOME_BY_ROLE } from "@/lib/auth";

<<<<<<< HEAD
// instructor ? /upload | ta ? /ta | logged out ? /login
=======
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
<<<<<<< HEAD
      .then((u) => {
        router.replace(u ? HOME_BY_ROLE[u.role] : "/login");
      })
=======
      .then((user) => router.replace(user ? HOME_BY_ROLE[user.role] : "/login"))
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
      .catch(() => router.replace("/login"));
  }, [router]);

  return null;
}
