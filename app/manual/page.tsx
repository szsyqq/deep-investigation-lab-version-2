import Link from "next/link";

const commands = [
  ["创建调查", 'npm run research:new -- "调查主题"', "识别研究路线并创建完整底稿目录"],
  ["推进阶段", "npm run research:advance -- <slug> --to=drafting", "更新报告生产阶段"],
  ["内部试读", "npm run research:advance -- <slug> --to=internal-preview", "进入内部预览，不进入正式主页面"],
  ["分析师批准", "npm run research:approve -- <slug> “确认意见”", "记录明确的人工批准"],
  ["正式发布", "npm run research:advance -- <slug> --to=published", "分析师批准后更新正式发布状态"],
  ["校验研究包", "npm run research:validate", "检查底稿、证据、状态和视觉引用"],
  ["测试与构建", "npm test && npm run build", "验证系统规则与网站产物"],
];

const stages = [
  ["01", "接收任务", "识别主体或话题研究，确认范围和反证条件。"],
  ["02", "讨论与研究", "讨论团提出读者问题；搜索、发现新问题并反复补充调查。"],
  ["03", "框架与底稿", "保存来源，形成论点、章节职责和报告框架。"],
  ["04", "文字初稿", "完成一篇以文字为主、前后连贯的完整文章。"],
  ["05", "视觉编辑", "从正文主张出发增加图表；不需要时保留纯文字。"],
  ["06", "审核与修改", "检查相似性、事实、结构，并自然融入分析师意见。"],
  ["07", "预览与发布", "先内部试读，明确批准后进入正式主页面。"],
];

const roadmap = [
  ["近期", "通用报告渲染器", "让所有 publication.json 通过共享组件自动生成页面。"],
  ["近期", "证据采集助手", "自动保存网页、文件、发布时间、摘要和冲突提示。"],
  ["中期", "分析师审阅台", "支持评论、疑问、修改范围判断、版本比较和逐项确认。"],
  ["中期", "内部试读区", "展示试读标签、未解决问题、负责人和审批状态。"],
  ["后期", "经验治理", "从重复人工决策中提出规则更新建议，但必须人工批准。"],
];

