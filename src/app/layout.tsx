import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "100 Ways Travel — 百途旅行",
  description: "探索 100 种旅行方式，发现世界之美",
  manifest: "/manifest.json",
  icons: { icon: "/placeholder.svg" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "100 Ways Travel — 百途旅行",
    description: "探索 100 种旅行方式，发现世界之美",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main id="main-content" className="flex-1 pt-16" role="main">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
