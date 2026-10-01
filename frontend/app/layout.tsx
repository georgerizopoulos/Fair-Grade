import type { Metadata } from "next";
<<<<<<< HEAD
import { NavBar } from "@/components/nav-bar";
=======
import { TopBar } from "@/components/top-bar";
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
import "./globals.css";

export const metadata: Metadata = {
  title: "Fair-Grade",
  description: "TA grading consistency dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
<<<<<<< HEAD
        <NavBar />
=======
        <TopBar />
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
