import Link from "next/link";

export default function PreviewReviewPanel({ questions }: { questions: string[] }) {
  return (
    <aside className="preview-review-panel" aria-labelledby="preview-review-title">
      <div className="preview-review-head">
        <span>试读 · 等待分析师确认</span>
        <Link href="/preview">← 返回试读列表</Link>
      </div>
      <h2 id="preview-review-title">试读后需要确认的问题</h2>
      <p>以下集中列出待确认判断、尚不确定的内容及可能存在的问题。除本框外，文章按正式报道效果渲染。</p>
      {questions.length ? (
        <ol>{questions.map((question) => <li key={question}>{question}</li>)}</ol>
      ) : (
        <p className="preview-review-empty">当前没有待确认问题。</p>
      )}
    </aside>
  );
}
