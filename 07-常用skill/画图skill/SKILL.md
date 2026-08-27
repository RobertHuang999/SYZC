---
name: visualization-lab
description: 可视化路由与选型 skill。用于当用户提出“画图”“做个图”“可视化一下”“生成架构图/流程图/时序图/概念图/草图/正式出图”等需求时，先判断目标表达形式、交付格式、编辑方式和精致程度，再在 `draw-io-diagram-generator`、`drawio`、`excalidraw-diagram-generator`、`fireworks-tech-graph`、`diagram-design`、`architecture-diagram` 之间选择最合适的 skill。也用于用户给出文档、模块、项目、规则材料，希望先找出哪些内容适合可视化、先确认方案再出图时，先路由到 `find-content-to-visual`。用户只说“帮我可视化”但没有指定工具时，也作为统一入口。
---

# Visualization Lab

这个 skill 不直接规定某一种画图实现。

这个 skill 只做一件事：

**当用户要可视化时，先选对前置分析或出图 skill，再进入对应 skill 执行。**

当前统一纳管的 skill 放在当前目录下的 `skills/` 子目录：

- `skills/find-content-to-visual`
- `skills/draw-io-diagram-generator`
- `skills/drawio`
- `skills/excalidraw-diagram-generator`
- `skills/fireworks-tech-graph`
- `skills/diagram-design`
- `skills/architecture-diagram`

## 详细对比

无明确工具、格式、风格要求时，默认目标是：**正式、好看、可展示**。

| Skill | 核心定位 | 主要产物 | 视觉效果 | 可编辑性 | 适合图表 | 适合角色 / 阶段 | 冲突时选择 |
|---|---|---|---|---|---|---|---|
| `find-content-to-visual` | 内容发现与图解规划 | 候选可视化点 + 图解方案 | 无最终图产物 | 高 | 流程、规则、模块结构、职责边界、状态、概念关系 | PM、架构师、技术写作者、需求分析；材料分析、文档梳理、出图前置阶段 | **当用户还没明确“画哪张图”时先选它** |
| `diagram-design` | 版式设计型正式图解 | 自包含 HTML + 内联 SVG | 最强，适合汇报和文档 | 中，改 HTML/SVG | 架构、流程、时序、状态机、ER、时间线、泳道、四象限、树图、组织图、分层、Venn、金字塔 | PM、UX、架构师、技术负责人；PRD、方案评审、汇报 | **无明确要求时默认首选** |
| `fireworks-tech-graph` | 高质量技术图出图引擎 | SVG + PNG | 强，技术表达清晰 | 中，改 SVG/JSON | 架构、数据流、流程、时序、Agent、Memory、RAG、UML、ER、网络拓扑、矩阵、时间线 | 架构师、后端、AI 工程师、技术文档；技术方案、AI 系统说明 | 技术图且要图片产物时优先 |
| `architecture-diagram` | 暗色技术架构展示图 | 自包含 HTML + SVG | 强，偏 dark showcase | 中，改 HTML/SVG | 云架构、基础设施、网络拓扑、安全边界、部署架构 | 架构师、DevOps、安全、售前；架构展示、基础设施说明 | 明确暗色/云/网络/安全时优先 |
| `excalidraw-diagram-generator` | 白板草图和共创图 | `.excalidraw` JSON | 中，草图感强 | 强，Excalidraw 拖拽 | 流程、关系、脑图、架构、DFD、泳道、类图、时序、ER | PM、UX、研发；需求澄清、脑暴、早期讨论 | 明确草图/白板/可拖拽时优先 |
| `draw-io-diagram-generator` | 工程化 draw.io 源文件生成 | `.drawio` / `.drawio.svg` / `.drawio.png` | 中，工程规范优先 | 强，draw.io 长期维护 | 流程、系统架构、时序、ER、UML、网络、BPMN、脑图 | 架构师、后端、QA、技术文档；长期维护型工程文档 | 明确 draw.io / `.drawio` / 后续编辑时优先 |
| `drawio` | draw.io 导出补充 | PNG / SVG / PDF，嵌入 XML | 取决于源文件 | 强，保留 draw.io XML | 已有 `.drawio` 文件导出 | 文档整理、交付物制作 | 仅导出已有 `.drawio` 时使用 |

