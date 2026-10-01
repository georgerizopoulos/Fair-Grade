import type { Metadata } from "next";
import { TaDetailLivePage } from "./ta-detail-page";

export const metadata: Metadata = { title: "TA report · Fair Grade" };

export default function TaDetailPage() {
  return <TaDetailLivePage />;
}
