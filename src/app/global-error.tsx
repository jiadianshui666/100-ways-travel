"use client";

import { useEffect } from "react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-dark-950 text-white font-body antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-6 animate-fade-in">
            <span className="text-6xl block">🔧</span>
            <h1 className="text-2xl font-display font-bold text-white">系统错误</h1>
            <p className="text-sm text-dark-400 max-w-md">
              系统遇到严重错误，请刷新页面或稍后再试。
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/25 hover:shadow-neon-purple transition-all"
            >
              重试
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