## 互联网产品开发流程选型

| 场景 | 默认选择 | 原因 |
|---|---|---|
| 文档、模块、项目、规则材料里先找可视化点 | `find-content-to-visual` | 先识别哪里值得画，再决定画法与出图 skill |
| 需求调研、脑暴、共创白板 | `excalidraw-diagram-generator` | 快速、可拖拽、适合讨论 |
| PRD、产品方案、功能结构 | `diagram-design` | 正式、好看、适合评审 |
| 用户流程、业务流程、泳道 | `diagram-design` | 展示效果好；若是草稿再用 Excalidraw |
| UX 信息架构、页面流转 | `diagram-design` | 版式和层级表达更强 |
| 技术方案、架构评审 | `diagram-design` | 默认正式好看；若要 SVG+PNG 技术图，用 `fireworks-tech-graph` |
| AI / Agent / RAG / Memory 图 | `fireworks-tech-graph` | 技术语义和图种覆盖更贴合 |
| ER、UML、接口流程长期维护 | `draw-io-diagram-generator` | 团队后续编辑和维护更稳 |
| 云资源、网络、安全、部署展示 | `architecture-diagram` | 暗色技术展示效果最好 |
| 发布汇报、老板汇报、对外材料 | `diagram-design` | 默认面向展示和阅读 |

## 核心能力

1. 判断用户要的是正式工程图、草图、编辑型源文件、展示型成品，还是高保真技术插图
2. 当用户给的是原始材料而不是明确图需求时，先识别可视化点并形成候选方案
3. 在多个可视化 skill 之间做路由
4. 当用户描述模糊时，先基于现有信息做默认选型
5. 必要时向用户说明为什么选这个 skill
6. 对于 QiaoJi 项目，默认继承 `references/qiaoji-default-style.md` 作为项目级风格预设；非 QiaoJi 项目仍可继续使用各 skill 自带默认风格或按需定制

## 已纳入的 skill 与用途

### 1. `find-content-to-visual`

用途：

- 分析文档、模块、项目、规则、方案材料里哪些内容适合图解
- 从复杂文字中找出流程、规则、状态、结构、职责、概念关系等可视化点
- 给出候选可视化方案、推荐图型、优先级
- 等用户确认后，再交给主 skill 继续路由到最终出图 skill

什么时候优先选：

- 用户还没明确“具体要画哪张图”
- 用户说“先看看哪些地方适合可视化”
- 用户给的是一批材料，希望先做图解规划
- 用户要求“先分析、确认，再出图”

### 2. `draw-io-diagram-generator`

用途：

- 生成或修改 `.drawio` 图
- 面向 draw.io / mxGraph XML 的正式工程图
- 适合流程图、系统架构图、时序图、ER 图、UML 图
- 适合“团队后续还要继续编辑”的场景

什么时候优先选：

- 用户明确要 `draw.io`
- 用户明确要 `.drawio`
- 用户强调“后续继续改图”
- 用户要工程化、结构化、可维护的源文件

### 3. `drawio`

用途：

- 处理 draw.io 图的导出链路
- 把 `.drawio` 导出成 PNG / SVG / PDF
- 更像 draw.io 生态里的导出补充工具

什么时候优先选：

- 用户已经有 `.drawio` 文件
- 用户重点不是建模，而是导出
- 用户明确要 draw.io 导出脚本能力

### 4. `excalidraw-diagram-generator`

用途：

- 生成 `.excalidraw` 图
- 适合草图风、白板风、脑暴图、关系图、概念图
- 适合轻量流程、轻量架构、思维导图、课堂讨论图

什么时候优先选：

- 用户要草图感
- 用户要白板感
- 用户要脑图 / 概念图
- 用户想要后续人工拖拽微调

### 5. `fireworks-tech-graph`

用途：

- 直接输出生产级技术图
- 适合架构图、数据流图、时序图、Agent 图、Memory 图、ER 图、网络拓扑
- 主要产物是 `SVG + PNG`
- 偏“技术图出图引擎”

