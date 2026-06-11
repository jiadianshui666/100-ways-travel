import type { Metadata } from "next";
import { SearchPage } from "@/components/search/SearchPage";

export const metadata: Metadata = {
  title: "搜索旅行体验 — 百途旅行",
  description: "搜索 100 种旅行方式，发现你心仪的旅行体验",
};

export default function Page() {
  return <SearchPage />;
}
