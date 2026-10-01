import type { Metadata } from "next";
import { MembersEditor } from "./members-editor";

export const metadata: Metadata = { title: "Members · Fair Grade" };

export default function MembersPage() {
  return <MembersEditor />;
}
