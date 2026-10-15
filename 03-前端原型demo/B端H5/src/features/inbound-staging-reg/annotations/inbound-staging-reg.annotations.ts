import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

const lifecycleMermaid = `flowchart TD
    A["现场手机端极速新建 (P02)"] --> B["入库暂存登记单 (REG-yyyyMMdd-00001)"]
    B --> C{"单据状态：【待补全】"}
    C -->|同仓多人手机/电脑协作修改 (P08)| C
    C -->|现场退车或取消| D["【已作废】(P11 / O02 必填原因留痕)"]
    C -->|点击转为正式入库| E{"转正路由 (P06 / R04f)<br/>H5全类型 → H5入库发起"}
    E --> F["打开 H5 入库发起页 (携带 sourceRegId)"]
    F -->|强校验清零R13 / 关联单号绑定P06 / 短信R03 / 照片R16| G["正式提交审核"]
    G -->|提交成功| H["登记单状态自动回写为【已转正式】<br/>回填 19 位关联正式入库单号并互链"]
    G -->|正式审批驳回或撤销| I["P10 暂存自动回退为【待补全】<br/>清空正式单号，允许再次转正"]
    H --> J["正式单终审入账<br/>计入 WMS 物理库存 / 生成存货条码"]
    D --> K["终态归档 (不可逆 / 禁编辑 / 禁转正)"]`

export const inboundStagingH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-h5-list",
    targetId: "inbound-staging-h5-list",
    number: 1,
    kind: "页面",
    title: "H5 入库暂存台账与生命周期",
    content:
      "工作台仓储入口；顶部搜索栏 + 状态 Pill 滑动筛选 + 仓库/货品抽屉筛选 + 日期范围过滤；右下角 FAB 悬浮按钮支持现场一键极速新建。",
    documentRefs: {
      prd: { section: "4.4 H5 移动端说明", match: "H5 移动端说明", element: "heading" },
      fields: { section: "一、单据级业务字段", match: "单据状态", element: "row" },
      rules: { section: "【登记单与正式单完全分开】(P01)", match: "P01", element: "heading" },
    },
    details: [
      {
        title: "1. 暂存生命周期与三态定义",
        items: [
          {
            label: "全生命周期流转图",
            content: lifecycleMermaid,
          },
          {
            label: "单据状态说明",
            content:
              "- **待补全**：现场极简保存，支持继续编辑、一键转正（O03）与作废（O02）；\n- **已转正式**：正式入库单提交审核成功后系统自动流转，回填 19 位正式单号，禁止再次编辑；\n- **已作废**：人工录入原因后归档终态，不可逆。",
          },
        ],
      },
      {
        title: "2. H5 列表检索与筛选交互",
        items: [
          {
            label: "筛选维度说明",
            content:
              "1. 状态 Pill：全部 / 待补全 / 已转正式 / 已作废横向快速切换；\n2. 搜索框：支持登记单号、货主名称/临时说明模糊搜索；\n3. 筛选抽屉：支持入库仓库、入库类型、入库日期范围组合筛选。",
          },
        ],
      },
    ],
  },
  {
    id: "inbound-staging-h5-list-actions",
    targetId: "inbound-staging-h5-list-actions",
    number: 2,
    kind: "交互",
    title: "卡片操作 · 转正引导 (O03) 与作废 (O02)",
    content:
      "卡片底部操作区：待补全状态提供【编辑】【转正】【作废】；已转正式状态提供【查看正式入库单】跳转入库管理详情；已作废单据置灰展示作废原因。",
    documentRefs: {
      prd: { section: "4.5 核心交互弹窗说明", match: "O03", element: "text" },
      fields: { section: "6.3 转为正式入库确认与引导弹窗", match: "O03", element: "heading" },
      rules: { section: "【一键转正式与关联单号校验闭环】(P06)", match: "P06", element: "heading" },
    },
    details: [
      {
        title: "1. 移动端一键转正机制 (P06 / R04f)",
        items: [
          {
            label: "转正路由与无损预填",
            content:
              "H5 端点击【转为正式入库】唤起 O03 ActionSheet 确认面板，确认后打开 **业务办理 → 入库发起** 预填页 `/m/inbound/initiate?sourceRegId={REG}`，类型、关联单号、货主与 SKU 完整无损带入；【下一步】进入 `/m/inbound/initiate/goods?sourceRegId={REG}` 完成货品与堆放清零后提交审核。",
          },
        ],
      },
      {
        title: "2. 转正前置风控拦截矩阵",
        items: [
          {
            label: "转正强校验闭环",
            content:
              "1. 堆放清零：正式页强制展开堆放明细，未堆放数量必须为 0（R13）；\n2. 货主核验：临时待核必须重新选择已建档货主，新货主触发短信核验（R03）；\n3. 关联单号：非普通类型必须精准匹配系统在押单据（P06）；\n4. 现场照片：正式单提交前必须至少上传 1 张现场照片（R16）。",
          },
        ],
      },
    ],
  },
]

