"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function EditExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    fetch(`/api/admin/experiences?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("加载失败");
        return r.json();
      })
      .then((json) => {
        const found = json.data.find((e: { id: string }) => e.id === id);
        if (found) setData(found);
        else setError("体验不存在");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="skeleton h-8 w-48" />
        <div className="glass rounded-2xl p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-dark-400">{error ?? "体验不存在"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">编辑体验</h1>
        <p className="text-sm text-dark-400 mt-1">{data.title as string}</p>
      </div>
      <ExperienceForm
        token={token}
        mode="edit"
        defaultValues={data as Parameters<typeof ExperienceForm>[0]["defaultValues"]}
      />
    </div>
  );
}
