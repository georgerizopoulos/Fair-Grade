"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout, type Role, type User } from "@/lib/auth";
import { cn } from "@/lib/utils";

const LINKS: Record<Role, { href: string; label: string }[]> = {
  instructor: [
    { href: "/upload", label: "Upload" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  ta: [{ href: "/ta", label: "Grade" }],
};

// Shared top bar. Hidden on /login and while logged out.
export function TopBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  // Re-check on every navigation so the bar updates right after login.
  useEffect(() => {
    if (pathname === "/login") return;
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, [pathname]);

  if (pathname === "/login" || !user) return null;

  return (
    <header className="border-b">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <span className="font-semibold">Fair Grade</span>
        {LINKS[user.role].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm text-muted-foreground hover:text-foreground",
              pathname.startsWith(link.href) && "font-medium text-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.name}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </nav>
    </header>
  );
}
