"use client";

import { AuthProvider } from "@/hooks/useAuth";

// This layout ONLY applies to /admin/login (standalone, no sidebar)
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
