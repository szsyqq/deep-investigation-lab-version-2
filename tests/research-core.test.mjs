import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { classifyResearch, classifyRevision, createPackage, validatePackage, WORKFLOW_STAGES } from "../scripts/research-core.mjs";

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
  for (const report of registry) {
    assert.equal(report.href, `/reports/${report.slug}`);
    const contentPath = path.resolve("content/published", report.slug, "content.json");
    assert.ok(fs.existsSync(contentPath), `missing published package: ${report.slug}`);
    const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
    assert.ok(content.articleHtml.includes("<h1"), `missing title: ${report.slug}`);
    assert.ok(Array.isArray(content.chapters), `missing chapters: ${report.slug}`);
    assert.equal(/<script[\s>]/i.test(content.articleHtml), false, `script leaked into article: ${report.slug}`);
    assert.equal(/consent-overlay/i.test(content.articleHtml), false, `legacy consent leaked into article: ${report.slug}`);
  }
});

test("legal notice and report shell are maintained as shared components", () => {
  const layout = fs.readFileSync(path.resolve("app/layout.tsx"), "utf8");
  const article = fs.readFileSync(path.resolve("components/report/PublishedArticle.tsx"), "utf8");
  assert.match(layout, /EobLegalNotice/);
  assert.match(article, /ArticleChrome/);
  assert.match(article, /LegalFooter/);
});
