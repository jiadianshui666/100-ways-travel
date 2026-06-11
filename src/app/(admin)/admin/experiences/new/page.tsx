"use client";

import { useAuth } from "@/hooks/useAuth";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  const { token } = useAuth();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">创建新体验</h1>
        <p className="text-sm text-dark-400 mt-1">填写以下信息添加新的旅行体验</p>
      </div>
      <ExperienceForm token={token} mode="create" />
    </div>
  );
}
