"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/ui/Toaster";
import { Pagination } from "@/components/ui/Pagination";
import { type ExperienceData } from "@/hooks/useExperiences";

interface ExperienceTableProps {
  experiences: ExperienceData[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
  token: string | null;
}

type SortKey = "title" | "price" | "createdAt" | "location";
type SortDir = "asc" | "desc";

export function ExperienceTable({
  experiences,
  total,
  page,
  totalPages,
  onPageChange,
  onDelete,
  onRefresh,
}: ExperienceTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteTarget, setDeleteTarget] = useState<ExperienceData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    let list = experiences;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      let va: string | number = "";
      let vb: string | number = "";
      if (sortKey === "price") {
        va = a.price;
        vb = b.price;
      } else if (sortKey === "createdAt") {
        va = a.createdAt;
        vb = b.createdAt;
      } else if (sortKey === "title") {
        va = a.title;
        vb = b.title;
      } else {
        va = a.location;
        vb = b.location;
      }
      if (sortDir === "asc") return va > vb ? 1 : -1;
      return va < vb ? 1 : -1;
    });
  }, [experiences, search, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await onDelete(deleteTarget.id);
      toast("success", `「${deleteTarget.title}」已删除`);
      onRefresh();
    } catch {
      toast("error", "删除失败");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (col !== sortKey) return <span className="text-dark-600 ml-1">↕</span>;
    return <span className="text-neon-cyan ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索标题、地点..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-dark-500 focus:border-neon-cyan/50 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-dark-500">共 {total} 个体验</span>
          <Link
            href="/admin/experiences/new"
            className="px-4 py-2.5 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple text-sm font-medium hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all"
          >
            ➕ 新建体验
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  { key: "title" as const, label: "标题", className: "text-left" },
                  { key: "price" as const, label: "价格" },
                  { key: "location" as const, label: "地点" },
                  { key: "createdAt" as const, label: "创建时间" },
                ].map((h) => (
                  <th
                    key={h.key}
                    className={cn(
                      "px-4 py-3.5 font-medium text-dark-400 text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors",
                      h.className
                    )}
                    onClick={() => handleSort(h.key)}
                  >
                    {h.label} <SortIcon col={h.key} />
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right text-xs uppercase tracking-wider text-dark-400 font-medium">
                  状态
                </th>
                <th className="px-4 py-3.5 text-right text-xs uppercase tracking-wider text-dark-400 font-medium">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-sm flex-shrink-0">
                        {exp.category?.icon ?? "✈️"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate max-w-[200px]">
                          {exp.title}
                        </p>
                        <p className="text-xs text-dark-500">{exp.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-display text-neon-green">
                    {formatPrice(exp.price)}
                  </td>
                  <td className="px-4 py-3.5 text-dark-300">{exp.location}</td>
                  <td className="px-4 py-3.5 text-dark-400 text-xs">
                    {new Date(exp.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex gap-1 justify-end">
                      {exp.published ? (
                        <Badge variant="green" size="sm">已发布</Badge>
                      ) : (
                        <Badge variant="default" size="sm">草稿</Badge>
                      )}
                      {exp.featured && <Badge variant="cyan" size="sm">精选</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex gap-1 justify-end">
                      <Link
                        href={`/admin/experiences/${exp.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(exp)}
                        className="px-3 py-1.5 rounded-lg text-xs text-dark-400 hover:text-neon-pink hover:bg-neon-pink/5 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-dark-500 text-sm">
            没有找到匹配的体验
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="确认删除"
        message={`确定要删除「${deleteTarget?.title}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
