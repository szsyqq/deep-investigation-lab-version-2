import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { classifyResearch, classifyRevision, createPackage, validatePackage, WORKFLOW_STAGES } from "../scripts/research-core.mjs";
import { prepareArticleContent } from "../lib/article-content-contract.mjs";

test("classifies entity and topic research", () => {
  assert.equal(classifyResearch("调查空客为什么交付下降"), "entity");
  assert.equal(classifyResearch("研究低空经济行业的发展趋势和政策影响"), "topic");
});

test("creates isolated, valid research package", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dil-v2-"));
  const { reportDir, type } = createPackage(root, "调查腾讯的业务结构", "tencent");
  assert.equal(type, "entity");
  assert.deepEqual(validatePackage(reportDir), []);
  assert.ok(fs.existsSync(path.join(reportDir, "visual-plan.json")));
  assert.ok(fs.existsSync(path.join(reportDir, "discussion.md")));
  assert.ok(fs.existsSync(path.join(reportDir, "draft.md")));
  assert.ok(fs.existsSync(path.join(reportDir, "sources")));
  const workflow = JSON.parse(fs.readFileSync(path.join(reportDir, "workflow-state.json"), "utf8"));
  assert.deepEqual(workflow.stages.map((stage) => stage.id), WORKFLOW_STAGES);
});

test("classifies analyst revisions before editing", () => {
  assert.equal(classifyRevision("请更新这段财务数据和来源"), "evidence-update");
  assert.equal(classifyRevision("这一段读起来生硬，请自然改写"), "local-rewrite");
  assert.equal(classifyRevision("需要重排供应链章节顺序"), "structural-revision");
  assert.equal(classifyRevision("核心问题改变，需要整体重写"), "full-rewrite");
});

test("example package passes referential integrity", () => {
  const dir = path.resolve("content/reports/airbus-example");
  assert.deepEqual(validatePackage(dir), []);
});

