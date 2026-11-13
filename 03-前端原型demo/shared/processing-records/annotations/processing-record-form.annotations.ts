import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const processingRecordFormAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "processing-form-page",
    documentRefs: {
      prd: { section: "1.1 业务背景" },
      rules: { section: "【审批中心通用任务流转】(R11)" },
    },
    targetId: "processing-form-page",
    number: 1,
    kind: "页面",
    title: "新增加工申请单",
    content:
      "业务人员或现场监管员录入存货加工申请。涵盖三大折叠卡片（基础信息、两级树形投入明细、预计产出明细）。点击右上角【提交审核】后即时锁定投入库存，并推入通用审批中心（R06/R11）。",
    details: [
      {
        title: "制单流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["新增加工申请"] --> B["三同校验：同仓 / 同货主 / 同类型"]
    B -->|不通过| C["阻断并提示三同不一致"]
    B -->|通过| D["录入投入明细（两级树形）"]
    D --> E["录入产出明细与新条码"]
    E --> F["提交审核 → 审批专网"]`,
          },
        ],
      },
      {
        title: "主流程口径",
        items: [
          {
            label: "即时锁库",
            content: "提交成功后锁定对应投入库存并扣减可用量，打上加工锁定标记，防止并发争抢（R06）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-form-basic-card",
    documentRefs: {
      fields: { section: "二、投入货物明细字段（行级）", match: "货品基础信息", element: "row" },
      rules: { section: "【投入货物三同校验与仓库锁定】(R05)", match: "主表无独立仓库选择框，用户添加第一条投入货物后，系统自动确定并锁定主表仓库名称；", element: "text" },
    },
    targetId: "processing-form-basic-card",
    number: 2,
    kind: "字段",
    title: "卡片 1：基础信息与仓库锁定",
    content:
      "录入加工日期（禁未来时间 R01）、货主类型（企业/个人）、货主名称（联动带出标识与身份证号 R02）、加工类型（R03）、关联单号（抵质押/监管必填且过滤仓单货 R04）、备注（限制 140 字 R08）。主表无独立仓库选择框，由首条投入货物自动确定并锁定（R05）。",
    details: [
      {
        title: "三同校验与仓库锁定",
        items: [
          {
            label: "三同原则",
            content: "单据内所有投入明细必须同货主、同仓库、同加工类型；首条选定后主表仓库被锁定（R05）。",
          },
          {
            label: "仓单过滤",
            content: "抵质押单货物若已开具数字仓单，强行阻断选择并提示解单（R04）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-form-input-card",
    documentRefs: {
      rules: { section: "【计划投入量与即时锁库】(R06)", match: "每条货位计划投入量必须满足 $0 < \\text{计划量} \\le \\text{", element: "text" },
      fields: { section: "二、投入货物明细字段（行级）", match: "一级计划投入量", element: "row" },
    },
    targetId: "processing-form-input-card",
    number: 3,
    kind: "交互",
    title: "卡片 2：两级树形投入明细",
    content:
      "右上角提供【+ 添加投入货品】弹窗。两级树形表格：一级货品规格汇总行支持移除；二级货位明细行可编辑计划投入量（0 < 计划量 <= 可用量 R06）。底部自动汇总品类数与投入总数量。",
    details: [
      {
        title: "明细交互",
        items: [
          {
            label: "可用量校验",
            content: "针对特定批次货位填写的计划投入量不得超过实时可用库存，否则阻断提交（R06）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-form-output-card",
    documentRefs: {
      prd: { section: "加工管理主PRD", match: "【产出规格带出与结构冻结】", element: "row" },
      rules: { section: "【产出规格带出与结构冻结】(R07)", match: "产出货物选择后，系统自动带出其 规格型号（如散装）与 计量单位（如颗）；", element: "text" },
    },
    targetId: "processing-form-output-card",
    number: 4,
    kind: "交互",
    title: "卡片 3：预计产出明细与试算",
    content:
      "选择产出货品自动带出规格型号与计量单位（R07）；输入预计数量（>0），系统自动依据货品管理参考单价试算行金额与产出总金额（R31/R32）。提交后规格结构冻结（R07）。",
    details: [
      {
        title: "金额试算与缺价提示",
        items: [
          {
            label: "缺价容错",
            content: "若产出货物未设置参考单价，提示缺价信息，不阻断单据提交（R31）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-form-fields",
    documentRefs: {
      fields: { section: "加工管理字段清单", match: "货品基础信息", element: "row" },
      rules: { section: "【实际产出数量合规性】(R21)", match: "完成加工登记时，每条产出货物的实际产出数量必须 大于 0；允许大于或小于预计产出", element: "text" },
    },
    targetId: "processing-form-basic-card",
    number: 99,
    kind: "字段",
    title: "字段字典",
    content: "展示加工单基础信息、投入与产出数量、状态与审计字段。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **加工单号** | 文本 | 系统生成 | 19 位数字串 | 可复制 |
| **加工类型** | 标签 | 必填 | 普通加工 / 质押加工 / 抵押加工 / 监管服务加工 | 单行 |
| **货主** | 文本 | 必填 | 企业全称 / 个人姓名 | 单行 |
| **仓库 / 库房** | 文本 | 必填 | 仓库-库房-分区 | 单行 |
| **投入货品** | 表格 | 必填 | 大类-品类-规格 + 数量 | 两级树形 |
| **产出货品** | 表格 | 必填 | 大类-品类-规格 + 数量 + 新条码 | 单行 |
| **加工日期** | 日期时间 | 必填 | YYYY-MM-DD HH:mm:ss | 单行 |
| **状态** | 状态标签 | 系统维护 | 未完成 / 已完成 / 作废 | 彩色标签 |
| **操作人 / 时间** | 文本 | 系统记录 | 姓名 + 时间 | 双行 |`,
          },
        ],
      },
    ],
  },
]
