import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "关于我们 — 百途旅行",
  description: "百途旅行致力于发掘100种独特的旅行方式，让每一次出发都成为难忘的故事",
};

export default function Page() {
  return <AboutPage />;
}
