import Link from "next/link";

export default function AirbusPreview() {
  return (
    <main className="report">
      <header className="report-header">
        <Link href="/preview">← 返回内部试读页</Link>
        <span>内部试读 · 示例研究包 · 尚未正式发布</span>
      </header>
      <div className="report-masthead">
        <b>调查团队 · THE INVESTIGATION</b>
        <span>2026年7月25日 · 编辑部试读</span>
      </div>
      <section className="report-hero">
        <span className="tag">主体研究 / 航空制造</span>
        <h1>订单堆成山，飞机为何交不出去？</h1>
        <p className="report-deck">空客的需求从未如此强劲，但发动机短缺把订单、交付和现金流拉向了三个不同方向。</p>
        <div className="report-meta">当前状态：内部预览 · 分析师尚未批准正式发布 · 数据仅用于展示 V2 表达结构</div>
      </section>
      <article className="report-body">
        <div className="metric-strip">
          <div className="metric"><span>积压订单</span><b>9,037</b><small>架 · 需求端</small></div>
          <div className="metric"><span>一季度交付</span><b>114</b><small>架 · 结果端</small></div>
          <div className="metric"><span>自由现金流</span><b>−€2.5bn</b><small>经营后果</small></div>
        </div>
        <p>这三个数字不应该被拆成三张互不相干的趋势图。文章真正要解释的，是需求增长为何没有转化为交付与现金。</p>
        <h2>增长没有变成结果</h2>
        <div className="chapter-claim">本章核心判断：订单是需求证明，但在供应受限时，它不会自动成为当期收入。</div>
        <div className="story-graphic">
          <span>PATTERN · 矛盾背离 + 因果传导</span>
          <div className="story-flow">
            <div><b>订单上升</b><small>需求强劲，积压规模扩大</small></div><i>→</i>
            <div><b>发动机瓶颈</b><small>关键部件供应与维修互相挤压</small></div><i>→</i>
            <div><b>交付受限</b><small>完工飞机无法按计划确认交付</small></div><i>→</i>
            <div><b>现金承压</b><small>库存占用与回款延后同时发生</small></div>
          </div>
          <div className="source-line">来源：示例数据。正式报告中每个节点必须关联 evidence-ledger.json 的证据编号。</div>
        </div>
        <p>视觉模块的任务不是重复正文，而是把正文中的传导关系压缩成一次可读的判断。读者先看到关系，再回到文章寻找机制、例外和证据。</p>
        <h2>修改从结构开始</h2>
        <div className="chapter-claim">新增内容若改变论点或章节职责，先更新研究主张和视觉计划；只有局部事实变化时，才修改对应段落。</div>
        <p>这条规则避免“把一段供应链分析硬塞进现有正文”。系统会先判断新材料属于证据补充、论点变化还是结构变化，然后决定局部更新、重排章节或整体重写。</p>
      </article>
    </main>
  );
}
