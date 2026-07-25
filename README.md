# Deep Investigation Lab V2

Deep Investigation Lab V2 是一套面向 Codex 的完整报告生产系统。它从调查任务开始，经过讨论与反复研究、框架与底稿、文字初稿、视觉编辑、审核与人工修改，最后进入内部试读和正式发布。

- **公开网站**：https://szsyqq.github.io/deep-investigation-lab-version-2/
- **操作手册**：https://szsyqq.github.io/deep-investigation-lab-version-2/manual/
- **内部试读**：https://szsyqq.github.io/deep-investigation-lab-version-2/preview/
- **系统说明**：https://szsyqq.github.io/deep-investigation-lab-version-2/system/
- **产品技术报告**：[Markdown 源稿](docs/product-technical-report.md)
- **排版版技术报告**：[Word 文档](deliverables/Deep_Investigation_Lab_V2_产品技术报告.docx)

## 直接使用

在 Codex 中打开本仓库，然后直接说：

> 我要生成一份关于某公司的调查研究。

或：

> 调查某项政策对行业和消费者的实际影响。

仓库内的 `AGENTS.md` 会引导 Codex 使用 `deep-investigation` 技能，先识别为：

- `entity`：公司、机构、人物、产品等主体研究；
- `topic`：行业、事件、政策、趋势或社会问题研究。

随后按七阶段流程建立讨论记录、研究底稿、证据账本、报告框架、完整初稿、视觉计划、审核记录和发布状态。

## 本地运行

```bash
npm install
npm run dev
```

新建研究包：

```bash
npm run research:new -- "调查空客为什么订单增长但交付承压"
```

校验全部研究包：

```bash
npm run research:validate
npm test
npm run build
```

推进报告生产阶段：

```bash
npm run research:advance -- <slug> --to=drafting
npm run research:advance -- <slug> --to=internal-preview
npm run research:approve -- <slug> "分析师确认意见"
```

## 架构

```text
调查任务
  → 主体/话题识别
  → 讨论团与反复研究
  → 框架、来源与底稿
  → 完整文字初稿
  → 图表与视觉编辑
  → 相似性、事实和结构审核
  → 分析师反复修改
  → 内部试读
  → 正式发布
```

每篇报告只拥有自己的 `content/reports/<slug>/` 目录，其中同时保存供分析师阅读的 Markdown 底稿和供程序读取的 JSON 状态。共享页面、样式和组件位于 `app/`，不会为新文章复制。

## 正式报道发布层

正式首页现在收录 21 篇既有报道，并统一通过动态路由 `/reports/<slug>/` 渲染：

```text
content/published-reports.json      # 正式报道目录与首页元数据
content/published/<slug>/content.json
                                      # 每篇文章的正文、章节与兼容样式
app/reports/[slug]/page.tsx         # 唯一的正式报道路由
components/report/ArticleChrome.tsx # 统一导航、阅读进度与章节目录
components/legal/EobLegalNotice.tsx # 全站唯一 EOB 声明
components/legal/LegalFooter.tsx    # 全部报道共用的注记与法律页脚
```

EOB 同意状态保存在浏览器同源 `localStorage` 中。读者在首页或任一子页面确认一次后，访问同一网站的其他页面不会再次弹出。声明内容只在共享组件中维护。

新增正式报道时，不创建独立 HTML，也不复制导航、法律声明或页脚。新报告先进入 `content/reports/<slug>/` 研究流程；审核批准后，再由发布步骤生成内容包并登记到正式报道目录。

## 与 V1 的边界

V1 仓库始终保持只读、未被修改。V2 将其 21 篇公开报道迁移为只含发布内容的兼容数据包，不复制 V1 的开发结构、底稿或版本归档。迁移工具为 `scripts/import-v1-reports.py`，正式页面仍由 V2 的共享应用统一渲染。
