import type { Metadata } from "next";
import { UsersLivePage } from "./users-page";

export const metadata: Metadata = { title: "Users · Fair Grade" };

export default function UsersPage() {
  return <UsersLivePage />;
}
