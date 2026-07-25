#!/usr/bin/env python3
"""Import V1 published reports as content-only packages for the V2 shared renderer."""

from __future__ import annotations

import html as html_lib
import json
import re
import sys
from pathlib import Path


def clean_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", "", value)
    return html_lib.unescape(re.sub(r"\s+", " ", value)).strip()


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/import-v1-reports.py /path/to/V1")

    repo = Path(sys.argv[1]).resolve()
    portal = repo / "portal"
    metadata = json.loads((portal / "reports.json").read_text(encoding="utf-8"))
    output_root = Path(__file__).resolve().parents[1] / "content" / "published"
    output_root.mkdir(parents=True, exist_ok=True)
    registry = []

    for item in metadata:
        href = item.get("href", f"reports/{item['id']}/index.html")
        slug = Path(href).parts[-2]
        source = portal / href
        raw = source.read_text(encoding="utf-8")

        container_marker = '<div class="container">'
        start = raw.find(container_marker)
        boundaries = [
            position
            for marker in ("<footer", '<div class="consent-overlay"', "<!-- 合规弹窗", "<script")
            if (position := raw.find(marker, start)) >= 0
        ]
        end = min(boundaries, default=-1)
        if start < 0 or end < 0:
            raise RuntimeError(f"Cannot locate article container/footer in {source}")

        body = raw[start + len(container_marker):end].strip()
        body = re.sub(r"<script\b[^>]*>[\s\S]*?</script>", "", body, flags=re.I)
        body = re.sub(r'<div class="disclaimer"[^>]*>[\s\S]*?</div>', "", body, flags=re.I)
        body = re.sub(r"<!--[\s\S]*?-->", "", body)
        body = re.sub(r"</div>\s*$", "", body, count=1)
        styles = "\n".join(re.findall(r"<style[^>]*>([\s\S]*?)</style>", raw, flags=re.I))

        chapters = []
        for attrs, inner in re.findall(r"<h2\b([^>]*)>([\s\S]*?)</h2>", body, flags=re.I):
            match = re.search(r'\bid=["\']([^"\']+)["\']', attrs, flags=re.I)
            if match:
                chapters.append({"id": match.group(1), "label": clean_text(inner)})

        report_dir = output_root / slug
        report_dir.mkdir(parents=True, exist_ok=True)
        content = {
            "slug": slug,
            "articleHtml": body,
            "legacyStyles": styles,
            "chapters": chapters,
            "sourceRepository": "szsyqq/DeepInvestigationLab",
            "sourcePath": str(source.relative_to(repo)),
        }
        (report_dir / "content.json").write_text(
            json.dumps(content, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        registry.append(
            {
                **item,
                "slug": slug,
                "href": f"/reports/{slug}",
                "sourceRepository": "szsyqq/DeepInvestigationLab",
            }
        )

    root = output_root.parent
    (root / "published-reports.json").write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    imports = []
    entries = []
    for index, item in enumerate(registry):
        name = f"report{index}"
        imports.append(f'import {name} from "./{item["slug"]}/content.json";')
        entries.append(f'  "{item["slug"]}": {name},')
    module = "\n".join(imports) + "\n\nexport const publishedReportContent = {\n" + "\n".join(entries) + "\n} as const;\n"
    (output_root / "index.ts").write_text(module, encoding="utf-8")
    print(f"Imported {len(registry)} reports into {output_root}")


if __name__ == "__main__":
    main()
