import type { Metadata } from "next";
import EobLegalNotice from "../components/legal/EobLegalNotice";
import "./globals.css";

export const metadata: Metadata = {
  title: "深度调查档案室 · The Investigative Desk",
  description: "基于公开信息、事实核验与独立研究形成的深度报道档案室。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body><EobLegalNotice />{children}</body>
    </html>
  );
}
