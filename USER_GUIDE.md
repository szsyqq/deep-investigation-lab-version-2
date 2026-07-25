# Deep Investigation Lab V2 操作手册

## 1. 最简单的使用方式

在 Codex 中打开本仓库，直接说：

> 我要生成一份关于某公司的调查研究。

或：

> 调查某项政策对行业和消费者的实际影响。

系统会自动识别主体研究或话题研究，并按七个阶段推进：

1. 接收任务与研究分类；
2. 讨论团确定读者问题并反复研究；
3. 形成框架和每篇报告独立的底稿；
4. 撰写以文字为主的完整初稿；
5. 增加真正解释论点的图表；
6. 完成相似性、事实、结构审核和人工修改；
7. 进入内部试读，批准后正式发布。

## 2. 人工修改怎么说

分析师可以直接指出疑问，不需要指定技术文件，例如：

- “这个结论的证据够不够？”
- “补充同行企业的情况，再判断原来的结论是否成立。”
- “这段虽然增加了内容，但读起来像硬插入，请重新组织整章。”
- “图表只重复了正文，没有解释关系，请重新规划。”
- “我同意这一版，进入内部试读。”
- “试读没有问题，批准正式发布。”

系统会先判断是证据更新、局部改写、结构调整还是全文重写，再修改底稿和完整文章。

## 3. 每篇报告怎么维护

所有材料位于 `content/reports/<slug>/`：

- `discussion.md`：讨论团和读者问题；
- `research-notes.md`：反复研究过程；
- `sources/`：来源底稿；
- `outline.md`：报告框架；
- `draft.md`：当前完整文章；
- `visual-plan.json`：图表与表达计划；
- `review.md`：审核记录；
- `revisions.md`：人工意见和处理结果；
- `workflow-state.json`：当前生产阶段；
- `publication.json`：内部预览和正式发布状态。

不要在网页组件中直接修改文章事实，也不要为一篇新报告复制整套网站。

## 4. 常用命令

```bash
# 创建研究包
npm run research:new -- "你的研究请求"

# 更新生产阶段
npm run research:advance -- <slug> --to=drafting

# 进入内部试读
npm run research:advance -- <slug> --to=internal-preview

# 正式发布（必须先获得分析师批准）
npm run research:approve -- <slug> "分析师确认意见"
npm run research:advance -- <slug> --to=published

# 校验、测试和本地预览
npm run research:validate
npm test
npm run dev
```

## 5. 系统如何“学习”

系统不从聊天中偷偷修改规则。每次分析师接受、修改或拒绝建议，都写入 `revisions.md` 和 `editorial-state.json`。

只有当多篇报告反复出现同一种人工决定时，才形成规则更新建议，由人工审核后更新技能或表达模式。这种机制可以积累经验，又不会因为一次特殊修改污染所有报告。
