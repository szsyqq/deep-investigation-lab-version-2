import ArticleChrome from "./ArticleChrome";
import LegacyVisualEnhancer from "./LegacyVisualEnhancer";
import LegalFooter from "../legal/LegalFooter";
import { formatReportDate } from "../../lib/format-report-date";

type Report = {
  title: string;
  co: string;
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
        .published-article-body { max-width: 920px !important; margin: 0 auto !important; padding: 0 28px 80px !important; }
        .published-article-body > .hero { display: none !important; }
        @media (max-width: 700px) {
          .published-article-body { padding: 0 18px 60px !important; }
          .published-article-body > .hero { padding-top: 38px !important; }
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
