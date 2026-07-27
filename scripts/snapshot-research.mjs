#!/usr/bin/env node
import path from "node:path";
import { createResearchSnapshot } from "./research-versions.mjs";

const [slug, ...labelParts] = process.argv.slice(2);
if (!slug) {
  console.error("Usage: npm run research:snapshot -- <slug> [version label]");
  process.exit(1);
}

try {
  const reportDir = path.join(process.cwd(), "content", "reports", slug);
  const manifest = createResearchSnapshot(reportDir, labelParts.join(" ") || "manual");
  console.log(`${slug}: saved ${manifest.versionId} (${manifest.files.length} files)`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
