"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(1, "请输入密码"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Already logged in
  if (user) {
    router.replace("/admin");
    return null;
  }

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      router.push("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "登录失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-950">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-neon-cyan/8 rounded-full blur-[180px]" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">✈️</span>
          <h1 className="text-2xl font-display font-bold text-neon-gradient">
            百途管理后台
          </h1>
          <p className="text-sm text-dark-400 mt-2">请登录以继续</p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-strong p-6 sm:p-8 space-y-5"
        >
          {error && (
            <div className="px-4 py-3 rounded-lg bg-neon-pink/10 border border-neon-pink/20 text-sm text-neon-pink animate-fade-in">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs text-dark-400 mb-1.5">邮箱</label>
            <input
              type="email"
              {...register("email")}
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder:text-dark-500 focus:outline-none transition-colors",
                errors.email
                  ? "border-neon-pink/50"
                  : "border-white/10 focus:border-neon-purple/50"
              )}
              placeholder="admin@100ways.com"
              autoFocus
            />
            {errors.email && (
              <p className="text-xs text-neon-pink mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-dark-400 mb-1.5">密码</label>
            <input
              type="password"
              {...register("password")}
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder:text-dark-500 focus:outline-none transition-colors",
                errors.password
                  ? "border-neon-pink/50"
                  : "border-white/10 focus:border-neon-purple/50"
              )}
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-xs text-neon-pink mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
                登录中...
              </>
            ) : (
              "登录"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
