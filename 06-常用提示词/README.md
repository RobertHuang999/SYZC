# 提示词库 (Prompts)

本文件夹用于存放**常用的提示词（改）**，便于复用和优化。

---

## 📍 使用场景

### 什么时候用这个文件夹？

- ✅ 有经常重复使用的提示词
- ✅ 发现某个提示词效果特别好，想保存下来
- ✅ 团队协作，需要统一提示词规范
- ✅ 优化AI输出质量，积累最佳实践

### 为什么需要prompts文件夹？

> [!NOTE]
> 好的提示词是提升AI输出质量的关键。将高效的提示词沉淀下来，可以：
>
> - 提高工作效率（不用每次重新编写）
> - 保证输出质量（使用验证过的提示词）
> - 团队协作（统一提示词规范）

---

## 📁 推荐文件结构

### 按用途分类

```
prompts/
├── prd-prompts.md           # PRD相关提示词
├── analysis-prompts.md      # 业务分析提示词
├── demo-prompts.md          # 前端Demo生成提示词
├── review-prompts.md        # 文档Review提示词
└── custom-prompts.md        # 自定义提示词
```

---

## 📋 提示词模板

### 基本结构

```markdown
## [提示词名称]

**用途**：[描述此提示词的用途]

**适用场景**：

- 场景1
- 场景2

**提示词**：
```

[具体的提示词内容]

```

**输入示例**：
[如何使用这个提示词]

**输出示例**：
[期望的AI输出]

**注意事项**：
- [注意事项1]
- [注意事项2]

**版本记录**：
- V1.0 (2026-02-01): 初始版本
- V1.1 (2026-02-05): 优化XX部分
```

---

## 💡 提示词优化建议

### 1. 明确目标

清晰说明期望的输出：

❌ **不好**：

```
帮我写个PRD
```

✅ **好**：

```
基于 @templates/prd-template.md 模板，
为"库存盘点"功能生成一份完整的PRD文档，
必须包含：字段清单、业务规则、状态流转、异常处理
```

---

### 2. 提供上下文

引用相关文档，让AI理解背景：

✅ **好**：

```
@context/04-business-logic.md
@context/05-term-glossary.md
@templates/prd-template.md

请基于上述业务逻辑和术语规范，
生成"采购订单"的PRD
```

---

### 3. 指定格式

明确输出格式要求：

✅ **好**：

```
请用表格展示字段清单，必须包含以下列：
- 字段名（中文）
- 字段名（英文）
- 类型
- 必填
- 说明
```

---

### 4. 给出示例

提供示例帮助AI理解：

✅ **好**：

```
请生成业务规则，格式如下：

| 规则编号 | 规则描述 | 适用场景 |
|---------|---------|---------|
| R01 | 订单总金额必须大于0 | 订单提交时 |
| R02 | 库存不足时不允许出库 | 出库单审核时 |
```

---

### 5. 分步骤

复杂任务分解为多个步骤：

✅ **好**：

```
请分3步完成：

Step 1: 分析用户需求，输出RDD（需求定义卡片）
Step 2: 基于RDD设计数据模型（ER图+字段清单）
Step 3: 基于数据模型生成完整PRD
```

---

## 🎯 常用提示词场景

### PRD生成

```markdown
@templates/prd-template.md
@context/05-term-glossary.md

请基于上述模板和术语规范，为"[功能名称]"生成完整PRD，
必须包含：

1. 功能清单
2. 字段说明（表格形式）
3. 业务规则（编号R01, R02...）
4. 状态流转图（Mermaid）
5. 异常处理
6. 权限说明

输出到：drafts/YYYY-MM-DD-[功能名称]/PRD.md
```

---

### 业务流程分析

```markdown
@context/04-business-logic.md
@templates/business-process-template.md

请分析"[业务流程名称]"的完整流程：

1. 绘制As-Is流程图（现状）
2. 识别流程痛点
3. 设计To-Be流程图（优化后）
4. 输出影响范围分析

使用Mermaid格式绘制流程图
输出到：analysis/process-simulation/
```

---

### 字段清单生成

```markdown
@templates/field-list-template.md

调用 data-modeler Skill，
为"[实体名称]"设计字段清单，
必须包含：

- 审计字段（created_by, updated_at等）
- 精确的类型定义（Decimal(18,2)而非Double）
- 完整的枚举值列表
- 索引建议（[INDEX]标注）

输出表格格式
```

---

### 前端Demo生成

```markdown
@templates/frontend-style-guide.md
@prds/[模块名]/field-list.md

请生成"[页面名称]"的React组件代码：

1. TypeScript接口定义（基于字段清单）
2. Mock数据（真实业务场景）
3. 列表页组件（list.tsx）
4. 详情页组件（detail.tsx）

必须符合Design System规范
输出到：drafts/[模块名]/demo/
```

---

### 文档Review

```markdown
@prds/[模块名]/PRD.md

请Review这份PRD，检查：

1. 逻辑完整性（状态流转是否闭环）
2. 数据规范性（字段类型是否精确）
3. 权限与安全（是否包含权限说明）
4. 异常处理（是否覆盖边界情况）

输出检查报告和改进建议
```

---

## 🔄 提示词迭代流程

### 1. 初次使用

创建新提示词，测试效果：

```markdown
## 生成字段清单

**提示词**：
```

请生成XX的字段清单

```

```

---

### 2. 优化迭代

根据AI输出优化提示词：

```markdown
## 生成字段清单 (V1.1)

**提示词**：
```

@templates/field-list-template.md

请严格按照模板格式，生成XX的字段清单，
必须包含：类型、必填、枚举值

```

```

---

### 3. 沉淀最佳实践

验证效果好的提示词，保存到prompts/：

```bash
# 保存到提示词库
保存为 prompts/prd-prompts.md
```

---

## ⚠️ 注意事项

- **版本管理**：提示词优化后更新版本号
- **场景说明**：明确适用场景，避免滥用
- **定期评审**：每季度检查提示词是否还有效
- **团队共享**：好的提示词分享给团队成员

---

## 🎓 学习建议

### 新手上路

1. 从简单的提示词开始（生成字段清单）
2. 观察AI输出，找到不足
3. 优化提示词，再次测试
4. 验证效果好后保存

### 高级玩家

1. 结合@引用，提供完整上下文
2. 使用Skills（data-modeler, edge-case-detector）
3. 分步骤编排复杂任务
4. 建立团队提示词库

---

## 🔗 参考资源

- **Workflows**：`.agent/workflows/`（查看workflow中的提示词结构）
- **Skills**：`.agent/skills/`（学习Skill中的提示词设计）
- **Templates**：`templates/`（配合模板使用提示词）

---

## 📝 待创建文件

**说明**：以下文件为建议创建的文件，可根据实际使用情况创建和完善：

- `prd-prompts.md` - PRD相关提示词
- `analysis-prompts.md` - 业务分析提示词
- `demo-prompts.md` - 前端Demo生成提示词
- `review-prompts.md` - 文档Review提示词
- `custom-prompts.md` - 自定义提示词
