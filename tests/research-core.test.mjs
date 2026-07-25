import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { classifyResearch, createPackage, validatePackage } from "../scripts/research-core.mjs";

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
});

test("example package passes referential integrity", () => {
  const dir = path.resolve("content/reports/airbus-example");
  assert.deepEqual(validatePackage(dir), []);
});
