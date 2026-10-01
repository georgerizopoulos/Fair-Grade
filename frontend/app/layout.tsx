// Owner: Γιώργος — shared app shell (role-based top bar goes here)
import type { Metadata } from "next";
import { TopBar } from "@/components/top-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fair-Grade",
  description: "TA grading consistency dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <TopBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
