import Link from "next/link";

const commands = [
  ["创建研究", 'npm run research:new -- "调查主题"', "识别 entity/topic，并生成六份独立研究文件"],
  ["校验研究包", "npm run research:validate", "检查文件完整性、证据引用和视觉计划"],
  ["运行测试", "npm test", "验证分类器、研究包隔离与引用关系"],
  ["本地预览", "npm run dev", "启动网站，查看首页、工作台与报告"],
  ["生产构建", "npm run build", "生成可发布的网站产物"],
];

const roadmap = [
  ["近期", "真实报告渲染器", "让 publication.json 自动生成统一报告页面，替代示例硬编码。"],
  ["近期", "证据采集助手", "自动保存网页来源、发布时间、访问时间、摘要和冲突提示。"],
  ["中期", "编辑决策面板", "把接受、修改、拒绝记录为可检索经验，形成稳定偏好。"],
  ["中期", "表达模式扩展", "从当前核心模式扩展到关系网、分布、地理、情景与风险。"],
  ["后期", "报告管理后台", "提供研究状态、版本比较、审批、发布与撤回能力。"],
];

export default function ManualPage() {
  return (
    <main className="manual">
      <header className="manual-top">
        <Link href="/">DIL · V2</Link>
        <span>操作与维护手册</span>
        <Link href="/workbench">开始研究 →</Link>
      </header>

      <section className="manual-hero">
        <span className="kicker">OPERATIONS MANUAL · 01</span>
        <h1>把一句问题，<br />变成一份可靠调查。</h1>
        <p>这不是一套需要背下来的复杂软件。日常使用只需直接告诉 Codex 你想研究什么；其余规则由仓库内的技能、研究协议与校验程序共同执行。</p>
        <div className="manual-version">版本 2.0 · 适用于 Deep Investigation Lab V2</div>
      </section>

      <aside className="manual-toc">
        <a href="#use"><b>01</b>以后怎么使用</a>
        <a href="#maintain"><b>02</b>怎么维护</a>
        <a href="#commands"><b>03</b>指令与功能</a>
        <a href="#roadmap"><b>04</b>后续开发</a>
      </aside>

      <article className="manual-content">
        <section id="use" className="manual-section">
          <div className="chapter-number">01</div>
          <div>
            <span className="kicker">DAILY USE</span>
            <h2>以后怎么使用</h2>
            <p className="lead">最推荐的入口是自然语言，不是命令行。</p>
            <div className="prompt-card">
              <span>主体研究</span>
              <p>“我要生成一份关于空客交付困境的调查研究，重点看订单、供应链和现金流。”</p>
            </div>
            <div className="prompt-card">
              <span>话题研究</span>
              <p>“调查低空经济热潮背后的真实需求、政策推动、主要参与者与风险。”</p>
            </div>
            <ol className="manual-steps">
              <li><b>说清研究问题。</b><span>至少给出对象或话题；重点、时间范围可选。</span></li>
              <li><b>先看研究任务卡。</b><span>确认系统识别为主体研究还是话题研究，范围是否正确。</span></li>
              <li><b>让 Codex 完成证据阶段。</b><span>在问题树和证据账本完成前，不急着要求成文。</span></li>
              <li><b>评审主张和视觉计划。</b><span>重点看“想证明什么”，而不是先挑图表样式。</span></li>
              <li><b>预览、修改、发布。</b><span>修改时指出问题和目的，系统会决定局部改还是重构。</span></li>
            </ol>
            <div className="manual-callout"><b>修改的正确说法</b><p>“新材料改变了供应链章节的结论，请先判断是否需要重排结构，再修改正文。”</p></div>
          </div>
        </section>

        <section id="maintain" className="manual-section">
          <div className="chapter-number">02</div>
          <div>
            <span className="kicker">MAINTENANCE</span>
            <h2>怎么维护</h2>
            <p className="lead">维护对象分成三层。日常改内容，谨慎改规则，尽量少动框架。</p>
            <div className="layer-grid">
              <div><span>高频</span><h3>报告内容层</h3><p><code>content/reports/</code></p><p>每篇报告独立保存研究范围、证据、主张、视觉计划和发布内容。</p></div>
              <div><span>按需</span><h3>研究规则层</h3><p><code>.codex/skills/</code> 与 <code>docs/</code></p><p>只有当多个报告重复出现同类问题时，才更新规则。</p></div>
              <div><span>低频</span><h3>网站框架层</h3><p><code>app/</code></p><p>统一维护导航、排版与组件。不要为单篇报告复制框架。</p></div>
            </div>
            <h3 className="subhead">每次修改的维护顺序</h3>
            <div className="maintenance-flow">
              <span>保留用户反馈</span><i>→</i><span>判断修改深度</span><i>→</i><span>更新对应研究文件</span><i>→</i><span>记录编辑决策</span><i>→</i><span>校验与发布</span>
            </div>
            <ul className="check-list">
              <li>数据变化：更新 evidence-ledger，再更新受影响主张和段落。</li>
              <li>图表不合适：先改 visual-plan，不要直接在页面里硬改。</li>
              <li>新增材料改变结论：先改 claim-map 和章节职责。</li>
              <li>一次修复不得读取或修改其他报告的页面状态。</li>
              <li>人工选择要写进 editorial-state，不能只留在聊天里。</li>
            </ul>
          </div>
        </section>

        <section id="commands" className="manual-section">
          <div className="chapter-number">03</div>
          <div>
            <span className="kicker">COMMANDS & CAPABILITIES</span>
            <h2>有哪些指令和功能</h2>
            <div className="command-table">
              {commands.map(([name, command, effect]) => (
                <div className="command-row" key={name}>
                  <b>{name}</b><code>{command}</code><span>{effect}</span>
                </div>
              ))}
            </div>
            <h3 className="subhead">系统已经具备的功能</h3>
            <div className="feature-grid">
              <div><b>研究路由</b><p>识别主体研究与话题研究，使用不同问题树。</p></div>
              <div><b>证据账本</b><p>让事实、来源、口径和冲突保持可追溯。</p></div>
              <div><b>主张地图</b><p>区分事实、分析、待核实与预测。</p></div>
              <div><b>视觉规划</b><p>先判断关系，再选表达模式和组件。</p></div>
              <div><b>修改分级</b><p>区分数据更新、局部重写、结构调整与全文重写。</p></div>
              <div><b>固定发布</b><p>所有报告共享网站框架，互不污染。</p></div>
            </div>
          </div>
        </section>

        <section id="roadmap" className="manual-section">
          <div className="chapter-number">04</div>
          <div>
            <span className="kicker">ROADMAP</span>
            <h2>后续开发的方面</h2>
            <p className="lead">V2 当前完成的是可靠骨架。后续重点不是增加装饰，而是提高自动化与可审阅性。</p>
            <div className="roadmap-list">
              {roadmap.map(([phase, title, copy], index) => (
                <div className="roadmap-row" key={title}>
                  <span>{phase}</span><b>0{index + 1}</b><div><h3>{title}</h3><p>{copy}</p></div>
                </div>
              ))}
            </div>
            <div className="priority-box">
              <span>建议的下一步</span>
              <h3>先用一篇真实新报告跑完整流程</h3>
              <p>它会暴露分类、证据字段、视觉模式与发布组件中真正需要调整的部分。等完整闭环稳定后，再批量迁移旧报告。</p>
            </div>
          </div>
        </section>
      </article>

      <footer className="manual-footer"><b>Deep Investigation Lab V2</b><Link href="/">返回系统首页 →</Link></footer>
    </main>
  );
}
