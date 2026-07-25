# Deep Investigation Lab V2

Deep Investigation Lab V2 是一套面向 Codex 的完整报告生产系统。它从调查任务开始，经过讨论与反复研究、框架与底稿、文字初稿、视觉编辑、审核与人工修改，最后进入内部试读和正式发布。

- **公开网站**：https://szsyqq.github.io/deep-investigation-lab-version-2/
- **操作手册**：https://szsyqq.github.io/deep-investigation-lab-version-2/manual/
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

## 与 V1 的边界

V1 仓库未被修改。V2 只参考了 V1 的公开结构与经验，不复制其底稿、版本归档或报告文件。
