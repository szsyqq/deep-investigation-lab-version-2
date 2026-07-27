import type { PreviewJsonArticle, PreviewReport, PreviewVisual } from "./research-preview";
import { articleNotesHtml } from "./article-content-contract.mjs";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function visualHtml(visual: PreviewVisual, numberById: Map<string, number>) {
  const refs = visual.evidenceIds.map((id) => numberById.get(id)).filter((number): number is number => Number.isFinite(number)).map((number) => `[${number}]`).join("");
  if (visual.component === "metric-series") {
    const series = visual.data.series as Array<{ year: number; revenue: number; netMargin: number }>;
    const max = Math.max(...series.map((item) => item.revenue));
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="research-bars-wrap"><div class="research-bars-axis" aria-hidden="true"><span>收入<br>（亿元）</span><b>0</b></div><div class="research-bars" role="img" aria-label="2021年至2025年收入柱形图；所有柱形从零轴向上，净利率以同期文字标注。">${series.map((item) => `<div><b>${item.revenue.toFixed(1)}亿</b><i data-h-pct="${Math.max(8, item.revenue / max * 100)}"></i><span>${item.year}</span><small>净利率 ${item.netMargin}%</small></div>`).join("")}</div></div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "paired-composition-bars") {
    const rows = visual.data.comparisons as Array<{ label: string; "2024": number; "2025": number }>;
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="research-pairs">${rows.map((row) => `<section><strong>${escapeHtml(row.label)}</strong><div><span>2024</span><i data-w="${row["2024"]}"></i><b>${row["2024"]}%</b></div><div><span>2025</span><i class="current" data-w="${row["2025"]}"></i><b>${row["2025"]}%</b></div></section>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "story-flow") {
    const nodes = visual.data.nodes as string[];
    return `<div class="story-graphic reveal"><span>PATTERN · 反馈闭环</span><div class="chart-title">${escapeHtml(visual.title)}</div><div class="story-flow">${nodes.map((node, index) => `${index ? "<i>→</i>" : ""}<div><b>${String(index + 1).padStart(2, "0")}</b><small>${escapeHtml(node)}</small></div>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "annotated-investment-timeline") {
    const events = visual.data.events as Array<{ date: string; event: string }>;
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="research-timeline"><i class="timeline-line" data-h-pct="100" aria-hidden="true"></i>${events.map((event, index) => `<section class="timeline-event${index === events.length - 1 ? " is-last" : ""}"><time>${escapeHtml(event.date)}</time><span class="timeline-dot" aria-hidden="true"></span><p>${escapeHtml(event.event)}</p></section>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "value-chain-bridge") {
    const nodes = visual.data.nodes as Array<{ side: string; title: string; detail: string }>;
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="value-chain-bridge" role="img" aria-label="${escapeHtml(visual.title)}">${nodes.map((node, index) => `${index ? '<i aria-hidden="true">→</i>' : ''}<section><span>${escapeHtml(node.side)}</span><b>${escapeHtml(node.title)}</b><small>${escapeHtml(node.detail)}</small></section>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "editorial-comparison-table") {
    const columns = visual.data.columns as string[];
    const rows = visual.data.rows as string[];
    const entries: Record<string, string[]> = {
      "IP来源": ["自有多角色", "外部授权为主", "艺术家IP为主"],
      "主要变现方式": ["授权与内容", "零售与供应链", "商品直营与IP运营"],
      "库存承担": ["授权商为主", "平台承担较多", "公司承担较多"],
      "消费者数据": ["授权网络与社群", "零售与会员体系", "直营会员与渠道"],
      "角色寿命机制": ["多角色、授权、内容", "品类与授权轮换", "新品、渠道与内容化"],
      "主要风险": ["授权执行与品牌一致性", "授权同质化", "集中度、库存与角色选择"],
    };
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="comparison-table" role="table" aria-label="${escapeHtml(visual.title)}"><div class="comparison-row comparison-head" role="row"><span role="columnheader">比较维度</span>${columns.map((column) => `<b role="columnheader">${escapeHtml(column)}</b>`).join("")}</div>${rows.map((row) => `<div class="comparison-row" role="row"><strong role="rowheader">${escapeHtml(row)}</strong>${(entries[row] ?? []).map((entry) => `<span role="cell">${escapeHtml(entry)}</span>`).join("")}</div>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "paired-fact-timeline") {
    const price = visual.data.resalePrice as Array<{ date: string; item: string; priceRmb: number; qualifier: string }>;
    const supply = visual.data.supply as { period: string; increaseMultiple: number; monthlyUnits: number; qualifier: string };
    const first = price[0];
    const last = price[price.length - 1];
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="fact-lanes"><section><span class="lane-label">二手成交价 · ${escapeHtml(first.item)}</span><div class="price-track"><div class="price-point"><b>${escapeHtml(first.date)}</b><strong>${escapeHtml(first.qualifier)}${first.priceRmb}元</strong></div><i class="price-line" data-w="100" aria-hidden="true"></i><div class="price-point end"><b>${escapeHtml(last.date)}</b><strong>${escapeHtml(last.qualifier)}${last.priceRmb}元</strong></div></div><small>按500元比较，跌幅至少78.4%</small></section><section><span class="lane-label">官方供给 · 2025年</span><div class="supply-fact"><strong><em data-count="${supply.increaseMultiple}"></em>倍</strong><span>毛绒供应量扩大</span><b>月产量${escapeHtml(supply.qualifier)}${(supply.monthlyUnits / 10000000).toFixed(0)}千万只</b></div></section></div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  if (visual.component === "ranked-value-bars") {
    const items = visual.data.items as Array<{ label: string; value: number }>;
    const max = Math.max(...items.map((item) => item.value));
    return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="ranked-bars">${items.map((item, index) => `<div><span>${escapeHtml(item.label)}</span><i class="${index === 0 ? "dominant" : ""}" data-w="${Math.max(4, item.value / max * 100)}"></i><b>${item.value.toFixed(1)}亿</b></div>`).join("")}</div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
  }
  const previous = visual.data["2024"] as { grossMargin: number; inventoryRmb100m: number; inventoryDays: number };
  const current = visual.data["2025"] as { grossMargin: number; inventoryRmb100m: number; inventoryDays: number };
  return `<div class="chart-box reveal"><div class="chart-title">${escapeHtml(visual.title)}</div><div class="chart-sub">${escapeHtml(visual.readerTakeaway)}</div><div class="data-callout"><div class="data-card"><span class="num">${previous.grossMargin}% → ${current.grossMargin}%</span><span class="label">毛利率</span></div><div class="data-card"><span class="num">${previous.inventoryRmb100m}亿 → ${current.inventoryRmb100m}亿</span><span class="label">库存规模</span></div><div class="data-card"><span class="num">${previous.inventoryDays}天 → ${current.inventoryDays}天</span><span class="label">库存周转</span></div></div><div class="source-line">${escapeHtml(visual.sourceNote)}<sup>${refs}</sup></div></div>`;
}

function jsonInline(text: string) {
  return escapeHtml(text).replace(/\[(\d+)\]/g, (_, number) => `<sup>[${number}]</sup>`);
}

function jsonParagraphs(text: string | undefined) {
  // Supplied manuscripts may use either line breaks or one ASCII space after
  // a completed sentence as paragraph separators. Keep the text itself
  // untouched, but translate both conventions into the shared article's
  // normal paragraph elements (which provide the blank line between them).
  return (text ?? "").trim()
    .split(/(?:\r?\n)+|(?<=[。！？…\]）】”])[ \t]+(?=[\u3400-\u9fffA-Za-z“‘])/)
    .filter(Boolean)
    .map((paragraph) => `<p>${jsonInline(paragraph.trim())}</p>`)
    .join("\n");
}

function compileJsonArticle(report: PreviewReport, article: PreviewJsonArticle) {
  const visualById = new Map(report.visuals.map((visual) => [visual.id, visual]));
  const placements = report.jsonChartPlacements ?? {};
  const noEvidenceNumbers = new Map<string, number>();
  const visualHtmlFor = (key: string) => (placements[key] ?? []).map((id) => visualById.get(id)).filter((visual): visual is PreviewVisual => Boolean(visual)).map((visual) => visualHtml(visual, noEvidenceNumbers)).join("\n");
  const chapters = [{ id: "report-top", label: "导语" }];
  let html = "";
  let chapterIndex = 0;
  const addSection = (label: string, title: string, text: string | undefined, visualKey?: string) => {
    const id = `c${chapterIndex++}`;
    html += `<h2 id="${id}" data-chapter-label="${escapeHtml(label)}">${escapeHtml(title)}</h2>\n${jsonParagraphs(text)}\n`;
    if (visualKey) html += visualHtmlFor(visualKey);
    chapters.push({ id, label: `${label}${title}` });
  };

  addSection("导语", article.导语?.title ?? "导语", article.导语?.text, "lead");
  for (const [key, chapter] of Object.entries(article.chapters ?? {})) {
    const ordinal = Number(key);
    addSection(`第${Number.isFinite(ordinal) ? ordinal : key}章`, chapter.title ?? key, chapter.text, key);
  }
  if (article.尾声) addSection("尾声", article.尾声.title ?? "尾声", article.尾声.text, "epilogue");

  const footnotes = Object.entries(article.footnotes ?? {}).sort(([left], [right]) => Number(left) - Number(right));
  html += articleNotesHtml(footnotes.map(([, text]) => `<li>${jsonInline(text)}</li>`).join(""));
  const chars = [article.引言, article.导语?.text, ...Object.values(article.chapters ?? {}).map((chapter) => chapter.text), article.尾声?.text].filter(Boolean).join("").replace(/\s/g, "").length;
  return {
    title: article.title,
    co: report.company ?? "调查对象",
    category: report.category ?? "公司",
    tags: report.tags ?? [],
    desc: article.引言 ?? report.deck,
    date: (article.date ?? report.asOf).slice(0, 10),
    readingTime: `阅读约 ${Math.max(8, Math.ceil(chars / 500))} 分钟`,
    articleHtml: html,
    chapters,
  };
}

export function compileResearchReport(report: PreviewReport) {
  if (report.jsonArticle) {
    const compiled = compileJsonArticle(report, report.jsonArticle);
    return { ...compiled, trial: true, preview: true, legacyStyles: "", openQuestions: report.openQuestions };
  }
  const mentionOrder = Array.from(report.draft.matchAll(/\[([A-Z]\d+)\]/g), (match) => match[1]);
  const orderedIds = [...new Set([...mentionOrder, ...report.evidence.map((item) => item.id)])];
  const numberById = new Map(orderedIds.map((id, index) => [id, index + 1]));
  const visualById = new Map(report.visuals.map((visual) => [visual.id, visual]));
  const visualsByTitle = new Map(report.sections.map((section) => [section.title.replace(/^(导言|序言|尾声)[:：]\s*/, ""), section.visualIds.map((id) => visualById.get(id)).filter((item): item is PreviewVisual => Boolean(item))]));
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
    // Draft-only visual planning uses Markdown blockquotes, including blank
    // separator lines that contain only `>`. None of that workflow markup is
    // reader-facing article prose.
    if (line.startsWith("# ") || line.startsWith(">")) continue;
    if (line.startsWith("## ")) {
      flushParagraph(); flushVisuals();
      const raw = line.slice(3);
      const label = raw.startsWith("序言") ? "序言" : raw.startsWith("导言") ? "导语" : raw.startsWith("尾声") ? "尾声" : `第${raw.match(/^([一二三四五六七八九十]+)、/)?.[1] ?? ""}章`;
      const title = raw.replace(/^(导言|序言|尾声)[:：]\s*/, "").replace(/^[一二三四五六七八九十]+、/, "");
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
