"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/ui/Toaster";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "请输入名称").max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, "仅小写字母、数字、连字符"),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
});

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  experienceCount: number;
}

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCategories(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [token]);

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setForm({ name: "", slug: "", description: "", icon: "" });
    setFormErrors({});
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setShowForm(true);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", icon: cat.icon ?? "" });
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    const parsed = categorySchema.safeParse(form);
    if (!parsed.success) {
      setFormErrors(parsed.error.flatten().fieldErrors as Record<string, string>);
      return;
    }
    if (!token) return;
    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/categories/${editing.id}`
        : "/api/admin/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "保存失败");
      }
      toast("success", editing ? "分类已更新" : "分类已创建");
      resetForm();
      fetchCategories();
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "删除失败");
      }
      toast("success", `「${deleteTarget.name}」已删除`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "删除失败");
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-dark-500 focus:border-neon-purple/50 focus:outline-none transition-colors";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">分类管理</h1>
          <p className="text-sm text-dark-400 mt-1">{categories.length} 个分类</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-5 py-2.5 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple text-sm font-medium hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all"
        >
          {showForm ? "取消" : "➕ 新建分类"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass p-6 rounded-2xl border border-neon-purple/10 space-y-4 animate-slide-down">
          <h3 className="font-display font-semibold text-white">
            {editing ? `编辑「${editing.name}」` : "新建分类"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-dark-400 mb-1">名称 *</label>
              <input
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  if (!editing) setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") }));
                }}
                className={cn(inputClass, formErrors.name && "border-neon-pink/50")}
              />
              {formErrors.name && <p className="text-xs text-neon-pink mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={cn(inputClass, formErrors.slug && "border-neon-pink/50")} />
              {formErrors.slug && <p className="text-xs text-neon-pink mt-1">{formErrors.slug}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-dark-400 mb-1">图标</label>
              <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} className={inputClass} placeholder="🏙️" />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">描述</label>
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple text-sm font-medium hover:bg-neon-purple/25 transition-all disabled:opacity-50"
            >
              {saving ? "保存中..." : editing ? "更新" : "创建"}
            </button>
            <button onClick={resetForm} className="px-4 py-2.5 text-sm text-dark-400 hover:text-white transition-colors">
              取消
            </button>
          </div>
        </div>
      )}

      {/* Category list */}
      {loading ? (
        <div className="glass rounded-2xl p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-14 w-full" />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-white/5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-xl flex-shrink-0">{cat.icon ?? "📂"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{cat.name}</p>
                <p className="text-xs text-dark-500">{cat.slug} · {cat.description}</p>
              </div>
              <Badge>{cat.experienceCount} 体验</Badge>
              <button
                onClick={() => startEdit(cat)}
                className="px-3 py-1.5 rounded-lg text-xs text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                编辑
              </button>
              <button
                onClick={() => setDeleteTarget(cat)}
                className="px-3 py-1.5 rounded-lg text-xs text-dark-400 hover:text-neon-pink hover:bg-neon-pink/5 transition-colors"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="确认删除分类"
        message={`确定要删除「${deleteTarget?.name}」吗？${deleteTarget && deleteTarget.experienceCount > 0 ? `该分类下有 ${deleteTarget.experienceCount} 个体验，` : ""}此操作不可撤销。`}
        confirmLabel="删除"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

// Inline Badge for category count
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white/5 text-dark-400 border border-white/5">
      {children}
    </span>
  );
}
