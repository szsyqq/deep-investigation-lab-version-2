function addClass(attributes, className) {
  const classMatch = attributes.match(/\sclass=(["'])(.*?)\1/i);
  if (!classMatch) return `${attributes} class="${className}"`;
  const classes = classMatch[2].split(/\s+/).filter(Boolean).filter((name) => name !== className);
  classes.push(className);
  return attributes.replace(classMatch[0], ` class=${classMatch[1]}${classes.join(" ")}${classMatch[1]}`);
}

function removeClass(attributes, className) {
  const classMatch = attributes.match(/\sclass=(["'])(.*?)\1/i);
  if (!classMatch) return attributes;
  const classes = classMatch[2].split(/\s+/).filter((name) => name && name !== className);
  return classes.length
    ? attributes.replace(classMatch[0], ` class=${classMatch[1]}${classes.join(" ")}${classMatch[1]}`)
    : attributes.replace(classMatch[0], "");
}

function extractBalancedElement(html, start, tagName) {
  const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  tagPattern.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagPattern.exec(html))) {
    depth += match[0][1] === "/" ? -1 : 1;
    if (depth === 0) return { html: html.slice(start, tagPattern.lastIndex), end: tagPattern.lastIndex };
  }
  return null;
}

function extractNotes(html) {
  const marker = /<(div|section|aside)\b[^>]*(?:class=(["'])[^"']*\bfootnotes\b[^"']*\2|data-article-notes(?:=(["'])[^"']*\3)?)[^>]*>/i.exec(html);
  if (!marker) return { bodyHtml: html, notesHtml: "" };
  const element = extractBalancedElement(html, marker.index, marker[1]);
  if (!element) return { bodyHtml: html, notesHtml: "" };
  return {
    bodyHtml: `${html.slice(0, marker.index)}${html.slice(element.end)}`.trim(),
    notesHtml: element.html,
  };
}

function normalizeNotes(html) {
  if (!html) return "";
  let index = 0;
  return html
    .replace(/<h3\b[^>]*>[\s\S]*?<\/h3>/i, "<h3>注释与资料来源</h3>")
    .replace(/<li\b([^>]*)>([\s\S]*?)<\/li>/gi, (_, attributes, content) => {
      index += 1;
      const cleanContent = content.replace(/^\s*<sup\b[^>]*>\s*\[\d+\]\s*<\/sup>\s*/i, "");
      const cleanAttributes = attributes.replace(/\sid=(["'])[^"']*\1/i, "");
      return `<li${cleanAttributes} id="fn${index}">${cleanContent}<a class="footnote-backref" href="#fnref-${index}-1" aria-label="返回正文">↩</a></li>`;
    });
}

function normalizeCitations(html) {
  const occurrences = new Map();
  return html.replace(/<sup\b([^>]*)>\s*((?:\[\d+\]\s*)+)<\/sup>/gi, (_, attributes, references) => {
    const links = [...references.matchAll(/\[(\d+)\]/g)].map((match) => {
      const number = Number(match[1]);
      const occurrence = (occurrences.get(number) ?? 0) + 1;
      occurrences.set(number, occurrence);
      return `<a id="fnref-${number}-${occurrence}" href="#fn${number}" aria-label="查看注释 ${number}">[${number}]</a>`;
    }).join("");
    return `<sup${attributes}>${links}</sup>`;
  });
}

function normalizeHeadings(html) {
  const firstHeading = html.search(/<h2\b/i);
  const firstParagraph = html.search(/<p\b/i);
  if (firstParagraph !== -1 && (firstHeading === -1 || firstParagraph < firstHeading)) {
    html = `${html.slice(0, firstParagraph)}<h2 id="c0"><span class="chap-num">导语</span>导言</h2>\n${html.slice(firstParagraph)}`;
  }
  let chapterNumber = 0;
  return html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attributes, content, offset) => {
    const existing = content.match(/^\s*<span\b[^>]*class=(["'])[^"']*\bchap-num\b[^"']*\1[^>]*>([\s\S]*?)<\/span>/i);
    const title = (existing ? content.slice(existing[0].length) : content).trim();
    const plainTitle = title.replace(/<[^>]+>/g, "").trim();
    const isFirst = html.slice(0, offset).search(/<h2\b/i) === -1;
    const semanticLabel = attributes.match(/\sdata-chapter-label=(["'])(.*?)\1/i)?.[2];
    let label = semanticLabel || existing?.[2].replace(/<[^>]+>/g, "").trim();
    if (isFirst) {
      label = "导语";
    } else if (/^(尾声|结语)/.test(plainTitle)) {
      label = "尾声";
    } else if (!label) {
      if (/^(导语|导言)/.test(plainTitle)) label = "导语";
      else if (/^(尾声|结语)/.test(plainTitle)) label = "尾声";
      else label = `第${++chapterNumber}章`;
    } else if (!/^(导语|导言|尾声|结语)$/.test(label)) {
      chapterNumber += 1;
    }
    return `<h2${attributes}><span class="chap-num">${label === "导言" ? "导语" : label}</span>${title}</h2>`;
  });
}

function normalizeEpilogue(html) {
  const heading = /<h2\b[^>]*>\s*<span\b[^>]*class=(["'])[^"']*\bchap-num\b[^"']*\1[^>]*>\s*(?:尾声|结语)\s*<\/span>[\s\S]*?<\/h2>/i.exec(html);
  if (!heading) return html;
  const before = html.slice(0, heading.index);
  if (/<(?:div|section)\b[^>]*class=(["'])[^"']*\bepilogue\b[^"']*\1[^>]*>\s*$/i.test(before)) return html;
  const after = html.slice(heading.index);
  const boundary = after.search(/<div\b[^>]*class=(["'])[^"']*\beditorial-questions\b[^"']*\1/i);
  const epilogue = boundary === -1 ? after : after.slice(0, boundary);
  const remainder = boundary === -1 ? "" : after.slice(boundary);
  return `${before}<section class="epilogue shared-epilogue">${epilogue.trim()}</section>\n${remainder}`;
}

function normalizeDropCap(html) {
  let first = true;
  return html.replace(/<p\b([^>]*)>/gi, (_, attributes) => {
    const clean = removeClass(attributes, "drop-cap");
    if (!first) return `<p${clean}>`;
    first = false;
    return `<p${addClass(clean, "drop-cap")}>`;
  });
}

function normalizeReveal(html) {
  return html
    .replace(/<(h2|p|blockquote)\b([^>]*)>/gi, (_, tag, attributes) => `<${tag}${addClass(attributes, "reveal")}>`)
    .replace(/<(div|section)\b([^>]*class=(["'])[^"']*\b(?:chart-box|story-graphic|epilogue)\b[^"']*\3[^>]*)>/gi, (_, tag, attributes) => `<${tag}${addClass(attributes, "reveal")}>`);
}

export function prepareArticleContent(articleHtml) {
  const extracted = extractNotes(articleHtml);
  const headed = normalizeHeadings(extracted.bodyHtml);
  return {
    bodyHtml: normalizeReveal(normalizeCitations(normalizeDropCap(normalizeEpilogue(headed)))),
    notesHtml: normalizeNotes(extracted.notesHtml),
  };
}

export function articleNotesHtml(itemsHtml, title = "注释与资料来源") {
  return `<section data-article-notes><h3>${title}</h3><ol>${itemsHtml}</ol></section>`;
}
