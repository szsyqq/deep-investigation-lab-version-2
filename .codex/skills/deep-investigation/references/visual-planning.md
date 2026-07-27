# Visual planning

Read `/docs/visual-protocol.md` for the project contract.

## Pattern selection

- `contradiction`: indicators point in conflicting directions.
- `causality`: one or more mechanisms transmit effects.
- `comparison`: objects share a valid metric and definition.
- `trend`: continuous change is central to the claim.
- `timeline`: sequence and turning points matter more than magnitude.
- `distribution`: shape, concentration or composition matters.
- `network`: relationships among actors are the claim.
- `risk`: probability, impact or scenarios are supported.
- `prose-only`: visual form adds no explanatory value.

## Reject a visual when

- its title only names a topic;
- it repeats numbers already clear in one sentence;
- it lacks a valid comparison or denominator;
- it cannot cite evidence IDs;
- it implies causation from correlation;
- it depends on decorative animation;
- mobile rendering makes the relationship harder to read.

Prefer an annotated story graphic when the claim is relational. Prefer a conventional statistical chart only when magnitude, ranking, distribution, or change is the evidence.

## Document-stage placement markers

During prose drafting, mark the intended insertion point before producing the visual. Use a Markdown blockquote so the analyst can read it in `draft.md` while the shared publication compiler omits it from article prose.

```markdown
> **【图表规划 V1｜视觉类型】**
>
> **插入位置：** 本段之后。  
> **画面内容：** 将呈现的数据、对象、阶段或节点。  
> **要说明的问题：** 读者看完应理解的编辑主张。  
> **视觉类型：** 关系模式和候选组件。  
> **证据：** E1、E2。  
> **不采用：** 容易误导或增加理解成本的形式。  
> **制作状态：** 位置与主张已确认，暂不制作成图。
```

Rules:

- Place the marker exactly where the visual should interrupt or support the prose.
- Give the marker and `visual-plan.json` the same visual ID.
- Describe the claim, not merely “show data.”
- Mark `prose-only` when no visual lowers comprehension cost; do not insert an empty placeholder.
- Keep planned visuals out of `publication.json.sections[].visualIds` until visual production is approved.
- When a visual is produced, update the status and verify data, title, source, mobile layout, and accessibility before publication.
