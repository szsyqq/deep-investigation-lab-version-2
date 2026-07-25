"use client";

import { useEffect } from "react";

function formatCount(value: number, target: number, source: string, suffix: string) {
  const decimals = String(target).includes(".") ? String(target).split(".")[1].length : 0;
  const formatted = value.toLocaleString("zh-CN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (source.includes("%") && !suffix) return `${formatted}%`;
  return `${formatted}${suffix}`;
}

export default function LegacyVisualEnhancer() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".published-article-body");
    if (!root) return;

    document.documentElement.classList.add("js");
    const observers: IntersectionObserver[] = [];

    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });
    root.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
    observers.push(revealObserver);

    const visualObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement | SVGElement;
        const width = element.getAttribute("data-w");
        const height = element.getAttribute("data-h");
        const dash = element.getAttribute("data-da");
        const offset = element.getAttribute("data-offset");

        if (width && element instanceof HTMLElement) element.style.width = `${width}%`;
        if (height && element instanceof HTMLElement) element.style.height = `${height}px`;
        if (dash && element instanceof SVGElement) {
          const current = element.getAttribute("stroke-dasharray")?.split(/\s+/)[1] || "515.22";
          element.setAttribute("stroke-dasharray", `${dash} ${current}`);
          if (offset) element.setAttribute("stroke-dashoffset", offset);
          element.closest("svg")?.classList.add("in");
        }

        const count = element.getAttribute("data-count");
        if (count && element instanceof HTMLElement) {
          const target = Number(count);
          const original = element.textContent || "";
          const suffix = element.getAttribute("data-suffix") || "";
          if (Number.isFinite(target)) {
            const started = performance.now();
            const duration = 900;
            const tick = (now: number) => {
              const ratio = Math.min(1, (now - started) / duration);
              const eased = 1 - Math.pow(1 - ratio, 3);
              element.textContent = formatCount(target * eased, target, original, suffix);
              if (ratio < 1) requestAnimationFrame(tick);
              else element.textContent = formatCount(target, target, original, suffix);
            };
            requestAnimationFrame(tick);
          }
        }
        observer.unobserve(element);
      }
    }, { threshold: 0.12 });
    root.querySelectorAll("[data-w],[data-h],[data-da],[data-count]").forEach((element) => visualObserver.observe(element));
    root.querySelectorAll(".donut").forEach((element) => {
      const donutObserver = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).style.transform = "scale(1) rotate(360deg)";
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.2 });
      donutObserver.observe(element);
      observers.push(donutObserver);
    });
    root.querySelectorAll<SVGPathElement>("path[stroke-dasharray][stroke-dashoffset]").forEach((element) => {
      const lineObserver = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const path = entry.target as SVGPathElement;
          path.style.transition = "stroke-dashoffset 1.4s ease";
          path.style.strokeDashoffset = "0";
          observer.unobserve(path);
        }
      }, { threshold: 0.2 });
      lineObserver.observe(element);
      observers.push(lineObserver);
    });
    observers.push(visualObserver);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      document.documentElement.classList.remove("js");
    };
  }, []);

  return null;
}
