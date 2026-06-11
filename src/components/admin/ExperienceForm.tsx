"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

const schema = z.object({
  title: z.string().min(1, "请输入标题").max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "仅小写字母、数字、连字符"),
  description: z.string().min(1, "请输入描述"),
  location: z.string().min(1, "请输入地点"),
  price: z.preprocess((v) => Number(v ?? 0), z.number().min(0, "价格不能为负")),
  duration: z.string().min(1, "请输入时长"),
  images: z.array(z.object({ url: z.string().min(1, "请输入图片 URL") })),
  featured: z.boolean(),
  published: z.boolean(),
  categoryId: z.string().min(1, "请选择分类"),
});

type FormValues = z.infer<typeof schema>;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ExperienceFormProps {
  token: string | null;
  defaultValues?: Partial<{
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    price: number;
    duration: string;
    images: string;
    featured: boolean;
    published: boolean;
    categoryId: string;
  }>;
  mode: "create" | "edit";
}

export function ExperienceForm({ token, defaultValues, mode }: ExperienceFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: defaultValues?.title ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      location: defaultValues?.location ?? "",
      price: defaultValues?.price ?? 0,
      duration: defaultValues?.duration ?? "",
      images: (() => {
        try {
          const parsed = JSON.parse(defaultValues?.images ?? "[]");
          return Array.isArray(parsed) ? parsed.map((url: string) => ({ url })) : [{ url: "" }];
        } catch {
          return [{ url: "" }];
        }
      })(),
      featured: defaultValues?.featured ?? false,
      published: defaultValues?.published ?? false,
      categoryId: defaultValues?.categoryId ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "images" });

  // Auto slug from title
  const title = form.watch("title");
  const slug = form.watch("slug");
  useEffect(() => {
    if (mode === "create" && title && !slug) {
      const generated = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w一-鿿-]+/g, "")
        .replace(/--+/g, "-");
      form.setValue("slug", generated);
    }
  }, [title, slug, mode, form]);

  // Load categories
  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, [token]);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!token) return;
      setSubmitting(true);
      try {
        const payload = {
          ...data,
          images: data.images.map((img) => img.url),
        };

        const url =
          mode === "edit"
            ? `/api/admin/experiences/${defaultValues?.id}`
            : "/api/admin/experiences";
        const method = mode === "edit" ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "保存失败");
        }

        toast("success", mode === "create" ? "体验已创建" : "体验已更新");

        if (mode === "create") {
          form.reset();
        }
      } catch (e) {
        toast("error", e instanceof Error ? e.message : "保存失败");
      } finally {
        setSubmitting(false);
      }
    },
    [token, mode, defaultValues, form]
  );

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-dark-500 focus:border-neon-purple/50 focus:outline-none transition-colors";
  const labelClass = "block text-xs text-dark-400 mb-1.5";
  const errorClass = "text-xs text-neon-pink mt-1";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Title */}
      <div>
        <label className={labelClass}>标题 *</label>
        <input {...form.register("title")} className={cn(inputClass, form.formState.errors.title && "border-neon-pink/50")} />
        {form.formState.errors.title && <p className={errorClass}>{form.formState.errors.title.message}</p>}
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug *</label>
        <input {...form.register("slug")} className={cn(inputClass, form.formState.errors.slug && "border-neon-pink/50")} />
        {form.formState.errors.slug && <p className={errorClass}>{form.formState.errors.slug.message}</p>}
        <p className="text-[10px] text-dark-500 mt-1">URL 标识，如 tokyo-ramen-tour</p>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>描述 *</label>
        <textarea {...form.register("description")} rows={6} className={cn(inputClass, form.formState.errors.description && "border-neon-pink/50")} />
        {form.formState.errors.description && <p className={errorClass}>{form.formState.errors.description.message}</p>}
      </div>

      {/* Location + Duration */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>地点 *</label>
          <input {...form.register("location")} className={cn(inputClass, form.formState.errors.location && "border-neon-pink/50")} />
          {form.formState.errors.location && <p className={errorClass}>{form.formState.errors.location.message}</p>}
        </div>
        <div>
          <label className={labelClass}>时长 *</label>
          <input {...form.register("duration")} className={cn(inputClass, form.formState.errors.duration && "border-neon-pink/50")} placeholder="如：3 小时 / 2 天" />
          {form.formState.errors.duration && <p className={errorClass}>{form.formState.errors.duration.message}</p>}
        </div>
      </div>

      {/* Price + Category */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>价格 (CNY) *</label>
          <input type="number" {...form.register("price")} className={cn(inputClass, form.formState.errors.price && "border-neon-pink/50")} />
          {form.formState.errors.price && <p className={errorClass}>{form.formState.errors.price.message}</p>}
        </div>
        <div>
          <label className={labelClass}>分类 *</label>
          <select {...form.register("categoryId")} className={cn(inputClass, form.formState.errors.categoryId && "border-neon-pink/50")}>
            <option value="">选择分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {form.formState.errors.categoryId && <p className={errorClass}>{form.formState.errors.categoryId.message}</p>}
        </div>
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass}>图片 URLs *</label>
          <button
            type="button"
            onClick={() => append({ url: "" })}
            className="text-xs text-neon-cyan hover:text-white transition-colors"
          >
            ➕ 添加图片
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...form.register(`images.${index}.url`)}
                className={cn(inputClass, "flex-1")}
                placeholder="https://images.unsplash.com/..."
              />
              {/* Preview */}
              {form.watch(`images.${index}.url`) && (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.watch(`images.${index}.url`)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-2 text-neon-pink hover:text-white transition-colors text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...form.register("featured")} className="w-4 h-4 rounded accent-neon-purple" />
          <span className="text-sm text-dark-200">精选体验</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...form.register("published")} className="w-4 h-4 rounded accent-neon-purple" />
          <span className="text-sm text-dark-200">立即发布</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
              保存中...
            </>
          ) : mode === "create" ? (
            "创建体验"
          ) : (
            "更新体验"
          )}
        </button>
        <a
          href="/admin/experiences"
          className="px-8 py-3 rounded-xl text-dark-400 hover:text-white transition-colors flex items-center"
        >
          取消
        </a>
      </div>
    </form>
  );
}