export const inboundStagingH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-h5-detail",
    targetId: "inbound-staging-h5-detail",
    number: 1,
    kind: "页面",
    title: "H5 暂存详情与字段结构",
    content:
      "单据头部展示单号一键复制与三态徽章；基础信息卡片呈现货主智能一体化标签（档案货主/临时待核）；关联正式单号提供穿透跳转；Tab 切换展示货品库位明细与不可变操作记录时间轴。",
    documentRefs: {
      prd: { section: "4.4 H5 移动端说明", match: "详情", element: "text" },
      fields: { section: "一、单据级业务字段", match: "详情展示", element: "text" },
      rules: { section: "【登记单与正式单完全分开】(P01)", match: "P01", element: "heading" },
    },
    details: [
      {
        title: "1. 详情信息结构与标签说明",
        items: [
          {
            label: "关键字段展示",
            content:
              "- **登记单号**：`REG-yyyyMMdd-00001`，支持一键复制；\n- **货主/送货说明**：档案货主显示名称与信用代码并打标【档案货主】；临时手填文字打标【临时待核】；\n- **关联正式单号**：已转正式后回填 19 位正式单号，点击可直达正式入库单详情；\n- **货品与堆放明细**：展开呈现已分配垛位与未堆放数量；展示现场照片与随车资料缩略图。",
          },
        ],
      },
      {
        title: "2. 操作记录审计时间轴",
        items: [
          {
            label: "时间轴节点",
            content:
              "记录创建登记（人/时间）、协作补录修改、转正提交（19位单号）、正式单驳回/撤销回退（P10）与作废留痕（作废人与原因），全流程不可变存证。",
          },
        ],
      },
    ],
  },
  {
    id: "inbound-staging-h5-detail-footer",
    targetId: "inbound-staging-h5-detail-footer",
    number: 2,
    kind: "交互",
    title: "吸底动作栏 · 作废 / 编辑 / 转正",
    content:
      "待补全状态吸底展示【作废】、【编辑】与【转为正式入库】三大操作；已转正式状态展示【查看正式入库单】；点击转正弹出 ActionSheet 确认面板 (O03)。",
    documentRefs: {
      prd: { section: "4.5 核心交互弹窗说明", match: "O03", element: "text" },
      fields: { section: "6.3 转为正式入库确认与引导弹窗", match: "O03", element: "heading" },
      rules: { section: "【一键转正式与关联单号校验闭环】(P06)", match: "P06", element: "heading" },
    },
    details: [
      {
        title: "1. 吸底操作控制矩阵",
        items: [
          {
            label: "分态按钮说明",
            content:
              "- **待补全**：【作废】（弹出输入框必填原因，最多 200 字）、【编辑】（进入分步表单）、【转为正式入库】（呼出 O03 确认面板并跳转入库发起）；\n- **已转正式**：底栏展示【查看正式入库单】，一键直达 19 位正式单详情；\n- **已作废**：单据底部展示作废原因警示卡片，禁用操作按钮。",
          },
        ],
      },
    ],
  },
]

export const inboundStagingH5FormAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-h5-form",
    targetId: "inbound-staging-h5-form",
    number: 1,
    kind: "页面",
    title: "H5 Step1 · 现场说明与基础信息",
    content:
      "步骤条导航（Step1 基础信息 → Step2 货品与堆放）；Card1 现场说明（货主智能一体化 P03 + 备注）+ Card2 入库信息（日期/类型/仓库/库房/关联单号手填）。",
    documentRefs: {
      prd: { section: "4.4 H5 移动端说明", match: "新增", element: "text" },
      fields: { section: "一、单据级业务字段", match: "新增页", element: "text" },
      rules: { section: "【货主智能一体化录入与转正核验】(P03)", match: "P03", element: "heading" },
    },
    details: [
      {
        title: "1. 货主智能一体化录入 (P03)",
        items: [
          {
            label: "免 Switch 与免发短信",
            content:
              "提供统一输入框，输入模糊快搜档案货主（打标【档案货主】并反显代码），或直接输入临时文本（如“司机张师傅 139xxxx 临时卸车”，最多 100 字，打标【临时待核】）；暂存阶段免发短信验证码（免触发 R03）。",
          },
        ],
      },
      {
        title: "2. 关联单号手填支持",
        items: [
          {
            label: "单号输入规则",
            content:
              "非普通入库时支持下拉联想系统在押单据，亦支持自由手工输入文本（最多 50 字）；暂存阶段选填，转正时由系统比对校验（P06）。",
          },
        ],
      },
    ],
  },
]

export const inboundStagingH5GoodsAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-h5-goods",
    targetId: "inbound-staging-h5-goods",
    number: 1,
    kind: "页面",
    title: "H5 Step2 · 货品规格与堆放折叠 (P04/P05)",
    content:
      "一级货品 SKU 单选快搜；申报数量必填；收集项与现场拍照（0~10 张）全面放宽选填（P05）；二级堆放位置默认折叠收起（P04）；吸底展示汇总数据，弱提示未堆放量直接保存。",
    documentRefs: {
      prd: { section: "4.4 H5 移动端说明", match: "折叠", element: "text" },
      fields: { section: "2.1 一级货品明细", match: "申报数量", element: "text" },
      rules: { section: "【二级堆放默认折叠与自主分配】(P04)", match: "P04", element: "heading" },
    },
    details: [
      {
        title: "1. 极简保存门槛 (P02)",
        items: [
          {
            label: "保存放行规则",
            content:
              "满足日期 + 仓库 + 类型 + 至少 1 行 SKU 且申报数量大于 0 即可保存；堆放位置可折叠不分垛，照片可不拍，收集项可不填；保存后立即写入 REG 暂存台账并生成操作记录。",
          },
        ],
      },
      {
        title: "2. 二级堆放折叠与弱提示",
        items: [
          {
            label: "P04 弱校验",
            content:
              "堆放位置卡片默认折叠收起；理货员现场可按需展开添加库房、分区与垛位描述（最多 20 字）；未堆放数量大于 0 仅在底栏弱提示，不阻断保存。",
          },
        ],
      },
    ],
  },
]
