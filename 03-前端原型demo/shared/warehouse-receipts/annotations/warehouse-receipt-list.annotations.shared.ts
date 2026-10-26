import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

/** 仓单管理 · PC 列表页标注正文（双端共享真源，H5 只做 targetId / 端差异补丁） */
export const warehouseReceiptListAnnotationsShared: SharedPrototypeAnnotation[] = [
  {
    id: "receipt-list-page",
    targetId: "receipt-list-page",
    number: 1,
    kind: "页面",
    title: "仓单管理台账（P-CKG-005）",
    content:
      "实时展示当前账号管辖仓库内的全部数字仓单，按开立时间倒序排列；右上角【仓单开立】引导现场人员在移动端完成实名开立。",
    documentRefs: {
      prd: { section: "6.1 仓单管理 — 列表页", match: "核心表格" },
      fields: { section: "六、展示、筛选与引用规则", match: "默认按开立时间倒序" },
    },
    details: [
      {
        title: "台账定位",
        items: [
          {
            label: "数据范围",
            content:
              "严格按当前登录账号的仓库权限过滤，严禁越权查看未授权仓库的仓单。",
          },
          {
            label: "上下游",
            content:
              "上游承接移动端实名开立的数字仓单；下游被监管办理、出库、移库、补货、移除与注销引用。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-list-filter",
    targetId: "receipt-list-filter",
    number: 2,
    kind: "字段",
    title: "组合筛选与仓库权限隔离（R-DWR-01）",
    content:
      "默认露出仓单编号、开立时间、存货人/持有人/货品综合搜索、仓库四项，其余收进「展开筛选」；仓库下拉仅列出账号权限范围内的实体仓库。",
    documentRefs: {
      prd: { section: "6.1 仓单管理 — 列表页", match: "两排筛选区" },
      fields: { section: "二、PC 列表筛选区专属字段", match: "仓库" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-01" },
    },
    details: [
      {
        title: "筛选维度",
        items: [
          {
            label: "默认四项",
            content:
              "仓单编号（自动去首尾空格、支持回车查询）、开立时间范围、存货人/持有人/货品信息、仓库。",
          },
          {
            label: "展开项",
            content:
              "货品名称（大类单选 + 品类多选）、三方登记、状态（多选）、制单人、制单时间范围。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-list-table",
    targetId: "receipt-list-table",
    number: 3,
    kind: "字段",
    title: "11 列全息台账与货物折叠悬停（R-DWR-12）",
    content:
      "固定列序：序号、仓单编码、存货人、持有人、仓库名称、货物名称、开立时间、仓单状态、三方登记、制单人、操作；货物默认展示前 2 条，超出时悬停【更多...】弹出完整清单。",
    documentRefs: {
      prd: { section: "6.1 仓单管理 — 列表页", match: "核心表格（11 列）" },
      fields: { section: "一、仓单单据与列表台账字段", match: "货物名称" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-12" },
    },
    details: [
      {
        title: "展示口径",
        items: [
          {
            label: "双行复合列",
            content:
              "存货人、持有人、制单人均为两行：第一行业务主体名称，第二行标识（统一社会信用代码 / 脱敏手机号）或制单时间。",
          },
          {
            label: "货物折叠",
            content:
              "每行格式为「大类-品类-规格-数量及单位」；超过 2 行时在第二行末尾展示「更多...」，悬停 300ms 呼出气泡浮层。",
          },
          {
            label: "单号展示",
            content:
              "21 位 CD 编号完整展示、不截断，列宽预留 210px 以上，提供一键复制。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-list-row-actions",
    targetId: "receipt-list-row-actions",
    number: 4,
    kind: "规则",
    title: "四态操作能力矩阵与移动端人脸绑定（R-DWR-05 / R-DWR-03）",
    content:
      "正常态展示详情、仓单补货、仓单出库、仓单入库、仓单移库、仓单移除、注销、下载 8 项；审批中、冻结、注销三态严格只留详情与下载。动碰类操作在 PC 端点击后弹出移动端办理引导。",
    documentRefs: {
      prd: { section: "5.2 操作按钮能力矩阵", match: "正常" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-05" },
      fields: { section: "五、操作字段子清单索引", match: "07 仓单注销字段清单" },
    },
    details: [
      {
        title: "按钮与拦截",
        items: [
          {
            label: "正常态",
            content:
              "存货人与持有人无论是否一致，8 项操作全部高亮可用。",
          },
          {
            label: "非正常态",
            content:
              "审批中（被抵质押申请占用）、冻结（质押生效/司法冻结）、注销（终态）仅保留【详情】【下载】。",
          },
          {
            label: "单流程互斥",
            content:
              "同一仓单下补货、出库、移库、注销四类流程在途仅限 1 个；冲突时提示「您还有【流程名】正在审批中，暂无法发起新的流程！」。",
          },
          {
            label: "人脸核验",
            content:
              "补货、出库、入库、移库、移除、注销均涉及货权处置，PC 端只做引导，实际签署必须在移动端完成活体人脸识别。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-list-issue-guide",
    targetId: "receipt-list-issue-guide",
    number: 5,
    kind: "交互",
    title: "仓单开立扫码引导（R-DWR-06）",
    content:
      "PC 端右上角【仓单开立】弹出二维码与办理路径，扫码直达移动端「业务办理 → 业务发起 → 仓单开立」，由现场人员核验货位并完成人脸 + 短信双因子认证。",
    documentRefs: {
      prd: { section: "6.1 仓单管理 — 列表页", match: "仓单开立" },
      fields: { section: "五、操作字段子清单索引", match: "01 仓单开立字段清单" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-06" },
    },
    details: [],
  },
]
