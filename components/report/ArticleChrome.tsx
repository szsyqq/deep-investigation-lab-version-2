"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Chapter = { id: string; label: string };

export default function ArticleChrome({ readingTime, chapters }: { readingTime: string; chapters: Chapter[] }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    function update() {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
      let current = chapters[0]?.id ?? "";
      for (const chapter of chapters) {
        const element = document.getElementById(chapter.id);
        if (element && element.getBoundingClientRect().top <= 150) current = chapter.id;
      }
      setActive(current);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [chapters]);

  return (
    <>
      <div className="article-progress" style={{ width: `${progress}%` }} />
      <header className="article-topbar">
        <div><Link href="/">← 返回报道首页</Link><span>{readingTime}</span></div>
        <div><span>{chapters.find((chapter) => chapter.id === active)?.label || "导语"}</span><button type="button" onClick={() => setOpen(true)}>≡ 目录</button></div>
      </header>
      <div className="article-masthead"><b>调查团队 · THE INVESTIGATION</b><span>深度调查档案室</span></div>
      <aside className={`article-sidenav ${open ? "open" : ""}`} aria-hidden={!open}>
        <button type="button" aria-label="关闭目录" onClick={() => setOpen(false)}>×</button>
        <h2>章节导航</h2>
        {chapters.map((chapter, index) => (
          <a className={active === chapter.id ? "active" : ""} href={`#${chapter.id}`} key={chapter.id} onClick={() => setOpen(false)}>
            <small>{chapter.id === "report-top" ? "导语" : `第 ${index} 节`}</small>{chapter.label}
          </a>
        ))}
      </aside>
      {open && <button className="article-sidenav-mask" type="button" aria-label="关闭目录" onClick={() => setOpen(false)} />}
    </>
  );
}
