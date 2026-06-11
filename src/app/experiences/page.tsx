import type { Metadata } from "next";
import { ExperiencesPage } from "@/components/home/ExperiencesPage";

export const metadata: Metadata = {
  title: "探索旅行体验 — 百途旅行",
  description: "浏览全部旅行体验，按分类、排序筛选你感兴趣的旅行方式",
};

export default function Page() {
  return <ExperiencesPage />;
}
