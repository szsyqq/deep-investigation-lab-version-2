import Link from "next/link";

export default function PreviewIndex() {
  return (
    <main className="preview-home">
      <div className="preview-ribbon">● 内部试读 · 非正式发布 · 请勿引用</div>
      <header className="preview-header">
        <Link href="/">← 返回正式报道首页</Link>
        <span>EDITORIAL PREVIEW DESK</span>
        <Link href="/system">系统说明</Link>
      </header>
      <section className="preview-hero">
        <span>INTERNAL REVIEW</span>
        <h1>编辑部试读页</h1>
        <p>这里集中展示尚未正式发布的报告。测试数据、待核实问题和分析师修改意见可能仍在变化；只有完成审核并明确批准后，文章才会进入正式首页。</p>
      </section>
      <section className="preview-list">
        <div className="preview-list-head"><h2>当前试读</h2><span>1 篇</span></div>
        <Link className="preview-card" href="/preview/airbus-example">
          <div className="preview-status"><b>内部预览</b><span>等待分析师确认</span></div>
          <div>
            <span className="preview-tag">主体研究 · 航空制造 · 示例数据</span>
            <h3>订单堆成山，飞机为何交不出去？</h3>
            <p>用于检查报道排版、观点图和修改机制的示例研究包，不具备正式发布条件。</p>
          </div>
          <strong>打开试读 →</strong>
        </Link>
      </section>
      <section className="preview-rules">
        <h2>进入正式首页之前</h2>
        <ul><li>关键事实与来源检查完成</li><li>相似性、重复与结构审核完成</li><li>图表与移动端显示正常</li><li>关键待核实问题已经处理</li><li>分析师明确批准正式发布</li></ul>
      </section>
    </main>
  );
}
