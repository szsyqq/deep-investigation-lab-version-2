#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const [slug, inputPath] = process.argv.slice(2);
if (!slug || !inputPath) {
  console.error("Usage: npm run research:import-json -- <slug> <absolute-source-json-path>");
  process.exit(1);
}

const reportDir = path.join(process.cwd(), "content", "reports", slug);
const publicationPath = path.join(reportDir, "publication.json");
if (!fs.existsSync(publicationPath)) throw new Error(`Unknown research package: ${slug}`);
if (!path.isAbsolute(inputPath) || !fs.existsSync(inputPath)) throw new Error("Source JSON must be an existing absolute path.");

JSON.parse(fs.readFileSync(inputPath, "utf8"));
const destinationRelative = path.join("sources", "notes", "article.json");
const destination = path.join(reportDir, destinationRelative);
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(inputPath, destination);

const publication = JSON.parse(fs.readFileSync(publicationPath, "utf8"));
publication.sourceJsonPath = destinationRelative;
fs.writeFileSync(publicationPath, `${JSON.stringify(publication, null, 2)}\n`);
console.log(`${slug}: imported a portable JSON source at ${destinationRelative}`);
