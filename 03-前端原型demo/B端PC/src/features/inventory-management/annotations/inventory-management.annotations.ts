import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inventoryManagementAnnotations: PrototypeAnnotation[] = [
  {
    id: "inv-mgmt-page",
    number: 1,
    kind: "页面",
    title: "存货管理中枢看板（P-CKG-001）",
    content:
      "仓储资产实时监控与核算中枢，汇总全平台物理库存、可用数量与冻结资产。提供【仓库视图】、【货物视图】、【货主视图】三重视图，打通实物与风控数据闭环。",
    documentRefs: {
      prd: { section: "1. 业务背景与业务痛点", match: "模块定位" },
      fields: { section: "0. 对象与字段层级说明", match: "页面级汇总与控制字段" },
      rules: { section: "5.1 数据守恒与未定价规则", match: "非负守恒" },
    },
    details: [
      {
        title: "核心定位",
        items: [
          {
            label: "数据驱动",
            content:
              "本模块为纯只读分析看板，不提供前台直接录入或新增，全部数据由入库、出库、移库等生效单据驱动。",
          },
          {
            label: "严禁负库存",
            content: "执行严密的数据完整性校验，严禁出现可用数量或库存总数小于 0。",
          },
        ],
      },
    ],
  },
  {
    id: "inv-mgmt-metrics",
    number: 2,
    kind: "交互",
    title: "动态汇总指标卡片",
    content:
      "顶部展示总价、货品种类数、仓库数量、货主数量四大动态卡片。随筛选条件与业务时间动态重算。当存在未定价货物时，总价卡片点亮黄色感叹号告警。",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "顶部指标动态重算" },
      fields: { section: "一、页面级汇总与控制字段", match: "总价" },
      rules: { section: "5.1 数据守恒与未定价规则", match: "未定价商品兜底规则" },
    },
    details: [
      {
        title: "核算规则",
        items: [
          {
            label: "未定价告警",
            content:
              "现货贸易中待点价或暂定价商品不盲目粗暴按 0 计算，列表展示 `--`，卡片右侧点亮黄色感叹号 `(!)` 并提示‘当前存在未定价货物’。",
          },
          {
            label: "总价水印",
            content: "金额卡片底衬浅蓝 ¥ 水印，单位为万元，千分位格式化显示。",
          },
        ],
      },
    ],
  },
  {
    id: "inv-mgmt-tabs",
    number: 3,
    kind: "交互",
    title: "三重视图切换",
    content:
      "支持【仓库视图】、【货物视图】、【货主视图】独立切换，自适应渲染专属表头、排布顺序与筛选维度。",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "三重视图切换" },
      rules: { section: "5.2 视图自适应与指标联动规则", match: "视图切换状态保持" },
    },
    details: [
      {
        title: "视图划分",
        items: [
          {
            label: "仓库视图",
            content: "以实体监管仓为主键，重点掌握库容饱和度与出入库流速，悬停查看仓库类型与管理方。",
          },
          {
            label: "货物视图",
            content: "以货品规格（大类-品类-规格）为主键，展示各规格单价、全仓库存、可用与冻结资产。",
          },
          {
            label: "货主视图",
            content: "以权属企业/个人为主键，展示法定权属货主在押货物、统一信用代码及脱敏联系方式。",
          },
        ],
      },
    ],
  },
  {
    id: "inv-mgmt-filters",
    number: 4,
    kind: "交互",
    title: "多维自适应筛选区",
    content:
      "支持业务时间日期范围选择器（默认当天），支持仓库名称、货品大类/品类/规格、货主名称检索，随视图智能隐藏无关筛选项。",
    documentRefs: {
      fields: { section: "一、页面级汇总与控制字段", match: "业务时间" },
      rules: { section: "5.3 业务时间与单据准入规则", match: "业务时间核算基准" },
    },
    details: [
      {
        title: "核算基准",
        items: [
          {
            label: "业务时间",
            content: "遵循【业务时间核算基准】(R13)，统计单据实际业务发生时间而非系统录入时差。",
          },
        ],
      },
    ],
  },
  {
    id: "inv-mgmt-table",
    number: 5,
    kind: "字段",
    title: "库存核算表格与数量守恒",
    content:
      "统一 72px 行高，苹方字体展示。严格执行 `库存总数 = 可用数量 + 冻结数量`。处于审批流程中的货物全额计入冻结池，防止一货多押或超额出库。",
    documentRefs: {
      rules: { section: "5.1 数据守恒与未定价规则", match: "数量核算绝对守恒" },
      fields: { section: "二、仓库视图业务字段", match: "库存总数" },
    },
    details: [],
  },
  {
    id: "inv-mgmt-ops",
    number: 6,
    kind: "交互",
    title: "穿透下钻与上下文锁定",
    content:
      "行操作提供【库存分布】与【库存流水】。点击后携带当前仓库、货物或货主编码跳转至库存明细 (P-CKG-003) 或库存流水 (P-CKG-004)，并在目标页将筛选条件锁定为只读状态。",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "穿透追溯与上下文锁定" },
      rules: { section: "5.4 穿透追溯与上下文锁定规则", match: "上下文锁定" },
    },
    details: [],
  },
  {
    id: "inv-mgmt-export",
    number: 7,
    kind: "交互",
    title: "异步报表导出与历史追溯",
    content:
      "右上角提供【批量导出】与【导出记录】。批量导出触发后台异步报表生成，导出记录弹窗可查看历史报表生成状态并提供安全下载。",
    documentRefs: {
      fields: { section: "五、导出记录弹窗与系统审计字段", match: "导出记录" },
      rules: { section: "5.5 异步导出与系统权限规则", match: "异步导出任务调度" },
    },
    details: [],
  },
]
