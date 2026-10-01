import { NavBar } from "@/components/nav-bar";

// The first version of the app (single rubric, CSV upload). Kept working until
// the new course / exam / paper pages in (design) are wired to the API.
export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="flex-1">{children}</main>
    </>
  );
}
