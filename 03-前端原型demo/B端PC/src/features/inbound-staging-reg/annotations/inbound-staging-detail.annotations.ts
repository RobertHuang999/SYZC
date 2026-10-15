import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundStagingDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-detail-page",
    targetId: "inbound-staging-detail-page",
    number: 1,
    kind: "页面",
    title: "暂存详情定位与单据生命周期闭环",
    content:
      "只读呈现单条登记单事实全貌；顶栏提供单号复制与三态徽章；展示 19 位关联正式入库单号穿透链接；正式单被驳回/撤销时支持自动回退（P10）。",
    documentRefs: {
      prd: {
        section: "4.3 PC 详情页",
        match: "子板块",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "关联正式入库单号",
        element: "row",
      },
      rules: {
        section: "【正式单终止后暂存回退】(P10)",
        match: "P10",
        element: "heading",
      },
    },
    details: [
      {
        title: "1. 单据三态徽章与交互边界",
        items: [
          {
            label: "三态印章与权限说明",
            content:
              "- **待补全 (Clock 琥珀黄)**：初始录入或正式单终止回退状态；支持【作废】、【编辑】与【转为正式入库】；\n- **已转正式 (CheckCircle 翡翠绿)**：正式单提交审核成功后自动流转，回填 19 位正式单号并支持点击穿透跳转，禁止再次编辑或作废；\n- **已作废 (中性灰)**：人工录入必填原因作废后的终态，展示作废人、作废时间与作废原因，单据归档不可逆。",
          },
        ],
      },
      {
        title: "2. 正式单上下游联动与回退机制 (P10 / R32)",
        items: [
          {
            label: "正式单主表不反写暂存单号 (R32)",
            content:
              "转正后生成的正式入库单主表**不展示**来源暂存单号，追溯以本单【关联正式入库单号】及操作记录为准，保持正式单据的法律纯洁性与架构解耦。",
          },
          {
            label: "审批驳回或撤销自动回退 (P10)",
            content:
              "关联的 19 位正式入库单审批终态为【未通过】或【已撤销】时，系统自动将暂存单回退为【待补全】，清空关联正式单号，操作记录记录驳回/撤销日志，允许现场重新修改后再次发起转正。",
          },
        ],
      },
    ],
  },
  {
    id: "inbound-staging-detail-base",
    targetId: "inbound-staging-detail-base",
    number: 2,
    kind: "字段",
    title: "基础信息板块与字段规格",
    content:
      "结构化展示登记单号、入库日期、入库仓库、入库类型、关联单号、货主一体化标签、入库库房、关联正式单号及经办人时刻。",
    documentRefs: {
      prd: {
        section: "4.3 PC 详情页",
        match: "基础信息",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "登记单号",
        element: "row",
      },
      rules: {
        section: "【货主智能一体化录入与转正核验】(P03)",
        match: "P03",
        element: "heading",
      },
    },
    details: [
      {
        title: "1. 基础信息字段清单对照表",
        items: [
          {
            label: "字段展示与取值规范",
            content: `| 字段名称 | 展示形式 | 取值与格式要求 | 业务说明 |
| :--- | :--- | :--- | :--- |
| **登记单号** | 文本 + 复制按钮 | 格式 \`REG-yyyyMMdd-00001\` | 唯一编号，点击图标复制至剪贴板（P01） |
| **入库日期** | 日期时间文本 | \`YYYY-MM-DD HH:mm:ss\`（PingFang SC） | 现场事实到货卸车时间（R01） |
| **入库仓库** | 文本 | 仓库规范全称 | 所属实体监管仓库（R05） |
| **入库类型** | 状态文本 | 普通 / 质押 / 抵押 / 监管服务 / 仓单 | 驱动转正制单路由（P06） |
| **关联单号** | 文本 | 系统在押单号或自由手填文本；未填为「--」 | 手填文本打标注明；转正时匹配系统有效单据 |
| **货主/送货说明** | 组合组件 | 档案名称 + 【档案货主】；临时文本 + 【临时待核】 | 智能一体化（P03）；临时待核提示转正须补建档 |
| **货主标识** | 文本 | 统一社会信用代码或脱敏手机号（R27）；手填为「--」 | 仅选中档案货主时反显 |
| **入库库房** | 文本 | 库房名称顿号拼接；未选为「--」 | 暂存选填；转正时汇总二级库房 |
| **关联正式入库单号** | 链接 / 占位符 | 19 位正式单号链接；未转正为「--」 | 点击直达正式入库记录详情（P06） |
| **登记人 / 登记时间** | 文本 | 姓名；\`YYYY-MM-DD HH:mm:ss\` | 首次制单经办人与系统时刻 |
| **最后修改人 / 时间** | 文本 | 姓名；\`YYYY-MM-DD HH:mm:ss\` | 最近一次协作补录经办人 |
| **备注** | 文本 | 文本内容；未填为「--」 | 最多 140 字现场备忘 |`,
          },
        ],
      },
    ],
  },
  {
    id: "inbound-staging-detail-tabs",
    targetId: "inbound-staging-detail-tabs",
    number: 3,
    kind: "字段",
    title: "货品明细 Tab 与操作审计时间轴 Tab",
    content:
      "Tab 1 展开呈现一级货品 SKU、申报数量、二级库位堆放行、现场照片与补充资料；Tab 2 呈现全流程不可变操作审计时间轴。",
    documentRefs: {
      prd: {
        section: "4.3 PC 详情页",
        match: "货品与库位明细",
        element: "text",
      },
      fields: {
        section: "2.2 二级堆放位置明细",
        match: "堆放模块折叠开关",
        element: "row",
      },
      rules: {
        section: "【二级堆放默认折叠与自主分配】(P04)",
        match: "P04",
        element: "heading",
      },
    },
    details: [
      {
        title: "1. 货品与堆放明细 Tab 规格",
        items: [
          {
            label: "双层嵌套明细呈现",
            content:
              "- **一级规格**：入库货品（大类-品类-规格）、申报数量（带单位、千分位）、其他收集项（参数键值对）、货品备注；\n- **二级库位明细**：详情页默认展开呈现已分配垛位列表（入库库房、入库分区、具体位置文本最多 20 字、堆放数量）；未分配堆放数量明确展示；\n- **影像与附件**：现场照片缩略图（点击支持放大查看预览）、补充资料文件列表（展示文件名与格式）。",
          },
        ],
      },
      {
        title: "2. 操作记录审计时间轴 Tab 规格",
        items: [
          {
            label: "生命周期审计节点",
            content:
              "时间轴记录单据生命周期的不可变操作历史：\n1. **创建暂存**：登记人、制单时刻、初始申报要素；\n2. **补充修改**：修改人、时刻、协作补录要素摘要；\n3. **转为正式**：转正人、时刻、生成 19 位正式单号；\n4. **正式单终止回退 (P10)**：回退时刻、关联正式单号及驳回/撤销原因；\n5. **作废操作 (P11)**：作废人、作废时刻、作废原因（最多 200 字，留存终身审计）。",
          },
        ],
      },
    ],
  },
  {
    id: "inbound-staging-detail-actions",
    targetId: "inbound-staging-detail-actions",
    number: 4,
    kind: "交互",
    title: "状态化操作按钮与 O02 作废 / O03 转正弹窗",
    content:
      "待补全支持【作废】【编辑】【转为正式入库】；已转正式支持【查看正式入库单】；O02 强制输入作废原因；O03 确认转正风控前置条件与路由引导。",
    documentRefs: {
      prd: {
        section: "4.5 核心交互弹窗说明",
        match: "O03",
        element: "text",
      },
      fields: {
        section: "6.3 转为正式入库确认与引导弹窗",
        match: "O03",
        element: "heading",
      },
      rules: {
        section: "【一键转正式与关联单号校验闭环】(P06)",
        match: "P06",
        element: "heading",
      },
    },
    details: [
      {
        title: "1. O02 作废确认弹窗规格",
        items: [
          {
            label: "作废留痕与不可逆性",
            content:
              "处于【待补全】状态时点击【作废】唤起：\n- **必填项**：作废原因输入框（最多 200 字，禁止纯空格提交）；\n- **影响**：确认后单据状态更新为【已作废】，操作记录写入作废人与原因，禁止再次编辑或转正。",
          },
        ],
      },
      {
        title: "2. O03 转为正式入库确认与引导弹窗规格",
        items: [
          {
            label: "转正确认与前置风控引导",
            content:
              "处于【待补全】状态时点击【转为正式入库】唤起：\n1. 提示目标登记单号 `REG-yyyyMMdd-00001`；\n2. 声明数据原样无损预填至正式制单页；\n3. 提醒转正前置风控拦截要求（货主重选档案建档与短信核验、二级堆放清零 R13、现场照片至少 1 张 R16、手填单号系统比对 P06）；\n4. 仓单入库场景：提示「仓单正式制单须前往移动端完成」，提供复制 H5 发起链接；\n5. 声明结案时机：正式制单页点击【提交审核】成功后才回写当前单据为已转正式，中途取消不产生废单。",
          },
        ],
      },
    ],
  },
]