什么时候优先选：

- 用户要直接出图
- 用户要高质量技术图
- 用户要 `SVG + PNG`
- 用户描述的是 AI 系统、Agent、Memory、RAG、服务拓扑、UML、ER 等技术结构

### 6. `diagram-design`

用途：

- 生成更强调版式设计的图解
- 支持架构、流程、时序、状态机、ER、时间线、泳道图、四象限、树图、组织图、分层图、Venn、金字塔等
- 主要产物是自包含 HTML 文件

什么时候优先选：

- 用户除了“画图”还强调“版式”“设计感”“信息图表达”
- 用户要独立 HTML 图页
- 用户要多种信息图语法，不只是纯技术架构

### 7. `architecture-diagram`

用途：

- 生成暗色技术架构图
- 适合系统、基础设施、云资源、网络、安全边界、拓扑关系
- 主要产物是自包含 HTML + SVG

什么时候优先选：

- 用户要暗色风格
- 用户要云 / 网络 / 安全 / 基础设施架构图
- 用户希望图像偏 polished technical showcase

## 能力选择

### 0. 用户先要“找出该画什么”

如果用户给的是文档、模块、项目、规则材料，并要求：

- 先分析哪些内容适合可视化
- 先给图解方案
- 先确认再出图

则先选 `find-content-to-visual`。

它负责：

- 识别可视化点
- 推荐图型
- 让用户确认范围

确认后，再回到本 skill 继续为该点选择最终出图 skill。

### 1. 用户明确指定工具或格式

优先级最高。按用户指定走：

- 提到 `draw.io`、`.drawio`、`mxGraph`、要可编辑 draw.io 文件
  - 选 `draw-io-diagram-generator`
- 提到 `Excalidraw`、草图风、白板风、脑图、想要可手工拖拽改图
  - 选 `excalidraw-diagram-generator`
- 提到 SVG、PNG 技术图、系统图、流程图、概念图、要“直接出图”
  - 优先考虑 `fireworks-tech-graph`
- 提到独立 HTML 文件、内联 SVG、产品图、信息图、流程/状态/ER/时间线/泳道/四象限等多图种
  - 优先考虑 `diagram-design`
- 提到暗色架构图、基础设施图、云/网络/安全拓扑图
  - 优先考虑 `architecture-diagram`

### 2. 用户没有指定工具，但指定了“图的气质”

- 要**正式工程编辑源文件**，后续团队继续改
  - 选 `draw-io-diagram-generator`
- 要**快速草图 / 白板感 / 脑暴感**
  - 选 `excalidraw-diagram-generator`
- 要**可直接用于文档、汇报、截图的高质量技术图**
  - 在 `fireworks-tech-graph`、`diagram-design`、`architecture-diagram` 中继续选

### 3. 在展示型成品 skill 里继续路由

- 用户要的是**通用技术图**：
  - 架构图
  - 数据流图
  - 时序图
  - Agent / Memory 图
  - 概念图
  - UML / ER / 网络拓扑
  - 并且期望输出 `SVG + PNG`
  - 选 `fireworks-tech-graph`

- 用户要的是**更广义的图解设计**：
  - 流程图
  - 状态机
  - 时间线
  - 泳道图
  - 四象限
  - 树图
  - 组织图
  - 金字塔 / 漏斗
  - 分层图
  - Venn
  - 并且更强调版式、设计系统、HTML 交付
  - 选 `diagram-design`

- 用户要的是**暗色、架构导向、基础设施导向**：
  - 系统架构
  - 网络拓扑
  - 云资源
  - 安全边界
  - 基础设施分层
  - 并且适合用单个自包含 HTML+SVG 页面承载
  - 选 `architecture-diagram`

### 4. 两个 draw.io skill 的区别

优先这样选：

- `draw-io-diagram-generator`
  - 更适合“从请求到 ready-to-open `.drawio` 文件”的完整工作流
  - 覆盖图种更多
  - 强调 draw.io / mxGraph XML 正确性
  - 默认作为 draw.io 场景首选

