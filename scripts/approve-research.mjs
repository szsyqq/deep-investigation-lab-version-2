#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [slug, ...noteParts] = process.argv.slice(2);
if (!slug) {
  console.error("Usage: npm run research:approve -- <slug> [approval note]");
  process.exit(1);
}

const reportDir = path.join(process.cwd(), "content", "reports", slug);
const workflowPath = path.join(reportDir, "workflow-state.json");
const publicationPath = path.join(reportDir, "publication.json");
if (!fs.existsSync(workflowPath) || !fs.existsSync(publicationPath)) {
  console.error(`Unknown or incomplete report package: ${slug}`);
  process.exit(1);
}

const now = new Date().toISOString();
const workflow = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
const publication = JSON.parse(fs.readFileSync(publicationPath, "utf8"));
workflow.analystApproval = { status: "approved", approvedAt: now, note: noteParts.join(" ") };
workflow.updatedAt = now;
publication.status = "approved";
fs.writeFileSync(workflowPath, `${JSON.stringify(workflow, null, 2)}\n`);
fs.writeFileSync(publicationPath, `${JSON.stringify(publication, null, 2)}\n`);
console.log(`${slug}: analyst approval recorded; report status is approved`);
