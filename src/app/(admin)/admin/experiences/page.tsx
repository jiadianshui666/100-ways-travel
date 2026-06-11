"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ExperienceTable } from "@/components/admin/ExperienceTable";
import { type ExperienceData } from "@/hooks/useExperiences";

export default function AdminExperiencesPage() {
  const { token } = useAuth();
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchExperiences = useCallback(
    async (page = 1) => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/experiences?page=${page}&limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setExperiences(json.data);
          setPagination({
            page: json.pagination.page,
            total: json.pagination.total,
            totalPages: json.pagination.totalPages,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => { fetchExperiences(1); }, [fetchExperiences]);

  const handleDelete = async (id: string) => {
    if (!token) throw new Error("未登录");
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("删除失败");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-10 w-full max-w-sm" />
        <div className="glass rounded-2xl p-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">体验管理</h1>
      <ExperienceTable
        experiences={experiences}
        total={pagination.total}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={fetchExperiences}
        onDelete={handleDelete}
        onRefresh={() => fetchExperiences(pagination.page)}
        token={token}
      />
    </div>
  );
}
