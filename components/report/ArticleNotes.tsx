export default function ArticleNotes({ html }: { html: string }) {
  if (!html) return null;
  return <aside className="shared-article-notes" aria-label="文章注记" dangerouslySetInnerHTML={{ __html: html }} />;
}
