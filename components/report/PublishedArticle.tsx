import ArticleChrome from "./ArticleChrome";
import LegacyVisualEnhancer from "./LegacyVisualEnhancer";
import LegalFooter from "../legal/LegalFooter";
import { formatReportDate } from "../../lib/format-report-date";
import { prepareArticleContent } from "../../lib/article-content-contract.mjs";
import ArticleNotes from "./ArticleNotes";
import PreviewReviewPanel from "./PreviewReviewPanel";

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
  preview?: boolean;
  openQuestions?: string[];
};

export default function PublishedArticle({ report }: { report: Report }) {
  const content = prepareArticleContent(report.articleHtml);
  return (
    <main className="published-article">
      <style dangerouslySetInnerHTML={{ __html: report.legacyStyles }} />
      <ArticleChrome readingTime={report.readingTime} chapters={report.chapters} />
      <header className="shared-article-hero" id="report-top">
        <div className="shared-article-tags">
          <b>{report.category}</b>
          <span>{report.co}</span>
          {report.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <h1>{report.title}</h1>
        <p>{report.desc}</p>
        <div className="shared-article-byline"><b>调查团队</b><span>{formatReportDate(report.date)} · {report.readingTime}</span></div>
      </header>
      {report.preview && <PreviewReviewPanel questions={report.openQuestions ?? []} />}
      <article className="published-article-body" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
      <ArticleNotes html={content.notesHtml} />
      <LegacyVisualEnhancer />
      <LegalFooter />
    </main>
  );
}
