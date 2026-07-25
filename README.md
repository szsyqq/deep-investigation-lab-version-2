# Deep Investigation Lab V2

Deep Investigation Lab V2 是一套面向 Codex 的结构化调查研究与发布系统。它把研究、编辑、视觉规划和网页渲染拆开，避免每篇文章重新生成网站，也避免一次修图破坏历史报告。

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

随后按固定流程建立问题树、证据账本、研究主张、视觉计划、编辑状态和发布清单。

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

## 架构

```text
用户请求
  → 研究类型识别
  → 问题树与证据计划
  → 证据账本
  → 编辑研讨与反证
  → 研究主张与章节职责
  → 视觉计划
  → 固定网站渲染器
  → 发布校验
```

每篇报告只拥有自己的 `content/reports/<slug>/` 目录。共享页面、样式和组件位于 `app/`，不会为新文章复制。

## 与 V1 的边界

V1 仓库未被修改。V2 只参考了 V1 的公开结构与经验，不复制其底稿、版本归档或报告文件。
