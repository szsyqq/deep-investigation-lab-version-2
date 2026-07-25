import Link from "next/link";

const stages = [
  ["01", "识别研究类型", "先判断主体研究或话题研究，生成不同的问题树。"],
  ["02", "建立证据账本", "关键事实逐条绑定来源、日期、口径与可信度。"],
  ["03", "编辑研讨", "从读者、市场、争议与反证四个视角提炼真正问题。"],
  ["04", "形成研究主张", "先固定论点与章节职责，再开始写正文。"],
  ["05", "规划视觉表达", "先判断要证明什么，再选择观点图、数据图或纯正文。"],
  ["06", "核查并发布", "自动检查引用、图表数据、移动端与结构完整性。"],
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
          <span><b>6</b> 道强制关卡</span>
          <span><b>1</b> 套固定发布框架</span>
        </div>
      </section>

      <section className="statement">
        <p>旧方式从正文直接跳到网页。</p>
        <h2>V2 把“研究判断”留在系统里。</h2>
        <div className="flow">
          <span>研究请求</span><i>→</i><span>研究包</span><i>→</i><span>视觉计划</span><i>→</i><span>固定渲染器</span>
        </div>
      </section>

      <section className="section" id="workflow">
        <div className="section-heading">
          <div><span className="kicker">RESEARCH PROTOCOL</span><h2>六阶段研究协议</h2></div>
          <p>每一阶段都有明确输入、输出和通过条件。未通过核查，不进入发布。</p>
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
            <ul><li>论点与章节</li><li>证据账本</li><li>视觉计划</li><li>编辑状态</li></ul>
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
