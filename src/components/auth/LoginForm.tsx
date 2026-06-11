"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const registered = searchParams.get("registered");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "登录失败");
      localStorage.setItem("admin-auth", JSON.stringify({ user: json.user, token: json.token }));
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "登录失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <span className="text-4xl mb-4 block">✈️</span>
          <h1 className="text-2xl font-display font-bold text-neon-gradient">欢迎回来</h1>
          <p className="text-sm text-dark-400 mt-2">登录你的百途旅行账号</p>
        </div>

        {registered && (
          <div className="px-4 py-3 rounded-lg bg-neon-green/10 border border-neon-green/20 text-sm text-neon-green text-center">
            注册成功！请登录
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="glass-strong p-6 sm:p-8 space-y-4">
          {error && <div className="px-4 py-3 rounded-lg bg-neon-pink/10 border border-neon-pink/20 text-sm text-neon-pink">{error}</div>}

          <div>
            <label className="block text-xs text-dark-400 mb-1.5">邮箱</label>
            <input {...register("email")} type="email" className={cn("w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder:text-dark-500 focus:border-neon-purple/50 focus:outline-none", errors.email && "border-neon-pink/50")} placeholder="your@email.com" />
            {errors.email && <p className="text-xs text-neon-pink mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-dark-400 mb-1.5">密码</label>
            <input {...register("password")} type="password" className={cn("w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder:text-dark-500 focus:border-neon-purple/50 focus:outline-none", errors.password && "border-neon-pink/50")} placeholder="输入密码" />
            {errors.password && <p className="text-xs text-neon-pink mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all disabled:opacity-50">
            {submitting ? "登录中..." : "登录"}
          </button>

          <p className="text-center text-xs text-dark-500">
            还没有账号？<Link href="/register" className="text-neon-cyan hover:underline">立即注册</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
