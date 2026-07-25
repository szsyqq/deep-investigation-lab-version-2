#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { PUBLICATION_STATUSES, WORKFLOW_STAGES } from "./research-core.mjs";

const [slug, ...args] = process.argv.slice(2);
const target = args.find((arg) => arg.startsWith("--to="))?.slice(5);
if (!slug || !target) {
  console.error("Usage: npm run research:advance -- <slug> --to=<workflow-stage|publication-status>");
  process.exit(1);
}

const reportDir = path.join(process.cwd(), "content", "reports", slug);
const workflowPath = path.join(reportDir, "workflow-state.json");
const publicationPath = path.join(reportDir, "publication.json");
if (!fs.existsSync(workflowPath) || !fs.existsSync(publicationPath)) {
  console.error(`Unknown or incomplete report package: ${slug}`);
  process.exit(1);
}

const workflow = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
const publication = JSON.parse(fs.readFileSync(publicationPath, "utf8"));
const now = new Date().toISOString();

if (WORKFLOW_STAGES.includes(target)) {
  const targetIndex = WORKFLOW_STAGES.indexOf(target);
  workflow.currentStage = target;
  workflow.stages = WORKFLOW_STAGES.map((id, index) => ({
    id,
    status: index < targetIndex ? "completed" : index === targetIndex ? "in-progress" : "pending",
  }));
  workflow.updatedAt = now;
  fs.writeFileSync(workflowPath, `${JSON.stringify(workflow, null, 2)}\n`);
  console.log(`${slug}: workflow advanced to ${target}`);
} else if (PUBLICATION_STATUSES.includes(target)) {
  if (target === "published" && workflow.analystApproval?.status !== "approved") {
    console.error("Formal publication requires analyst approval. Run research:approve first.");
    process.exit(1);
  }
  publication.status = target;
  if (target === "published") publication.publishedAt = now;
  fs.writeFileSync(publicationPath, `${JSON.stringify(publication, null, 2)}\n`);
  console.log(`${slug}: publication status changed to ${target}`);
} else {
  console.error(`Invalid target: ${target}`);
  process.exit(1);
}
