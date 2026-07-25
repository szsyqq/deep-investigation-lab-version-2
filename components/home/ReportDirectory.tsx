"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatReportDate } from "../../lib/format-report-date";

type Report = {
  slug: string;
  href: string;
  title: string;
  desc: string;
  co: string;
  category: string;
  tags: string[];
  trial: boolean;
  date: string;
  readingTime: string;
};

const CATEGORY_ORDER = ["全部", "公司", "产业", "资本", "政策", "技术", "社会议题"];

export default function ReportDirectory({ reports }: { reports: Report[] }) {
  const [category, setCategory] = useState("全部");
  const visibleReports = useMemo(
    () => category === "全部" ? reports : reports.filter((report) => report.category === category),
    [category, reports],
  );

  return (
    <>
      <div className="news-filter" aria-label="按报道类型筛选">
        {CATEGORY_ORDER.map((item) => {
          const available = item === "全部" || reports.some((report) => report.category === item);
          return (
            <button
              className={category === item ? "active" : ""}
              disabled={!available}
              key={item}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="news-report-list" aria-live="polite">
        {visibleReports.map((report) => {
          const index = reports.findIndex((item) => item.slug === report.slug);
          return (
            <Link className="news-report-card" href={report.href} key={report.slug}>
              <div className="news-report-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="news-report-copy">
                <div className="news-report-meta">
                  <span className="news-report-category">{report.category}</span>
                  <b>{report.co}</b>
                  {report.trial && <span className="news-report-status">试读</span>}
                  <div className="news-report-tags">{report.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
                <h3>{report.title}</h3>
                <p>{report.desc}</p>
                <div className="news-report-foot"><span>发布于 {formatReportDate(report.date)} · {report.readingTime}</span><b>阅读全文 →</b></div>
              </div>
            </Link>
          );
        })}
        {visibleReports.length === 0 && <p className="news-empty">该分类暂时没有公开报道。</p>}
      </div>
    </>
  );
}