- `drawio`
  - 当任务重点是：
    - 已有 `.drawio` 文件导出
    - 需要 PNG / SVG / PDF 导出
    - 使用自带导出脚本
  - 作为 draw.io 导出型补充

如果只是“帮我做一个 draw.io 图”，默认用 `draw-io-diagram-generator`。

## 默认决策规则

用户没有指定工具、格式、风格时，默认这样选：

1. **正式、好看、可展示** → `diagram-design`
2. **技术图且明确要 SVG + PNG 图片产物** → `fireworks-tech-graph`
3. **暗色基础设施 / 云 / 网络 / 安全架构图** → `architecture-diagram`
4. **草图感 / 白板感 / 脑暴共创** → `excalidraw-diagram-generator`
5. **要长期编辑源文件 / 团队维护** → `draw-io-diagram-generator`
6. **已有 `.drawio` 且只要导出** → `drawio`

补充前置规则：

- 若用户尚未明确要画什么，而是要“先分析材料找出可视化点”
  - 先走 `find-content-to-visual`
  - 等确认后，再按上面规则选最终出图 skill

冲突时先看硬约束：

| 硬约束 | 选择 |
|---|---|
| 明确要先分析文档 / 模块 / 项目内容，再确认出图 | `find-content-to-visual` |
| 明确 `draw.io`、`.drawio`、mxGraph、长期可编辑 | `draw-io-diagram-generator` |
| 明确已有 `.drawio` 导出 PNG / SVG / PDF | `drawio` |
| 明确 Excalidraw、草图、白板、可拖拽 | `excalidraw-diagram-generator` |
| 明确暗色、云、网络、安全、基础设施展示 | `architecture-diagram` |
| 明确 SVG + PNG 技术图、AI / Agent / RAG / Memory | `fireworks-tech-graph` |
| 没有以上硬约束，且用户要好看正式 | `diagram-design` |

## QiaoJi 默认风格

当工作区属于 QiaoJi，且用户没有明确要求自定义风格时，默认使用：

- `references/qiaoji-default-style.md`

这份 preset 优先级高于各子 skill 的首次风格 gate，用于把项目已有设计事实沉淀为统一出图默认值。

如果用户明确要求“按项目设计风格出图”“用默认风格”“按 docs/design 的样式”，直接使用该 preset，不再追问配色和字体。

## 使用方式

当本 skill 被触发时，按下面流程工作：

1. 先判断用户要的是“先找可视化点”，还是“已经知道要画什么”
2. 若是前者，先选 `find-content-to-visual`
3. 若是后者，在其余 6 个出图 skill 里选一个主 skill
4. 读取被选 skill 的 `SKILL.md`
5. 按被选中的 skill 去执行分析或具体出图

如果用户没有指定工具，就按本 skill 的默认决策规则路由。

## 协同规则

选中具体 skill 后：

1. 明确告诉自己将要使用哪个 skill
2. 读取 `skills/<skill-name>/SKILL.md`
3. 只进入一个主 skill，避免同时混用多个画图 skill 造成输出风格冲突
4. 只有在明确需要“导出链路补充”时，才把 `drawio` 作为 `draw-io-diagram-generator` 的辅助参考

## 不要这样做

- 不要在没判断图的目标之前直接开始画
- 不要同时把同一张图交给多个风格 skill 混合实现
- 不要把 `drawio` 和 `draw-io-diagram-generator` 当成完全重复；前者更偏导出，后者更偏生成
- 不要忽略用户对“是否可编辑”“是否要源文件”“是否要 PNG/SVG/HTML”的要求

## 输出要求

在进入具体画图 skill 前，先形成一个简短决策：

- 选中的 skill 名
- 选择原因
- 预期交付格式

若用户没有要求解释，则内部完成该决策即可，不必冗长说明。

## 目录约束

- 当前 skill 自己只负责选型和路由
- `find-content-to-visual` 负责前置内容发现与图解方案
- 具体画图能力来自 `skills/` 子目录中的各个 skill
- 不再依赖额外的外部 `tool-selection.md`
