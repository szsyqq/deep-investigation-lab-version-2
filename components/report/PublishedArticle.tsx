import ArticleChrome from "./ArticleChrome";
import LegacyVisualEnhancer from "./LegacyVisualEnhancer";
import LegalFooter from "../legal/LegalFooter";
import { formatReportDate } from "../../lib/format-report-date";

type Report = {
  title: string;
  co: string;
  category: string;
  tags: string[];
  desc: string;
  date: string;
  trial: boolean;
  readingTime: string;
  articleHtml: string;
  legacyStyles: string;
  chapters: { id: string; label: string }[];
};

export default function PublishedArticle({ report }: { report: Report }) {
  return (
    <main className="published-article">
      <style dangerouslySetInnerHTML={{ __html: report.legacyStyles }} />
      <style>{`
        body { padding-top: 0 !important; }
        .published-article-body { width: 100% !important; max-width: 776px !important; margin: 0 auto !important; padding: 0 28px 80px !important; }
        .published-article-body > * { width: 100%; max-width: 720px !important; margin-left: auto !important; margin-right: auto !important; }
        .published-article-body > .hero { display: none !important; }
        .published-article-body > p { margin-top: 0 !important; margin-bottom: 1.35em !important; color: #262521 !important; font: 18px/1.92 Georgia, "Songti SC", serif !important; text-align: justify; }
        .published-article-body > h2 { margin-top: 58px !important; margin-bottom: 24px !important; padding-top: 20px !important; border-top: 1px solid #c9c2b3 !important; font: 700 29px/1.38 Georgia, "Songti SC", serif !important; }
        .published-article-body .term { color: inherit !important; border: 0 !important; font-weight: inherit !important; cursor: text !important; }
        .published-article-body .term::before, .published-article-body .term::after { display: none !important; content: none !important; }
        .published-article-body .data-card { cursor: default !important; }
        @media (max-width: 700px) {
          .published-article-body { padding: 0 18px 60px !important; }
          .published-article-body > p { font-size: 17px !important; line-height: 1.86 !important; }
          .published-article-body > h2 { font-size: 25px !important; }
        }
      `}</style>
      <ArticleChrome readingTime={report.readingTime} chapters={report.chapters} />
      <header className="shared-article-hero" id="report-top">
        {report.trial && (
          <div className="shared-trial-notice">
            <b>试读</b>
            <span>本文仍处于试读阶段，框架和部分判断可能尚未完成分析师最终审阅，仅供参考。</span>
          </div>
        )}
        <div className="shared-article-tags">
          <b>{report.category}</b>
          <span>{report.co}</span>
          {report.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <h1>{report.title}</h1>
        <p>{report.desc}</p>
        <div className="shared-article-byline"><b>调查团队</b><span>{formatReportDate(report.date)} · {report.readingTime}</span></div>
      </header>
      <article className="published-article-body" dangerouslySetInnerHTML={{ __html: report.articleHtml }} />
      <LegacyVisualEnhancer />
      <LegalFooter />
    </main>
  );
}
