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

export const SOURCE_WORKPAPER_DIRS = ["primary", "secondary", "notes"];

export const STAGE_WORKPAPER_DIRS = [
  "01-intake",
  "02-research",
  "03-outline",
  "04-prose",
  "05-visuals",
  "06-review",
  "07-preview",
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
  const sourcesDir = path.join(reportDir, "sources");
  fs.mkdirSync(sourcesDir, { recursive: true });
  for (const name of SOURCE_WORKPAPER_DIRS) fs.mkdirSync(path.join(sourcesDir, name), { recursive: true });
  fs.writeFileSync(path.join(sourcesDir, "README.md"), `# 资料底稿

按证据编号保存可合法留存的一手文件、必要摘录、元数据和研究笔记。

- \`primary/\`：年报、公告、监管文件、公司正式材料等一手资料；
- \`secondary/\`：新闻、研究报告和同行资料的元数据、合法摘录或链接记录；
- \`notes/\`：检索日志、来源摘要、冲突与局限说明。

不要整篇复制受版权保护的新闻报道。每份底稿应标明来源链接、访问日期和对应证据编号。
`);
  const workpapersDir = path.join(reportDir, "working-drafts");
  fs.mkdirSync(workpapersDir, { recursive: true });
  for (const name of STAGE_WORKPAPER_DIRS) fs.mkdirSync(path.join(workpapersDir, name), { recursive: true });
  fs.writeFileSync(path.join(workpapersDir, "README.md"), `# 阶段样稿

按工作流阶段保存过程版本，不覆盖上一阶段。

- \`01-intake/\`：任务拆解与范围样稿；
- \`02-research/\`：研究回合、时间线和事实卡；
- \`03-outline/\`：主张地图与提纲版本；
- \`04-prose/\`：引言、章节和完整文字样稿；
- \`05-visuals/\`：图表数据、图片底稿、草图与说明；
- \`06-review/\`：审稿标注和修改对照；
- \`07-preview/\`：内部预览快照与发布候选记录。

建议文件名包含日期或版本号，例如 \`2026-07-26-outline-v1.md\`。视觉底稿需同时保留数据来源和编辑主张。
`);
  fs.mkdirSync(path.join(reportDir, "versions"), { recursive: true });
  const markdownFiles = {
    "discussion.md": "# 讨论团与问题蒸馏记录\n\n> 第一轮有效资料收集后填写。每条观察标注 `verified`、`inference`、`lead` 或 `unknown`；事实与推断绑定证据编号，线索不得直接进入正文。\n\n## 读者视角\n\n## 市场或系统视角\n\n## 争议与反证视角\n\n## 核心追问（3—5个）\n\n每个追问写明：读者价值、事实张力、现有证据编号、证据缺口、反证条件和可回答状态（ready / needs-research / currently-unanswerable）。\n\n## 下一轮研究任务\n",
    "research-notes.md": "# 研究过程记录\n\n每一轮记录：新发现、来源编号、冲突、仍待回答的问题，以及是否需要进入下一轮。\n",
    "outline.md": "# 报告框架\n\n## 核心论点\n\n## 章节设计\n\n每章写明：章节问题、核心结论、作用机制、证据编号、反证或替代解释、证据边界，以及与前后章节的关系。\n",
    "draft.md": "# 当前完整初稿\n\n> 初稿以连贯文字为主。证据不足时返回研究阶段，不以模糊表达填补。需要视觉时，在准确段落后加入“图表规划”引用框，说明位置、内容、问题、类型、证据、不采用形式和制作状态，并与 visual-plan.json 使用同一编号。\n",
    "review.md": "# 审核记录\n\n> 审核顺序：准确性与来源可追溯 → 专业解释与证据边界 → 可读性、易读性和读者吸引力 → 视觉与移动端。前一层不合格，后一层不能抵消。\n\n## 来源可访问性、事实和引用\n\n逐项核对数字、引语、事件、时间、比较口径与证据编号；不得编造、静默外推或把推断写成事实。\n\n## 专业解释与证据边界\n\n## 结构、叙事与读者吸引\n\n逐章检查：问题、机制、证据、反证或替代解释、阶段性结论及与下一章的关系。\n\n## 可读性、易读性与信息密度\n\n## 图表与移动端\n\n## 待处理问题\n",
    "revisions.md": "# 人工修改记录\n\n每次记录：分析师意见、修改级别、受影响范围、最终处理、确认状态和经验保留范围（单篇、候选模式、共享编辑规则或共享框架规则）。\n",
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
  const sourcesDir = path.join(reportDir, "sources");
  if (!fs.existsSync(sourcesDir)) errors.push("missing sources directory");
  for (const name of SOURCE_WORKPAPER_DIRS) {
    if (!fs.existsSync(path.join(sourcesDir, name))) errors.push(`missing sources/${name} directory`);
  }
  const workpapersDir = path.join(reportDir, "working-drafts");
  if (!fs.existsSync(workpapersDir)) errors.push("missing working-drafts directory");
  for (const name of STAGE_WORKPAPER_DIRS) {
    if (!fs.existsSync(path.join(workpapersDir, name))) errors.push(`missing working-drafts/${name} directory`);
  }
  if (!fs.existsSync(path.join(reportDir, "versions"))) errors.push("missing versions directory");
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
