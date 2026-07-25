"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const topicSignals = ["行业", "现象", "政策", "趋势", "市场", "供应链", "事件", "问题", "生态", "赛道"];

export default function Workbench() {
  const [request, setRequest] = useState("调查空客为什么订单创新高，交付和现金流却同时承压");
  const [submittedRequest, setSubmittedRequest] = useState(request);
  const result = useMemo(() => {
    const topic = topicSignals.some((word) => submittedRequest.includes(word)) && !/公司|企业|集团|空客|腾讯|宝马/.test(submittedRequest);
    return topic
      ? {
          type: "话题研究 · TOPIC",
          title: "围绕问题建立多主体证据网络",
          questions: ["问题的边界与时间范围是什么？", "涉及哪些关键主体与利益关系？", "数据趋势、政策变化和争议点分别是什么？", "有哪些反例会推翻当前判断？"],
        }
      : {
          type: "主体研究 · ENTITY",
          title: "围绕主体建立经营与外部验证链",
          questions: ["主体如何定义自己，真实收入来自哪里？", "业务、财务、治理和技术之间有何张力？", "监管、客户、同行与数据如何交叉验证？", "哪些事实可能推翻核心论点？"],
        };
  }, [submittedRequest]);

  return (
    <main className="workbench">
      <Link className="back-link" href="/">← 返回首页</Link>
      <header className="workbench-header">
        <span className="kicker">INTERACTION DEMO · 非正式工作台</span>
        <h1>调查启动卡演示</h1>
        <p>这里仅演示研究路线识别和首轮问题卡，不会真正启动网络研究或写入报告。正式研究目前仍由 Codex 仓库工作流执行。</p>
      </header>
      <section className="planner">
        <div className="planner-input">
          <label htmlFor="request">你想调查什么？</label>
          <textarea id="request" value={request} onChange={(event) => setRequest(event.target.value)} />
          <button type="button" onClick={() => setSubmittedRequest(request)}>生成调查启动卡</button>
        </div>
        <div className="planner-output" aria-live="polite">
          <span className="result-type">{result.type}</span>
          <h2>{result.title}</h2>
          <small>已根据任务生成：{submittedRequest}</small>
          <p>下一步将由主编、分析师、调查员、反方审稿人、数据编辑和读者代表共同形成研究议程，不直接写结论。</p>
          <ol className="question-list">{result.questions.map((q) => <li key={q}>{q}</li>)}</ol>
        </div>
      </section>
      <p className="workbench-note">命令行入口：运行 <code>npm run research:new -- “你的研究请求”</code>，即可生成包含讨论、底稿、初稿、审核与发布状态的独立研究包。</p>
    </main>
  );
}
