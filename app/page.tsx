import Link from "next/link";

const stages = [
  ["01", "接收任务", "自动识别主体研究或话题研究，确认范围与反证条件。"],
  ["02", "讨论与研究", "讨论团从读者、市场和反方视角提出问题，并反复补充调查。"],
  ["03", "框架与底稿", "保存全部来源，形成论点、章节职责和完整报告框架。"],
  ["04", "撰写初稿", "先完成一篇以文字为主、前后连贯、可以独立阅读的文章。"],
  ["05", "视觉编辑", "从正文主张出发，增加真正降低理解成本的图表和解释。"],
  ["06", "审核与修改", "检查相似性、事实和结构，并把分析师意见自然融入全文。"],
  ["07", "预览与发布", "先进入内部试读，分析师明确批准后再发布到正式主页面。"],
];

const patterns = [
  { name: "矛盾背离", use: "领先指标上升，结果指标恶化", form: "对照卡 + 因果链" },
  { name: "因果传导", use: "事件经过多个环节影响结果", form: "Story Flow" },
  { name: "竞争差距", use: "同口径比较两个以上对象", form: "镜像条 / 斜率图" },
  { name: "阶段演化", use: "事件有明确转折与阶段", form: "带结论时间线" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">D2</span>
          <span>Deep Investigation Lab</span>
        </Link>
        <nav>
          <a href="#workflow">研究流程</a>
          <a href="#visuals">表达规范</a>
          <Link href="/reports/airbus">示例报告</Link>
          <Link href="/manual">操作手册</Link>
          <Link className="nav-cta" href="/workbench">开始研究</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="eyebrow">DEEP INVESTIGATION LAB · VERSION 2</div>
        <h1>让调查研究成为<br /><em>可复用的系统</em></h1>
        <p className="hero-copy">
          从一句研究请求出发，自动识别研究类型，建立证据链，规划真正服务论点的视觉表达，
          最终发布到一套不会被每篇文章重写的网站框架。
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/workbench">创建研究任务</Link>
          <Link className="button secondary" href="/reports/airbus">查看结构化报告</Link>
        </div>
        <div className="hero-proof">
          <span><b>2</b> 种研究路线</span>
          <span><b>7</b> 个生产阶段</span>
          <span><b>1</b> 套固定发布框架</span>
        </div>
      </section>

      <section className="statement">
        <p>旧方式从一次搜索直接跳到网页。</p>
        <h2>V2 保存研究、写作与修改的全过程。</h2>
        <div className="flow">
          <span>调查任务</span><i>→</i><span>反复研究</span><i>→</i><span>完整初稿</span><i>→</i><span>审核发布</span>
        </div>
      </section>

      <section className="section" id="workflow">
        <div className="section-heading">
          <div><span className="kicker">REPORT PRODUCTION</span><h2>七阶段报告生产流程</h2></div>
          <p>用户只需要提出任务和反馈。底层证据映射、版本状态和校验由系统处理。</p>
        </div>
        <div className="stage-grid">
          {stages.map(([no, title, copy]) => (
            <article className="stage-card" key={no}>
              <span className="stage-no">{no}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-section" id="visuals">
        <div className="section-heading">
          <div><span className="kicker gold">EDITORIAL VISUALS</span><h2>图表不是装饰，是论证</h2></div>
          <p>每个视觉模块必须回答一个问题：读者看完后，能更快理解哪项主张？</p>
        </div>
        <div className="pattern-list">
          {patterns.map((pattern, index) => (
            <div className="pattern-row" key={pattern.name}>
              <span className="pattern-index">0{index + 1}</span>
              <strong>{pattern.name}</strong>
              <span>{pattern.use}</span>
              <b>{pattern.form}</b>
            </div>
          ))}
        </div>
        <div className="prose-rule">
          <span>关键规则</span>
          <p>证据不足、关系不明确或视觉不能降低理解成本时，系统必须选择 <b>prose-only</b>，不强行画图。</p>
        </div>
      </section>

      <section className="section system-section">
        <div className="section-heading">
          <div><span className="kicker">FIXED PUBLISHING SYSTEM</span><h2>网站只搭一次，文章持续生长</h2></div>
        </div>
        <div className="system-grid">
          <div className="system-block fixed">
            <span>固定层</span>
            <h3>发布框架</h3>
            <ul><li>导航与版式</li><li>图表组件</li><li>引用与脚注</li><li>移动端规则</li></ul>
          </div>
          <div className="system-arrow">+</div>
          <div className="system-block variable">
            <span>内容层</span>
            <h3>研究包</h3>
            <ul><li>讨论与研究笔记</li><li>来源与证据</li><li>完整初稿</li><li>审核与修改记录</li></ul>
          </div>
          <div className="system-arrow">=</div>
          <div className="system-block result">
            <span>输出层</span>
            <h3>稳定报告</h3>
            <ul><li>局部可修改</li><li>历史不受影响</li><li>来源可追溯</li><li>一键构建</li></ul>
          </div>
        </div>
      </section>

      <footer>
        <div><b>Deep Investigation Lab V2</b><span>Research architecture for evidence-led reporting.</span></div>
        <Link href="/manual">阅读操作手册 →</Link>
      </footer>
    </main>
  );
}
