<<<<<<< HEAD
"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser, HOME_BY_ROLE, login } from "@/lib/auth";
=======
// Owner: Γιώργος — login form
// Calls POST /auth/login (#3), then redirects: instructor → /upload, ta → /ta
"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HOME_BY_ROLE, login } from "@/lib/auth";
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect to the right home page
  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        if (u) router.replace(HOME_BY_ROLE[u.role]);
        else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      router.push(HOME_BY_ROLE[user.role]);
=======
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      router.replace(HOME_BY_ROLE[user.role]);
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

<<<<<<< HEAD
  if (loading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">Fair-Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
=======
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Fair Grade</CardTitle>
          <CardDescription>Log in with your course account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
<<<<<<< HEAD
                placeholder="instructor@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
=======
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
<<<<<<< HEAD
                placeholder="demo1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in?" : "Sign in"}
=======
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Logging in…" : "Log in"}
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
