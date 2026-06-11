"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-dark-800/95 backdrop-blur-xl border-l border-white/5 shadow-glass md:hidden",
          "flex flex-col p-6 pt-20 gap-2 transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="移动端导航菜单"
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-lg text-dark-200 hover:text-white hover:bg-white/5 transition-colors"
          onClick={onClose}
          aria-label="关闭菜单"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="mb-8">
          <span className="font-display text-xl font-bold text-neon-gradient">
            100 Ways Travel
          </span>
        </div>

        {/* Nav links */}
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="px-4 py-3 rounded-lg text-dark-100 hover:text-white hover:bg-white/5 transition-all duration-200"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {link.label}
          </Link>
        ))}

        <hr className="my-4 divider-neon" />

        <Link
          href="/login"
          onClick={onClose}
          className="px-4 py-3 rounded-lg text-dark-200 hover:text-white transition-colors"
        >
          登录
        </Link>
        <Link
          href="/register"
          onClick={onClose}
          className="px-4 py-3 rounded-lg text-center bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 transition-all"
        >
          注册
        </Link>
      </div>
    </>
  );
}
