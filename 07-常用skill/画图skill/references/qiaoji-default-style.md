# QiaoJi 默认可视化风格预设

本文件沉淀 QiaoJi 项目在 `visualization-lab` 下的默认出图风格。

目标：

- 让后续可视化默认继承 `docs/design/` 已成立的设计事实
- 避免每次出图重复询问颜色、字体、圆角与气质
- 为需要风格输入的子 skill 提供统一上游 preset

## 事实来源

- `E:/tech/FullStack_devlope/QiaoJi/docs/design/n2p3-design-system-strategy.md`
- `E:/tech/FullStack_devlope/QiaoJi/docs/design/l4m5-design-token-spec.md`
- `E:/tech/FullStack_devlope/QiaoJi/docs/design/foundations/e6f7-color-system.md`
- `E:/tech/FullStack_devlope/QiaoJi/docs/design/foundations/g8h9-typography.md`
- `E:/tech/FullStack_devlope/QiaoJi/docs/design/foundations/i0j1-spacing-radius.md`

## 风格结论

QiaoJi 的默认图表风格不是暗色霓虹、不是通用企业后台蓝灰、也不是高饱和大面积紫色 AI 皮肤。

应保持以下气质：

- 清楚、轻盈、稳定
- 浅底高可读
- 主锚点使用聪颖蓝 `#3087F5`
- AI 只在局部使用 cyan / violet / mint 作为智能信号
- 正文优先阅读舒适度，不让炫光或渐变承载长文本
- 圆角偏柔和，最小不低于 `8px`

## 默认 Token

### 颜色

| 角色 | 值 | 说明 |
|---|---|---|
| `paper` | `#F8FAFC` | 页面浅底，默认背景 |
| `paper-2` | `#FFFFFF` | 卡片 / 图表容器背景 |
| `paper-reading` | `#FCFBF9` | 阅读型补充浅底，可选 |
| `ink` | `#1E293B` | 主文字 / 主描边 |
| `muted` | `#475569` | 次文字 / 默认箭头 |
| `soft` | `#64748B` | 辅助标签 / 弱说明 |
| `rule` | `rgba(30,41,59,0.12)` | 细边框 / 分隔线 |
| `rule-strong` | `#DBEAFE` | 冷浅蓝边界 / 重点容器 |
| `accent` | `#3087F5` | 全局主锚点，默认重点色 |
| `accent-tint` | `rgba(48,135,245,0.10)` | 主锚点浅染色 |
| `link` | `#2563EB` | 请求 / 外部调用 / 链接流向 |
| `ai-cyan` | `#22D3EE` | AI 生成中 / 连接感 |
| `ai-violet` | `#7C3AED` | AI 推理 / 智能端点 |
| `ai-mint` | `#22C55E` | AI 已整理 / 可沉淀 |
| `ai-amber` | `#F59E0B` | AI 轻提醒 / 等待确认 |
| `success` | `#10B981` | 成功 / 成长 / 掌握 |
| `danger` | `#EF4444` | 错误 / 阻断 |

### 字体

#### 中文 / 通用 Sans

```css
font-family: "PingFang SC", "HarmonyOS Sans", "Microsoft YaHei", sans-serif;
```

#### 英文 / 标题 / 主要标签

```css
font-family: "Nunito", "Quicksand", "Outfit", "PingFang SC", "HarmonyOS Sans", "Microsoft YaHei", sans-serif;
```

#### 技术型次标签

```css
font-family: "Outfit", "Nunito", "PingFang SC", "HarmonyOS Sans", "Microsoft YaHei", sans-serif;
```

### 排版层级

- 页面标题：`24px`, `700`
- 区块标题：`20px`, `600`
- 节点标题：`16px`, `600`
- 正文 / 主节点标签：`14px`, `400-600`
- 次标签 / 元信息：`12px`, `400-500`
- 极小标注：`11px`, `400`

### 间距与圆角

- 间距基线：`4px`
- 常用节奏：`8 / 16 / 24 / 32 / 48`
- 最小圆角：`8px`
- 标准卡片圆角：`16px`
- 大容器圆角：`24px`
- 胶囊：`999px`

## 图表语义映射

### 默认重点规则

- 一个图里只允许 `1-2` 个主焦点使用 `accent`
- AI 信号色只用于 AI / 生成 / 推理 / 可沉淀节点
- 非 AI 主流程不要整图泛紫

### 节点建议

| 节点类型 | 填充 | 描边 |
|---|---|---|
| 主焦点 / 主入口 | `accent-tint` | `accent` |
| 普通模块 / API / 步骤 | `#FFFFFF` | `ink` |
| 数据 / 状态 / 存储 | `rgba(30,41,59,0.05)` | `muted` |
| 外部系统 | `rgba(30,41,59,0.03)` | `rgba(30,41,59,0.28)` |
| AI 生成中 | `rgba(34,211,238,0.10)` | `#22D3EE` |
| AI 推理 / 高阶智能 | `rgba(124,58,237,0.08)` | `#7C3AED` |
| AI 已整理 / 可沉淀 | `rgba(34,197,94,0.08)` | `#22C55E` |
| 提醒 / 等待确认 | `rgba(245,158,11,0.10)` | `#F59E0B` |
| 错误 / 风险 | `rgba(239,68,68,0.08)` | `#EF4444` |

### 箭头建议

| 流向类型 | 颜色 | 说明 |
|---|---|---|
| 主流程 / 主请求 | `#3087F5` | 默认主链路 |
| 外部调用 / Link | `#2563EB` | API / 请求 / 跳转 |
| 数据写入 / 状态推进 | `#475569` | 内部结构流 |
| AI 生成 / 智能流 | `#22D3EE` | D 层智能信号 |
| 补偿 / 异步 / 恢复 | `#7C3AED` 或 dashed muted | 仅局部使用 |
| 风险 / 鉴权 / 安全 | `#EF4444` 或 dashed | 需同时配文案 |

## 使用规则

1. 用户未明确指定风格时，QiaoJi 项目默认优先使用本 preset。
2. `diagram-design` 走浅底高可读路线，优先继承本 preset。
3. `fireworks-tech-graph` 若未指定 style，优先使用 QiaoJi 对应 style。
4. `architecture-diagram` 只在明确需要暗色 / 基础设施架构图时使用，但颜色和字体仍应尽量贴近本 preset。
5. 状态、错误、AI 提示不能只靠颜色，仍需文案、图标、边界或结构变化。

## 不要这样做

- 不要默认使用深色霓虹或满屏紫色
- 不要把渐变和 glow 铺成正文背景
- 不要让 JetBrains Mono 成为全图唯一字体
- 不要把所有重要节点都刷成主蓝
- 不要把 AI 点缀色提升为全局主色
