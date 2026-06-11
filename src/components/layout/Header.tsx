"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/experiences", label: "探索" },
  { href: "/categories", label: "分类" },
  { href: "/about", label: "关于" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300",
          scrolled
            ? "bg-dark-900/80 backdrop-blur-xl border-b border-white/5 shadow-glass"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="100 Ways Travel 首页"
          >
            <span className="text-2xl">✈️</span>
            <span className="hidden sm:inline font-display text-lg font-bold text-neon-gradient">
              100 Ways Travel
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-dark-200 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-dark-200 hover:text-white transition-colors"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm rounded-lg bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 hover:shadow-neon-purple transition-all duration-300"
            >
              注册
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-dark-200 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="打开菜单"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
      />
    </>
  );
}
