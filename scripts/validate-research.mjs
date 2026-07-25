#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { validatePackage } from "./research-core.mjs";

const reportsRoot = path.join(process.cwd(), "content", "reports");
if (!fs.existsSync(reportsRoot)) {
  console.log("No research packages found.");
  process.exit(0);
}
let failed = false;
for (const entry of fs.readdirSync(reportsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const errors = validatePackage(path.join(reportsRoot, entry.name));
  if (errors.length) {
    failed = true;
    console.error(`${entry.name}:`);
    for (const error of errors) console.error(`  - ${error}`);
  } else {
    console.log(`${entry.name}: valid`);
  }
}
process.exit(failed ? 1 : 0);
