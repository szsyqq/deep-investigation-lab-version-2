import Link from "next/link";
import reports from "../content/published-reports.json";
import ReportDirectory from "../components/home/ReportDirectory";

export default function Home() {
  return (
    <main className="news-home">
      <div className="news-ribbon">独立研究 · 公开资料 · 事实核验</div>
      <header className="news-masthead">
        <div className="news-utility">
          <span>2026年7月25日 · 星期六</span>
          <nav aria-label="辅助导航">
            <Link href="/preview">内部试读</Link>
            <Link href="/system">研究系统</Link>
            <Link href="/manual">操作手册</Link>
          </nav>
        </div>
        <div className="news-nameplate">
          <span>THE INVESTIGATIVE DESK</span>
          <h1>深度调查档案室</h1>
          <p>Deep Investigation Lab</p>
        </div>
        <div className="news-sections">
          <span>公司</span><span>产业</span><span>资本</span><span>政策</span><span>技术</span><span>社会议题</span>
        </div>
      </header>

      <section className="news-front">
        <div className="news-lead">
          <div className="news-kicker">编辑部说明</div>
          <h2>让事实先于结论，<br />让调查成为可以复核的档案。</h2>
          <p className="news-deck">这里发布基于公开文件、监管资料、公司披露与可交叉验证信息形成的深度报道。每篇文章先经过研究、完整写作、视觉编辑、事实审核和内部试读，再进入正式首页。</p>
          <div className="news-byline">调查团队 · THE INVESTIGATION</div>
        </div>
      </section>

      <section className="news-index">
        <div className="news-index-heading">
          <div><span>PUBLISHED INVESTIGATIONS</span><h2>全部正式报道</h2></div>
          <p>公司、产业、资本、政策与技术领域的公开调查和深度报道。</p>
        </div>
        <ReportDirectory reports={reports} />
      </section>

      <footer className="news-footer">
        <div><b>深度调查档案室</b><span>基于公开信息的独立研究与深度报道</span></div>
        <div><span>THE INVESTIGATIVE DESK</span></div>
      </footer>
    </main>
  );
}
