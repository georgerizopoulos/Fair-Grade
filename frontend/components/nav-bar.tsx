"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import { cn } from "@/lib/utils";

const INSTRUCTOR_LINKS = [
  { href: "/upload", label: "Upload" },
  { href: "/dashboard", label: "Dashboard" },
];

const TA_LINKS = [{ href: "/ta", label: "Grade" }];

export function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, [pathname]);

  // Don't show nav on login page or when not logged in
  if (!user || pathname === "/login") return null;

  const links = user.role === "instructor" ? INSTRUCTOR_LINKS : TA_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-5xl items-center gap-6 px-4">
        <span className="text-sm font-semibold tracking-tight">Fair-Grade</span>

        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                pathname.startsWith(l.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{user.name}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
