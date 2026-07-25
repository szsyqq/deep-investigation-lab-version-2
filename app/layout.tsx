import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deep Investigation Lab V2",
  description: "一套从研究分类、证据核查、视觉规划到网站发布的深度调查工作系统。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
