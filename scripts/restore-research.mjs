#!/usr/bin/env node
import path from "node:path";
import { restoreResearchSnapshot } from "./research-versions.mjs";

const [slug, versionId, confirmation] = process.argv.slice(2);
if (!slug || !versionId || confirmation !== "--confirm") {
  console.error("Usage: npm run research:restore -- <slug> <version-id> --confirm");
  console.error("Restore creates a safety snapshot first, then overwrites only captured files.");
  process.exit(1);
}

try {
  const reportDir = path.join(process.cwd(), "content", "reports", slug);
  const result = restoreResearchSnapshot(reportDir, versionId);
  console.log(`${slug}: restored ${result.restored} (${result.fileCount} files)`);
  console.log(`Safety snapshot: ${result.safetyVersion}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
