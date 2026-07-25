import fs from "node:fs";
import path from "node:path";

export function classifyResearch(request) {
  const text = request.trim();
  const topicSignals = ["行业", "现象", "政策", "趋势", "市场", "供应链", "事件", "问题", "生态", "赛道", "影响"];
  const entitySignals = ["公司", "企业", "集团", "机构", "人物", "产品", "品牌"];
  const knownEntityPattern = /空客|腾讯|宝马|小红书|DeepSeek|英伟达|苹果|特斯拉|基金|航空|银行/;
  const topicScore = topicSignals.filter((word) => text.includes(word)).length;
  const entityScore = entitySignals.filter((word) => text.includes(word)).length + (knownEntityPattern.test(text) ? 2 : 0);
  return entityScore > topicScore ? "entity" : "topic";
}

export function slugify(input) {
  const ascii = input
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);
  if (/^[a-z0-9-]+$/.test(ascii) && ascii) return ascii;
  const stamp = new Date().toISOString().slice(0, 10);
  return `research-${stamp}-${simpleHash(input)}`;
}

function simpleHash(text) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  return hash.toString(36).slice(0, 6);
}

export function createPackage(root, request, forcedSlug) {
  const type = classifyResearch(request);
  const slug = forcedSlug || slugify(request);
  const reportDir = path.join(root, "content", "reports", slug);
  if (fs.existsSync(reportDir)) throw new Error(`Research package already exists: ${slug}`);
  fs.mkdirSync(reportDir, { recursive: true });
  const now = new Date().toISOString();
  const brief = {
    schemaVersion: "1.0.0",
    id: slug,
    request,
    researchType: type,
    status: "intake",
    asOf: now.slice(0, 10),
    scope: { included: [], excluded: [], geography: "", period: "" },
    coreQuestion: "",
    subQuestions: type === "entity"
      ? ["主体如何定义自己，真实结果来自哪里？", "业务、财务、治理与外部验证之间有何张力？", "哪些反证会推翻初步判断？"]
      : ["议题的边界和规模是什么？", "关键主体、机制与受影响群体是谁？", "哪些反证会推翻初步判断？"],
    disconfirmingEvidence: [],
    createdAt: now,
    updatedAt: now,
  };
  const files = {
    "brief.json": brief,
    "evidence-ledger.json": { schemaVersion: "1.0.0", reportId: slug, items: [] },
    "claim-map.json": { schemaVersion: "1.0.0", reportId: slug, thesis: "", claims: [] },
    "visual-plan.json": { schemaVersion: "1.0.0", reportId: slug, visuals: [] },
    "editorial-state.json": { schemaVersion: "1.0.0", reportId: slug, approvedSections: [], lockedFacts: [], decisions: [] },
    "publication.json": { schemaVersion: "1.0.0", reportId: slug, title: "", deck: "", sections: [], sources: [], status: "draft" },
  };
  for (const [name, value] of Object.entries(files)) {
    fs.writeFileSync(path.join(reportDir, name), `${JSON.stringify(value, null, 2)}\n`);
  }
  return { reportDir, slug, type };
}

export function validatePackage(reportDir) {
  const required = ["brief.json", "evidence-ledger.json", "claim-map.json", "visual-plan.json", "editorial-state.json", "publication.json"];
  const errors = [];
  const parsed = {};
  for (const name of required) {
    const file = path.join(reportDir, name);
    if (!fs.existsSync(file)) {
      errors.push(`missing ${name}`);
      continue;
    }
    try { parsed[name] = JSON.parse(fs.readFileSync(file, "utf8")); }
    catch { errors.push(`invalid JSON: ${name}`); }
  }
  if (parsed["brief.json"] && !["entity", "topic"].includes(parsed["brief.json"].researchType)) errors.push("brief.researchType must be entity or topic");
  const evidenceIds = new Set((parsed["evidence-ledger.json"]?.items || []).map((item) => item.id));
  for (const claim of parsed["claim-map.json"]?.claims || []) {
    if (!claim.id || !claim.text) errors.push("every claim needs id and text");
    for (const id of claim.evidenceIds || []) if (!evidenceIds.has(id)) errors.push(`claim ${claim.id} references missing evidence ${id}`);
  }
  for (const visual of parsed["visual-plan.json"]?.visuals || []) {
    if (!visual.claimId || !visual.pattern || !visual.component) errors.push("every visual needs claimId, pattern and component");
    for (const id of visual.evidenceIds || []) if (!evidenceIds.has(id)) errors.push(`visual references missing evidence ${id}`);
  }
  return errors;
}
