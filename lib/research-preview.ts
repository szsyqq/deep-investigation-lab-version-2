import fs from "node:fs";
import path from "node:path";

export type PreviewPublication = {
  reportId: string;
  title: string;
  deck: string;
  previewLabel: string;
  status: string;
  company?: string;
  category?: string;
  tags?: string[];
  sections?: PreviewSection[];
  sourceJsonPath?: string;
  jsonChartPlacements?: Record<string, string[]>;
};

export type PreviewJsonArticle = {
  title: string;
  author?: string;
  date?: string;
  引言?: string;
  导语?: { title?: string; text?: string };
  chapters?: Record<string, { title?: string; text?: string }>;
  尾声?: { title?: string; text?: string };
  footnotes?: Record<string, string>;
};

export type PreviewEvidence = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt: string;
  summary: string;
};

export type PreviewVisual = {
  id: string;
  claimId: string;
  pattern: string;
  component: string;
  title: string;
  readerTakeaway: string;
  evidenceIds: string[];
  data: Record<string, unknown>;
  sourceNote: string;
};

export type PreviewSection = {
  id: string;
  title: string;
  visualIds: string[];
};

export type PreviewReport = PreviewPublication & {
  draft: string;
  researchType: string;
  asOf: string;
  openQuestions: string[];
  evidence: PreviewEvidence[];
  visuals: PreviewVisual[];
  sections: PreviewSection[];
  jsonArticle?: PreviewJsonArticle;
  jsonChartPlacements?: Record<string, string[]>;
};

const reportsRoot = path.join(process.cwd(), "content", "reports");
const previewStatuses = new Set(["internal-preview", "analyst-confirmation"]);

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function resolveSourceJsonPath(reportDir: string, sourceJsonPath: string) {
  return path.isAbsolute(sourceJsonPath) ? sourceJsonPath : path.join(reportDir, sourceJsonPath);
}

export function getPreviewSlugs() {
  if (!fs.existsSync(reportsRoot)) return [];
  return fs.readdirSync(reportsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => {
      const publicationPath = path.join(reportsRoot, slug, "publication.json");
      if (!fs.existsSync(publicationPath)) return false;
      const publication = readJson<PreviewPublication>(publicationPath);
      return previewStatuses.has(publication.status);
    });
}

export function getPreviewPublications() {
  return getPreviewSlugs()
    .map((slug) => readJson<PreviewPublication>(path.join(reportsRoot, slug, "publication.json")))
    .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
}

export function getPreviewReport(slug: string): PreviewReport | null {
  if (!getPreviewSlugs().includes(slug)) return null;
  const reportDir = path.join(reportsRoot, slug);
  const publication = readJson<PreviewPublication>(path.join(reportDir, "publication.json"));
  const brief = readJson<{ researchType: string; asOf: string }>(path.join(reportDir, "brief.json"));
  const editorial = readJson<{ openQuestions?: string[] }>(path.join(reportDir, "editorial-state.json"));
  const evidenceLedger = readJson<{ items: PreviewEvidence[] }>(path.join(reportDir, "evidence-ledger.json"));
  const visualPlan = readJson<{ visuals: PreviewVisual[] }>(path.join(reportDir, "visual-plan.json"));
  const sourceJsonPath = publication.sourceJsonPath ? resolveSourceJsonPath(reportDir, publication.sourceJsonPath) : undefined;
  const jsonArticle = sourceJsonPath && fs.existsSync(sourceJsonPath)
    ? readJson<PreviewJsonArticle>(sourceJsonPath)
    : undefined;
  return {
    ...publication,
    draft: fs.readFileSync(path.join(reportDir, "draft.md"), "utf8"),
    researchType: brief.researchType,
    asOf: brief.asOf,
    openQuestions: editorial.openQuestions ?? [],
    evidence: evidenceLedger.items,
    visuals: visualPlan.visuals,
    sections: publication.sections ?? [],
    jsonArticle,
    jsonChartPlacements: publication.jsonChartPlacements,
  };
}
