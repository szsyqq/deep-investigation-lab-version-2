import Link from "next/link";

const stages = [
  ["01", "接收任务", "识别主体研究或话题研究。"],
  ["02", "讨论与研究", "形成读者问题并反复补充调查。"],
  ["03", "框架与底稿", "保存来源、主张和章节职责。"],
  ["04", "文字初稿", "先完成一篇完整、连贯的文章。"],
  ["05", "视觉编辑", "从正文主张出发增加图表。"],
  ["06", "审核与修改", "检查事实、结构并处理分析师意见。"],
  ["07", "预览与发布", "先内部试读，批准后正式发布。"],
];

export default function SystemPage() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">D2</span><span>Deep Investigation Lab</span></Link>
        <nav><Link href="/preview">内部试读</Link><Link href="/manual">操作手册</Link><Link className="nav-cta" href="/workbench">启动卡演示</Link></nav>
      </header>
      <section className="hero">
        <div className="eyebrow">SYSTEM · SUPPORTING PAGE</div>
        <h1>研究系统放在幕后，<br /><em>报道留在台前</em></h1>
        <p className="hero-copy">这一页说明报告怎样从调查任务经过研究、写作、图表、审核和人工修改，最后进入内部试读与正式发布。它是附加说明页，不再承担媒体首页职能。</p>
        <div className="hero-actions"><Link className="button primary" href="/manual">阅读操作手册</Link><Link className="button secondary" href="/">返回报道首页</Link></div>
      </section>
      <section className="section">
        <div className="section-heading"><div><span className="kicker">REPORT PRODUCTION</span><h2>七阶段报告生产流程</h2></div><p>分析师用自然语言沟通；底稿、证据、状态和校验由系统在后台维护。</p></div>
        <div className="stage-grid">{stages.map(([no,title,copy]) => <article className="stage-card" key={no}><span className="stage-no">{no}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <footer><div><b>Deep Investigation Lab V2</b><span>Supporting system for evidence-led reporting.</span></div><Link href="/">返回报道首页 →</Link></footer>
    </main>
  );
}
