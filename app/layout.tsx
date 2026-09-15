import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C++ 星航图｜从入门到就业",
  description: "一张由 48 个知识点组成的 C++ 星空学习地图，覆盖基础语法、现代 C++、算法、工程实践与就业方向。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