export default function ManualPage() {
  return (
    <main className="manual">
      <header className="manual-top">
        <Link href="/">DIL · V2</Link>
        <span>报告生产操作手册</span>
        <Link href="/workbench">开始研究 →</Link>
      </header>

      <section className="manual-hero">
        <span className="kicker">OPERATIONS MANUAL · 02</span>
        <h1>从调查任务，<br />到完整报告。</h1>
        <p>这是一套报告生产系统，不只是图表工具。用户负责提出任务、问题和修改意见；系统负责研究、写作、视觉编辑、审核、内部试读和发布。</p>
        <div className="manual-version">版本 2.1 · 七阶段报告生产流程</div>
      </section>

      <aside className="manual-toc">
        <a href="#use"><b>01</b>整体流程</a>
        <a href="#revision"><b>02</b>人工修改</a>
        <a href="#maintain"><b>03</b>底稿维护</a>
        <a href="#commands"><b>04</b>指令与开发</a>
      </aside>

      <article className="manual-content">
        <section id="use" className="manual-section">
          <div className="chapter-number">01</div>
          <div>
            <span className="kicker">FULL WORKFLOW</span>
            <h2>整体怎么使用</h2>
            <p className="lead">最推荐的入口仍然是自然语言。用户不需要操作七个技术关卡，只需要提出调查任务并在关键节点确认。</p>
            <div className="prompt-card"><span>主体研究</span><p>“调查空客为什么订单创新高，交付和现金流却同时承压。”</p></div>
            <div className="prompt-card"><span>话题研究</span><p>“调查新能源汽车价格战对供应商和消费者的实际影响。”</p></div>
            <ol className="manual-steps">
              {stages.map(([no, title, copy]) => (
                <li key={no}><b>{no} · {title}</b><span>{copy}</span></li>
              ))}
            </ol>
            <div className="manual-callout"><b>关键原则</b><p>研究允许反复返回；图表必须在初稿和论点明确之后增加；内部试读不等于正式发布。</p></div>
          </div>
        </section>

        <section id="revision" className="manual-section">
          <div className="chapter-number">02</div>
          <div>
            <span className="kicker">ANALYST REVISION</span>
            <h2>如何反复修改</h2>
            <p className="lead">分析师可以直接提疑问。系统先判断影响范围，再把修改重新组织进完整文章。</p>
            <div className="feature-grid">
              <div><b>证据更新</b><p>先更新来源和事实，再修改受影响段落、数字和图表。</p></div>
              <div><b>局部改写</b><p>保持章节职责不变，但重写段落并检查前后衔接。</p></div>
              <div><b>结构调整</b><p>先修改报告框架和论点顺序，再重写章节与视觉计划。</p></div>
              <div><b>全文重写</b><p>核心问题发生变化时，重新进入讨论和研究阶段。</p></div>
              <div><b>新增调查</b><p>补同行、历史或反方资料后，重新判断原结论是否成立。</p></div>
              <div><b>分析师确认</b><p>记录接受、修改或拒绝，不能只依赖聊天记忆。</p></div>
            </div>
            <h3 className="subhead">可以直接这样提意见</h3>
            <ul className="check-list">
              <li>“这个判断的证据够不够？请补充反方资料。”</li>
              <li>“新增内容像硬插入，请重新组织这一章。”</li>
              <li>“图表只重复正文，请重新判断是否需要可视化。”</li>
              <li>“我同意这一版，进入内部试读。”</li>
            </ul>
          </div>
        </section>

        <section id="maintain" className="manual-section">
          <div className="chapter-number">03</div>
          <div>
            <span className="kicker">REPORT DOSSIER</span>
            <h2>每篇报告怎么维护</h2>
            <p className="lead">每篇报告拥有自己的底稿目录；网站框架共享，研究内容相互隔离。</p>
            <div className="layer-grid">
              <div><span>研究</span><h3>问题与来源</h3><p><code>discussion.md</code><br /><code>research-notes.md</code><br /><code>sources/</code><br /><code>evidence-ledger.json</code></p></div>
              <div><span>写作</span><h3>框架与成稿</h3><p><code>outline.md</code><br /><code>draft.md</code><br /><code>visual-plan.json</code></p></div>
              <div><span>治理</span><h3>审核与发布</h3><p><code>review.md</code><br /><code>revisions.md</code><br /><code>workflow-state.json</code><br /><code>publication.json</code></p></div>
            </div>
            <div className="maintenance-flow">
              <span>用户意见</span><i>→</i><span>判断修改范围</span><i>→</i><span>更新底稿</span><i>→</i><span>重组完整文章</span><i>→</i><span>重新审核</span>
            </div>
            <ul className="check-list">
              <li>文章事实不在网页组件中直接维护。</li>
              <li>新报告不复制导航、样式和网站框架。</li>
              <li>修改当前报告不得改动其他报告。</li>
              <li>一次人工意见不会自动改写全局规则。</li>
            </ul>
          </div>
        </section>

        <section id="commands" className="manual-section">
          <div className="chapter-number">04</div>
          <div>
            <span className="kicker">COMMANDS & ROADMAP</span>
            <h2>指令与后续开发</h2>
            <div className="command-table">
              {commands.map(([name, command, effect]) => (
                <div className="command-row" key={name}><b>{name}</b><code>{command}</code><span>{effect}</span></div>
              ))}
            </div>
            <div className="roadmap-list">
              {roadmap.map(([phase, title, copy], index) => (
                <div className="roadmap-row" key={title}><span>{phase}</span><b>0{index + 1}</b><div><h3>{title}</h3><p>{copy}</p></div></div>
              ))}
            </div>
            <div className="priority-box"><span>当前优先事项</span><h3>先把一篇真实报告完整走通</h3><p>从讨论、迭代研究和初稿开始，经过多轮分析师修改，再进入内部试读。闭环稳定后再迁移旧报告。</p></div>
          </div>
        </section>
      </article>

      <footer className="manual-footer"><b>Deep Investigation Lab V2</b><Link href="/">返回系统首页 →</Link></footer>
    </main>
  );
}
