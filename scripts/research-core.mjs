import fs from "node:fs";
import path from "node:path";

export const WORKFLOW_STAGES = [
  "intake",
  "discussion-research",
  "outline-sources",
  "drafting",
  "visual-editing",
  "review-revision",
  "preview-publication",
];

export const PUBLICATION_STATUSES = [
  "researching",
  "draft",
  "review",
  "analyst-confirmation",
  "internal-preview",
  "approved",
  "published",
  "update-required",
];

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
    schemaVersion: "2.0.0",
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
    "workflow-state.json": {
      schemaVersion: "2.0.0",
      reportId: slug,
      currentStage: "intake",
      stages: WORKFLOW_STAGES.map((id, index) => ({ id, status: index === 0 ? "in-progress" : "pending" })),
      researchLoops: [],
      analystApproval: { status: "pending", approvedAt: null, note: "" },
      visibility: "private",
      updatedAt: now,
    },
    "evidence-ledger.json": { schemaVersion: "2.0.0", reportId: slug, items: [] },
    "claim-map.json": { schemaVersion: "2.0.0", reportId: slug, thesis: "", claims: [] },
    "visual-plan.json": { schemaVersion: "2.0.0", reportId: slug, visuals: [] },
    "editorial-state.json": { schemaVersion: "2.0.0", reportId: slug, approvedSections: [], lockedFacts: [], openQuestions: [], decisions: [] },
    "publication.json": { schemaVersion: "2.0.0", reportId: slug, title: "", deck: "", sections: [], sources: [], status: "researching", previewLabel: "研究中", publishedAt: null },
  };
  for (const [name, value] of Object.entries(files)) {
    fs.writeFileSync(path.join(reportDir, name), `${JSON.stringify(value, null, 2)}\n`);
  }
  fs.mkdirSync(path.join(reportDir, "sources"), { recursive: true });
  const markdownFiles = {
    "discussion.md": "# 讨论团记录\n\n## 读者与市场问题\n\n## 研究方向\n\n## 争议与反证\n\n## 下一轮研究任务\n",
    "research-notes.md": "# 研究过程记录\n\n每一轮记录：新发现、来源编号、冲突、仍待回答的问题，以及是否需要进入下一轮。\n",
    "outline.md": "# 报告框架\n\n## 核心论点\n\n## 章节设计\n\n每章写明：章节职责、核心结论、证据编号和与前后章节的关系。\n",
    "draft.md": "# 当前完整初稿\n\n> 初稿以连贯文字为主。证据不足时返回研究阶段，不以模糊表达填补。\n",
    "review.md": "# 审核记录\n\n## 来源相似性与重复\n\n## 事实和引用\n\n## 结构与叙事\n\n## 图表与移动端\n\n## 待处理问题\n",
    "revisions.md": "# 人工修改记录\n\n每次记录：分析师意见、修改级别、受影响范围、最终处理和确认状态。\n",
  };
  for (const [name, value] of Object.entries(markdownFiles)) fs.writeFileSync(path.join(reportDir, name), value);
  return { reportDir, slug, type };
}

export function validatePackage(reportDir) {
  const required = ["brief.json", "workflow-state.json", "evidence-ledger.json", "claim-map.json", "visual-plan.json", "editorial-state.json", "publication.json"];
  const requiredDrafts = ["discussion.md", "research-notes.md", "outline.md", "draft.md", "review.md", "revisions.md"];
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
  for (const name of requiredDrafts) {
    const file = path.join(reportDir, name);
    if (!fs.existsSync(file)) errors.push(`missing ${name}`);
  }
  if (!fs.existsSync(path.join(reportDir, "sources"))) errors.push("missing sources directory");
  if (parsed["brief.json"] && !["entity", "topic"].includes(parsed["brief.json"].researchType)) errors.push("brief.researchType must be entity or topic");
  const workflow = parsed["workflow-state.json"];
  if (workflow && !WORKFLOW_STAGES.includes(workflow.currentStage)) errors.push("workflow-state.currentStage is invalid");
  if (workflow) {
    const stageIds = new Set((workflow.stages || []).map((stage) => stage.id));
    for (const stage of WORKFLOW_STAGES) if (!stageIds.has(stage)) errors.push(`workflow-state missing stage ${stage}`);
  }
  const publication = parsed["publication.json"];
  if (publication && !PUBLICATION_STATUSES.includes(publication.status)) errors.push("publication.status is invalid");
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

export function classifyRevision(problem) {
  const text = problem.trim();
  if (/核心问题|中心论点|整体重写|完全重写/.test(text)) return "full-rewrite";
  if (/结构|顺序|重排|章节|大范围/.test(text)) return "structural-revision";
  if (/数据|数字|来源|事实|更新/.test(text)) return "evidence-update";
  return "local-rewrite";
}
