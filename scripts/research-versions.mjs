import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const EXCLUDED_ROOTS = new Set(["sources", "working-drafts", "versions"]);

function walkMutableFiles(reportDir, currentDir = reportDir) {
  const files = [];
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const absolute = path.join(currentDir, entry.name);
    if (currentDir === reportDir && EXCLUDED_ROOTS.has(entry.name)) continue;
    if (entry.isDirectory()) files.push(...walkMutableFiles(reportDir, absolute));
    else if (entry.isFile()) files.push(path.relative(reportDir, absolute));
  }
  return files.sort();
}

function safeLabel(label) {
  return label.trim().toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 36) || "snapshot";
}

function checksum(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

export function createResearchSnapshot(reportDir, label = "snapshot", now = new Date()) {
  if (!fs.existsSync(reportDir)) throw new Error(`Unknown report directory: ${reportDir}`);
  const versionsDir = path.join(reportDir, "versions");
  fs.mkdirSync(versionsDir, { recursive: true });
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  const baseId = `${timestamp}--${safeLabel(label)}`;
  let versionId = baseId;
  let suffix = 2;
  while (fs.existsSync(path.join(versionsDir, versionId))) versionId = `${baseId}-${suffix++}`;
  const versionDir = path.join(versionsDir, versionId);
  const filesDir = path.join(versionDir, "files");
  fs.mkdirSync(filesDir, { recursive: true });
  const entries = [];
  for (const relative of walkMutableFiles(reportDir)) {
    const source = path.join(reportDir, relative);
    const target = path.join(filesDir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    entries.push({ path: relative, sha256: checksum(source), bytes: fs.statSync(source).size });
  }
  const manifest = {
    schemaVersion: "1.0.0",
    versionId,
    label,
    createdAt: now.toISOString(),
    files: entries,
    restorePolicy: "Only listed files are overwritten; sources, working-drafts and other versions are preserved.",
  };
  fs.writeFileSync(path.join(versionDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export function restoreResearchSnapshot(reportDir, versionId) {
  if (!/^[a-zA-Z0-9\u4e00-\u9fff._-]+$/.test(versionId)) throw new Error("Invalid version id");
  const versionDir = path.join(reportDir, "versions", versionId);
  const manifestPath = path.join(versionDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`Unknown version: ${versionId}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const entry of manifest.files) {
    const source = path.join(versionDir, "files", entry.path);
    if (!fs.existsSync(source) || checksum(source) !== entry.sha256) throw new Error(`Snapshot integrity check failed: ${entry.path}`);
  }
  const safety = createResearchSnapshot(reportDir, `before-restore-${versionId}`);
  for (const entry of manifest.files) {
    const source = path.join(versionDir, "files", entry.path);
    const target = path.join(reportDir, entry.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
  return { restored: versionId, safetyVersion: safety.versionId, fileCount: manifest.files.length };
}
