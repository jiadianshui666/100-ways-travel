"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "注册失败");
      router.push("/login?registered=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "注册失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <span className="text-4xl mb-4 block">✈️</span>
          <h1 className="text-2xl font-display font-bold text-neon-gradient">创建账号</h1>
          <p className="text-sm text-dark-400 mt-2">加入百途旅行，发现更多旅行灵感</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-strong p-6 sm:p-8 space-y-4">
          {error && <div className="px-4 py-3 rounded-lg bg-neon-pink/10 border border-neon-pink/20 text-sm text-neon-pink">{error}</div>}

          <div>
            <label className="block text-xs text-dark-400 mb-1.5">姓名</label>
            <input {...register("name")} className={cn("w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder:text-dark-500 focus:border-neon-purple/50 focus:outline-none", errors.name && "border-neon-pink/50")} placeholder="你的名字" />
            {errors.name && <p className="text-xs text-neon-pink mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-dark-400 mb-1.5">邮箱</label>
            <input {...register("email")} type="email" className={cn("w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder:text-dark-500 focus:border-neon-purple/50 focus:outline-none", errors.email && "border-neon-pink/50")} placeholder="your@email.com" />
            {errors.email && <p className="text-xs text-neon-pink mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-dark-400 mb-1.5">密码</label>
            <input {...register("password")} type="password" className={cn("w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder:text-dark-500 focus:border-neon-purple/50 focus:outline-none", errors.password && "border-neon-pink/50")} placeholder="至少 6 位" />
            {errors.password && <p className="text-xs text-neon-pink mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all disabled:opacity-50">
            {submitting ? "注册中..." : "注册"}
          </button>

          <p className="text-center text-xs text-dark-500">
            已有账号？<Link href="/login" className="text-neon-cyan hover:underline">立即登录</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
