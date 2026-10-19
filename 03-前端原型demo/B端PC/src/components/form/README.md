# 表单辅助文案组件

真源条文见 [AGENTS.md](../../../../../AGENTS.md) **4.1.3**；标注/打点场景见 [标注juan-prototype-annotation SKILL.md](../../../../../07-常用skill/标注juan-prototype-annotation/SKILL.md) **3.3**。

| 组件 | 用途 |
| :--- | :--- |
| `ProductFieldHint` | 上线用户可见说明（无规则编号） |
| `PrototypeSpecCallout` | 原型规格对照（含 P/R 编号，非上线文案） |

模块文案写入 `{feature}/lib/*-ui-labels.ts` 或 `shared/*/*-ui-labels.ts`，命名 `*_USER_*` / `*_SPEC_*`。
