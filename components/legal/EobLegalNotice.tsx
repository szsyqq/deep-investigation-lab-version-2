"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "deep-investigation-eob-v1";

export default function EobLegalNotice() {
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setAccepted(window.localStorage.getItem(CONSENT_KEY) === "accepted");
      } catch {
        setAccepted(false);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && !accepted) document.body.classList.add("eob-locked");
    else document.body.classList.remove("eob-locked");
    return () => document.body.classList.remove("eob-locked");
  }, [accepted, ready]);

  function acceptNotice() {
    if (!checked) return;
    try {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // The current page can still proceed when storage is unavailable.
    }
    setAccepted(true);
  }

  if (!ready || accepted) return null;

  return (
    <div className="eob-overlay" role="dialog" aria-modal="true" aria-labelledby="eob-title">
      <div className="eob-dialog">
        <header><span id="eob-title">EOB 法律声明 · LEGAL NOTICE</span></header>
        <div className="eob-body">
          <section><h2>一、资料性质</h2><p>本档案室内容为基于公开资料形成的独立研究与分析，不构成任何投资建议、要约、招揽或推荐。</p></section>
          <section><h2>二、信息来源</h2><p>文章使用公司披露、监管文件、年报、审计资料、新闻及其他公开信息。虽然我们力求准确、完整和及时，但不对资料的绝对准确性或完整性作出保证。</p></section>
          <section><h2>三、风险与判断</h2><p>文中事实、分析和条件性判断可能随新信息而变化。涉及证券、基金或其他资产时，读者应独立判断并自行承担决策风险。</p></section>
          <section><h2>四、人工智能辅助</h2><p>部分研究、整理、表达和技术工作可能使用人工智能工具辅助完成；正式内容仍需经过来源核验和人工审核。</p></section>
          <section><h2>五、用户知情同意</h2><p>勾选并继续浏览，即表示您已经阅读并理解以上声明。该选择会保存在当前浏览器中，之后访问首页或文章页不再重复提示。</p></section>
        </div>
        <footer className="eob-actions">
          <label><input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />我已阅读并同意上述声明</label>
          <button type="button" disabled={!checked} onClick={acceptNotice}>确认并进入</button>
        </footer>
      </div>
    </div>
  );
}
