import type { PreviewReport, PreviewVisual } from "./research-preview";
import { articleNotesHtml } from "./article-content-contract.mjs";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function visualHtml(visual: PreviewVisual, numberById: Map<string, number>) {
  const refs = visual.evidenceIds.map((id) => `[${numberById.get(id)}]`).join("");
  if (visual.component === "metric-series") {
    const series = visual.data.series as Array<{ year: number; revenue: number; netMargin: number }>;
    const max = Math.max(...series.map((item) => item.revenue));
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="research-bars">${series.map((item) => `<div><b>${item.revenue.toFixed(1)}亿</b><i data-h-pct="${Math.max(8, item.revenue / max * 100)}"></i><span>${item.year}</span><small>净利率 ${item.netMargin}%</small></div>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "paired-composition-bars") {
    const rows = visual.data.comparisons as Array<{ label: string; "2024": number; "2025": number }>;
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="research-pairs">${rows.map((row) => `<section><strong>${escapeHtml(row.label)}</strong><div><span>2024</span><i data-w="${row["2024"]}"></i><b>${row["2024"]}%</b></div><div><span>2025</span><i class="current" data-w="${row["2025"]}"></i><b>${row["2025"]}%</b></div></section>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "story-flow") {
    const nodes = visual.data.nodes as string[];
    return `<div class="story-graphic reveal"><span>PATTERN · 反馈闭环</span><div class="chart-title">${escapeHtml(visual.title)}</div><div class="story-flow">${nodes.map((node, index) => `${index ? "<i>→</i>" : ""}<div><b>${String(index + 1).padStart(2, "0")}</b><small>${escapeHtml(node)}</small></div>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  const previous = visual.data["2024"] as { grossMargin: number; inventoryRmb100m: number; inventoryDays: number };
  const current = visual.data["2025"] as { grossMargin: number; inventoryRmb100m: number; inventoryDays: number };
  return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="data-callout"><div class="data-card"><span class="num">${previous.grossMargin}% → ${current.grossMargin}%</span><span class="label">毛利率</span></div><div class="data-card"><span class="num">${previous.inventoryRmb100m}亿 → ${current.inventoryRmb100m}亿</span><span class="label">库存规模</span></div><div class="data-card"><span class="num">${previous.inventoryDays}天 → ${current.inventoryDays}天</span><span class="label">库存周转</span></div></div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
}

export function compileResearchReport(report: PreviewReport) {
  const mentionOrder = Array.from(report.draft.matchAll(/\[([A-Z]\d+)\]/g), (match) => match[1]);
  const orderedIds = [...new Set([...mentionOrder, ...report.evidence.map((item) => item.id)])];
  const numberById = new Map(orderedIds.map((id, index) => [id, index + 1]));
  const visualById = new Map(report.visuals.map((visual) => [visual.id, visual]));
  const visualsByTitle = new Map(report.sections.map((section) => [section.title.replace(/^(导言|尾声)[:：]\s*/, ""), section.visualIds.map((id) => visualById.get(id)).filter((item): item is PreviewVisual => Boolean(item))]));
  const chapters = [{ id: "report-top", label: "导语" }];
  let html = "";
  let paragraph: string[] = [];
  let pendingVisuals: PreviewVisual[] = [];
  const inline = (text: string) => escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([A-Z]\d+)\]/g, (_, id) => `<sup>[${numberById.get(id)}]</sup>`);
  const flushParagraph = () => {
    if (!paragraph.length) return;
    html += `<p>${inline(paragraph.join(" "))}</p>\n`;
    paragraph = [];
  };
  const flushVisuals = () => {
    html += pendingVisuals.map((visual) => visualHtml(visual, numberById)).join("\n");
    pendingVisuals = [];
  };
  for (const line of report.draft.split(/\r?\n/)) {
    if (!line.trim()) { flushParagraph(); continue; }
    if (line.startsWith("# ") || line.startsWith("> ")) continue;
    if (line.startsWith("## ")) {
      flushParagraph(); flushVisuals();
      const raw = line.slice(3);
      const label = raw.startsWith("导言") ? "导语" : raw.startsWith("尾声") ? "尾声" : `第${raw.match(/^([一二三四五六七八九十]+)、/)?.[1] ?? ""}章`;
      const title = raw.replace(/^(导言|尾声)[:：]\s*/, "").replace(/^[一二三四五六七八九十]+、/, "");
      const id = `c${chapters.length - 1}`;
      html += `<h2 id="${id}" data-chapter-label="${escapeHtml(label)}">${escapeHtml(title)}</h2>\n`;
      chapters.push({ id, label: `${label}${title}` });
      pendingVisuals = visualsByTitle.get(title) ?? [];
      continue;
    }
    if (line === "---") { flushParagraph(); continue; }
    paragraph.push(line);
  }
  flushParagraph(); flushVisuals();
  html += articleNotesHtml(orderedIds.map((id) => report.evidence.find((item) => item.id === id)).filter(Boolean).map((source, index) => `<li id="fn${index + 1}"><b>${escapeHtml(source!.publisher)}</b>，《${escapeHtml(source!.title)}》，${escapeHtml(source!.publishedAt || "日期未注明")}。${source!.url ? `<a href="${escapeHtml(source!.url)}" target="_blank" rel="noopener">来源</a>` : ""}</li>`).join(""));
  const chars = report.draft.replace(/\s/g, "").length;
  return {
    title: report.title, co: "泡泡玛特", category: "公司", tags: ["IP运营", "潮流消费", "全球化"],
    desc: report.deck, date: report.asOf, trial: true, preview: true,
    readingTime: `阅读约 ${Math.max(8, Math.ceil(chars / 500))} 分钟`,
    articleHtml: html, legacyStyles: "",
    openQuestions: report.openQuestions,
    chapters,
  };
}