test("published archive has a complete, isolated registry", () => {
  const registry = JSON.parse(fs.readFileSync(path.resolve("content/published-reports.json"), "utf8"));
  assert.equal(registry.length, 21);
  assert.equal(new Set(registry.map((report) => report.slug)).size, registry.length);
  const allowedCategories = new Set(["公司", "产业", "资本", "政策", "技术", "社会议题"]);
  assert.ok([...allowedCategories].every((category) => registry.some((report) => report.category === category)));
  for (const report of registry) {
    assert.ok(allowedCategories.has(report.category), `invalid category: ${report.slug}`);
    assert.equal(report.href, `/reports/${report.slug}`);
    const contentPath = path.resolve("content/published", report.slug, "content.json");
    assert.ok(fs.existsSync(contentPath), `missing published package: ${report.slug}`);
    const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
    assert.equal(/<h1[\s>]/i.test(content.articleHtml), false, `legacy title leaked into body: ${report.slug}`);
    assert.ok(Array.isArray(content.chapters), `missing chapters: ${report.slug}`);
    assert.deepEqual(content.chapters[0], { id: "report-top", label: "导语" });
    assert.equal(/<script[\s>]/i.test(content.articleHtml), false, `script leaked into article: ${report.slug}`);
    assert.equal(/consent-overlay/i.test(content.articleHtml), false, `legacy consent leaked into article: ${report.slug}`);
    assert.equal(/\son[a-z]+\s*=/i.test(content.articleHtml), false, `inline interaction leaked into article: ${report.slug}`);
    assert.equal(/\sdata-(?:tip|detail)\s*=/i.test(content.articleHtml), false, `legacy tooltip leaked into article: ${report.slug}`);
    const prepared = prepareArticleContent(content.articleHtml);
    assert.match(prepared.bodyHtml, /<h2\b[^>]*>\s*<span class="chap-num">导语<\/span>/i, `intro convention missing: ${report.slug}`);
    assert.match(prepared.bodyHtml, /<p\b[^>]*class=(["'])[^"']*\bdrop-cap\b[^"']*\1/i, `drop cap convention missing: ${report.slug}`);
    assert.doesNotMatch(prepared.bodyHtml, /\bfootnotes\b|data-article-notes/i, `notes leaked into prose: ${report.slug}`);
    assert.match(prepared.notesHtml, /\bfootnotes\b|data-article-notes/i, `shared notes missing: ${report.slug}`);
    assert.match(prepared.notesHtml, /<h3>注释与资料来源<\/h3>/i, `notes title drifted: ${report.slug}`);
    assert.match(prepared.notesHtml, /<li\b[^>]*id="fn1"/i, `notes numbering missing: ${report.slug}`);
    if (/<sup\b[^>]*>\s*\[\d+\]/i.test(content.articleHtml)) {
      assert.match(prepared.bodyHtml, /href="#fn\d+"/i, `citation link missing: ${report.slug}`);
    }
  }
});

test("shared content contract renders epilogues and bidirectional notes", () => {
  const prepared = prepareArticleContent('<h2>导言标题</h2><p>正文<sup>[1]</sup></p><h2>尾声：收束</h2><p>结尾</p><div class="footnotes"><h3>旧标题</h3><ol><li><sup>[1]</sup>资料</li></ol></div>');
  assert.match(prepared.bodyHtml, /<section class="epilogue shared-epilogue reveal">/);
  assert.match(prepared.bodyHtml, /<span class="chap-num">尾声<\/span>/);
  assert.match(prepared.bodyHtml, /<p class="drop-cap reveal">/);
  assert.match(prepared.bodyHtml, /id="fnref-1-1" href="#fn1"/);
  assert.match(prepared.notesHtml, /<h3>注释与资料来源<\/h3>/);
  assert.match(prepared.notesHtml, /id="fn1"/);
  assert.match(prepared.notesHtml, /href="#fnref-1-1"/);
});

test("legal notice and report shell are maintained as shared components", () => {
  const layout = fs.readFileSync(path.resolve("app/layout.tsx"), "utf8");
  const article = fs.readFileSync(path.resolve("components/report/PublishedArticle.tsx"), "utf8");
  const chrome = fs.readFileSync(path.resolve("components/report/ArticleChrome.tsx"), "utf8");
  const legal = fs.readFileSync(path.resolve("components/legal/LegalFooter.tsx"), "utf8");
  const css = fs.readFileSync(path.resolve("app/globals.css"), "utf8");
  const home = fs.readFileSync(path.resolve("app/page.tsx"), "utf8");
  assert.match(layout, /EobLegalNotice/);
  assert.match(article, /ArticleChrome/);
  assert.match(article, /LegalFooter/);
  assert.match(article, /LegacyVisualEnhancer/);
  assert.match(article, /prepareArticleContent/);
  assert.match(article, /ArticleNotes/);
  assert.match(chrome, /内部资料 · 仅供研究参考 · 请勿外传/);
  assert.match(chrome, /setCompact\(window\.scrollY > 72\)/);
  assert.match(chrome, /article-internal-banner/);
  assert.match(chrome, /article-chrome \$\{compact \? "is-compact"/);
  assert.match(chrome, /activeSequence/);
  assert.match(chrome, /article-back-top/);
  assert.match(chrome, /window\.scrollTo\(\{ top: 0, behavior: "smooth" \}\)/);
  assert.doesNotMatch(chrome, /● 内部资料/);
  assert.match(legal, />法律资料声明</);
  assert.match(css, /\.article-chrome\.is-compact \.article-topbar[\s\S]*background:\s*#a02020/);
  assert.match(css, /\.article-chrome\.is-compact \.article-topbar button[\s\S]*background:\s*white/);
  assert.match(css, /\.article-chrome\.is-compact \.article-topbar > div:first-child span[\s\S]*display:\s*none/);
  assert.match(css, /\.article-internal-banner span\s*\{[^}]*padding:\s*2px 0;[^}]*\}/);
  assert.doesNotMatch(css, /\.article-internal-banner span\s*\{[^}]*border:/);
  assert.match(css, /\.article-chrome\.is-compact \.article-classification\s*\{[^}]*border:\s*1px/);
  assert.match(css, /\.article-back-top\.visible[\s\S]*opacity:\s*\.92/);
  assert.match(css, /\.published-article-body[\s\S]*max-width:\s*776px/);
  assert.match(css, /\.published-article-body[\s\S]*>\s*\*\s*\{[\s\S]*max-width:\s*720px/);
  assert.match(css, /\.published-article-body > h2:first-child\s*\{[^}]*border-top:\s*0 !important/);
  assert.match(css, /\.published-article-body > \.chart-box\s*\{/);
  assert.match(css, /\.published-article-body \.data-callout\s*\{[^}]*grid-template-columns:\s*repeat\(3/);
  assert.match(css, /\.published-article-body > \.epilogue\s*\{[^}]*background:\s*#2a2520 !important/);
  assert.match(css, /\.shared-article-notes ol\s*\{[^}]*list-style:\s*decimal/);
  assert.match(css, /\.js \.published-article-body \.reveal\s*\{[^}]*opacity:\s*0/);
  assert.match(css, /\.published-article-body \.research-bars\s*\{/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(home, /news-byline/);
});

test("internal previews are package-driven and use one shared renderer", () => {
  const index = fs.readFileSync(path.resolve("app/preview/page.tsx"), "utf8");
  const route = fs.readFileSync(path.resolve("app/preview/[slug]/page.tsx"), "utf8");
  const loader = fs.readFileSync(path.resolve("lib/research-preview.ts"), "utf8");
  const compiler = fs.readFileSync(path.resolve("lib/compile-research-report.ts"), "utf8");
  const article = fs.readFileSync(path.resolve("components/report/PublishedArticle.tsx"), "utf8");
  const chrome = fs.readFileSync(path.resolve("components/report/ArticleChrome.tsx"), "utf8");
  const reviewPanel = fs.readFileSync(path.resolve("components/report/PreviewReviewPanel.tsx"), "utf8");
  const css = fs.readFileSync(path.resolve("app/globals.css"), "utf8");
  assert.match(index, /getPreviewPublications/);
  assert.match(index, /report\.reportId/);
  assert.doesNotMatch(index, /airbus-example/);
  assert.match(route, /generateStaticParams/);
  assert.match(route, /PublishedArticle/);
  assert.match(route, /compileResearchReport/);
  assert.match(loader, /internal-preview/);
  assert.match(loader, /publication\.json/);
  assert.match(loader, /draft\.md/);
  assert.match(loader, /evidence-ledger\.json/);
  assert.match(loader, /visual-plan\.json/);
  assert.match(compiler, /articleHtml/);
  assert.doesNotMatch(compiler, /drop-cap/);
  assert.doesNotMatch(compiler, /class="footnotes"/);
  assert.doesNotMatch(compiler, /class="chap-num"/);
  assert.match(compiler, /articleNotesHtml/);
  assert.match(compiler, /chart-box/);
  assert.match(compiler, /story-graphic/);
  assert.match(compiler, /data-h-pct/);
  assert.match(compiler, /data-w/);
  assert.match(compiler, /legacyStyles:\s*""/);
  assert.match(compiler, /openQuestions:\s*report\.openQuestions/);
  assert.doesNotMatch(compiler, /editorial-questions|试读后待确认/);
  assert.match(article, /ArticleChrome/);
  assert.match(article, /PreviewReviewPanel/);
  assert.match(article, /report\.preview/);
  assert.doesNotMatch(article, /shared-trial-notice/);
  assert.doesNotMatch(chrome, /内部试读|试读列表|preview/);
  assert.match(reviewPanel, /试读后需要确认的问题/);
  assert.match(reviewPanel, /待确认判断、尚不确定的内容及可能存在的问题/);
  assert.match(reviewPanel, /返回试读列表/);
  assert.doesNotMatch(css, /research-preview-body|preview-chart|preview-open-questions/);
});

test("published directory uses one interactive card framework", () => {
  const directory = fs.readFileSync(path.resolve("components/home/ReportDirectory.tsx"), "utf8");
  const css = fs.readFileSync(path.resolve("app/globals.css"), "utf8");
  assert.match(directory, /<Link className="news-report-card" href=\{report\.href\}/);
  assert.match(directory, /news-report-card-head/);
  assert.match(directory, /news-report-tags/);
  assert.match(directory, /发布于 \{formatReportDate\(report\.date\)\}/);
  assert.match(css, /\.news-report-list\s*\{[^}]*grid-template-columns:\s*repeat\(3/);
  assert.match(css, /\.news-report-card:hover,\.news-report-card:focus-visible\s*\{[^}]*transform:\s*translateY\(-4px\)/);
  assert.match(css, /@media \(max-width:\s*560px\)[\s\S]*\.news-report-list\s*\{[^}]*grid-template-columns:\s*1fr/);
});
