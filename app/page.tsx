import Link from "next/link";
import reports from "../content/published-reports.json";

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
        <aside className="news-preview-box">
          <span>编辑部工作区</span>
          <h3>未发布报告先在试读页审阅</h3>
          <p>测试稿、待核实内容和分析师修改版本不会进入正式报道列表。确认无误后，才由内部试读转为正式发布。</p>
          <Link href="/preview">进入内部试读页 →</Link>
        </aside>
      </section>

      <section className="news-index">
        <div className="news-index-heading">
          <div><span>PUBLISHED INVESTIGATIONS</span><h2>全部正式报道</h2></div>
          <p>{reports.length} 篇公开调查已经接入同一套发布系统。首页、文章导航、法律声明和注记统一维护，新增报道不再重复开发页面。</p>
        </div>
        <div className="news-report-list">
          {reports.map((report, index) => (
            <Link className="news-report-card" href={report.href} key={report.slug}>
              <div className="news-report-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="news-report-copy">
                <div className="news-report-meta"><b>{report.co}</b><span>{report.tags.join(" · ")}</span>{report.trial && <i>试读标记</i>}</div>
                <h3>{report.title}</h3>
                <p>{report.desc}</p>
                <div className="news-report-foot"><span>{report.readingTime}</span><b>阅读全文 →</b></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="news-method-note">
        <div><span>EDITORIAL STANDARD</span><h2>报道风格保持不变，生产系统退到幕后。</h2></div>
        <p>网站正面呈现的是文章、事实与调查判断。研究流程、内部工具和操作说明保留在附加页面，不再占据主页面。</p>
        <Link href="/system">查看研究与发布系统 →</Link>
      </section>

      <footer className="news-footer">
        <div><b>深度调查档案室</b><span>基于公开信息的独立研究与深度报道</span></div>
        <div><Link href="/preview">内部试读</Link><Link href="/system">系统说明</Link><Link href="/manual">操作手册</Link></div>
      </footer>
    </main>
  );
}
