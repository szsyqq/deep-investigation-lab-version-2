"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Chapter = { id: string; label: string };

export default function ArticleChrome({ readingTime, chapters }: { readingTime: string; chapters: Chapter[] }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(chapters[0]?.id ?? "");
  const [compact, setCompact] = useState(false);
  const activeIndex = chapters.findIndex((chapter) => chapter.id === active);
  const activeSequence = activeIndex <= 0 ? "导语" : `第 ${activeIndex} 节`;

  useEffect(() => {
    function update() {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
      setCompact(window.scrollY > 72);
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
      <div className={`article-chrome ${compact ? "is-compact" : ""}`}>
        <div className="article-internal-banner"><span>内部资料 · 仅供研究参考 · 请勿外传</span></div>
        <header className="article-topbar">
          <div><Link href="/">← 返回报道首页</Link><span>{readingTime}</span></div>
          <div className="article-classification">内部资料 · 仅供研究参考 · 请勿外传</div>
          <div><span>{activeSequence}</span><button type="button" onClick={() => setOpen(true)}>≡ 目录</button></div>
        </header>
      </div>
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
      <button
        className={`article-back-top ${compact ? "visible" : ""}`}
        type="button"
        aria-label="返回页面顶部"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </>
  );
}
