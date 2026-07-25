#!/usr/bin/env node
import path from "node:path";
import { createPackage } from "./research-core.mjs";

const args = process.argv.slice(2);
const request = args.filter((arg) => !arg.startsWith("--slug=")).join(" ").trim();
const slug = args.find((arg) => arg.startsWith("--slug="))?.slice(7);

if (!request) {
  console.error('Usage: npm run research:new -- "调查请求" [--slug=report-slug]');
  process.exit(1);
}

try {
  const result = createPackage(process.cwd(), request, slug);
  console.log(`Created ${result.type} research package: ${path.relative(process.cwd(), result.reportDir)}`);
  console.log("Next: complete brief.json, convene the discussion group in discussion.md, then begin iterative research.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
