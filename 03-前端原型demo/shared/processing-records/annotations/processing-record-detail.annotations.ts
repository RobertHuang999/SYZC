import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const processingRecordDetailAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "processing-detail-header",
    documentRefs: {
      prd: { section: "加工管理主PRD", match: "单号一键复制", element: "row" },
      rules: { section: "3. 完成加工与产出入库原子事务", match: "并在完成加工弹窗中明确展示蓝色提示：ⓘ 当前投入库存将被锁定，完成后全部产出将自", element: "text" },
    },
    targetId: "processing-detail-header",
    number: 1,
    kind: "页面",
    title: "详情页顶栏与状态印章",
    content:
      "展示 19 位纯数字加工单号（带一键复制）、返回按钮以及大圆形状态印章（绿色已完成 / 灰色作废）。未完成状态下直接提供【完成加工】与【作废】操作按钮。",
    details: [
      {
        title: "生命周期",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["新增加工申请"] --> B["审批专网"]
    B -->|通过| C["未完成<br/>计划投入已锁定"]
    B -->|驳回 / 撤销| D["审批中心查看（本台账不展示）"]
    C -->|完工登记| E["已完成<br/>实际消耗扣减 + 产出入库"]
    C -->|作废| F["作废（终态）"]
    E --> G["抵押 / 质押加工：新条码货权继承原单据 (R26/R36)"]`,
          },
        ],
      },
      {
        title: "状态展示与操作",
        items: [
          {
            label: "印章样式",
            content: "已完成状态右上角盖绿色已完成圆形印章；作废状态右上角盖灰色作废印章；未完成态显示操作按钮。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-detail-basic-section",
    documentRefs: {
      fields: { section: "加工管理字段清单", match: "制单人/时间", element: "row" },
      rules: { section: "【加工损耗信息留痕规则】(R25)", match: "损耗数据仅作为单据技术指标留痕（仅在已完成详情展示），严禁参与库存数量扣减、产出", element: "text" },
    },
    targetId: "processing-detail-basic-section",
    number: 2,
    kind: "字段",
    title: "基本信息子板块 (DetailSection)",
    content:
      "使用标准 DetailSection + DetailField 4 列栅格架构（上 label 下 value），严禁老式左右表格。展示制单人/时间、货主名称、货主标识、加工日期、加工类型、仓库名称、关联单号（超链）、加工原因、设备抓拍图（无设备容错 R33）。已完成态展示加工损耗信息（R25）。",
    details: [
      {
        title: "字段布局与口径",
        items: [
          {
            label: "关联单号跳转",
            content: "抵押、质押或监管加工展示关联在押单号并支持跳转；存货加工展示 --。",
          },
          {
            label: "设备抓拍容错",
            content: "提交时联动摄像头抓拍；若现场无设备或抓拍超时，显示「抓图失败/无监控设备」并不阻断单据（R33）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-detail-tab-input",
    documentRefs: {
      prd: { section: "5. 状态机与动作能力矩阵", match: "查看详情（四大标签页浏览）", element: "row" },
      rules: { section: "【计划投入量与即时锁库】(R06)", match: "每条货位计划投入量必须满足 $0 < \\text{计划量} \\le \\text{", element: "text" },
    },
    targetId: "processing-detail-tab-input",
    number: 3,
    kind: "交互",
    title: "标签页 1：投入货物明细",
    content:
      "展示原投入货物明细快照：序号、货物名称、货物位置、具体位置、入库时间、扩展信息、存货条码、计划投入量、实际消耗量与释放数量。作废状态下实际消耗与释放数量显示为 --。",
    details: [
      {
        title: "数量核算口径",
        items: [
          {
            label: "自动释放数量",
            content: "自动释放数量 = 锁定数量 - 实际消耗数量；事务内自动生成解锁流水释放余量（R24）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-detail-tab-output",
    documentRefs: {
      prd: { section: "5. 状态机与动作能力矩阵", match: "查看详情（四大标签页浏览）", element: "row" },
      rules: { section: "【产出入库位置与同仓强约束】(R22)", match: "产出 具体位置 为必填项，缺失强行阻断完成登记。", element: "text" },
    },
    targetId: "processing-detail-tab-output",
    number: 4,
    kind: "交互",
    title: "标签页 2：产出货物明细",
    content:
      "展示产出货物明细：序号、产出货物、预计数量、实际数量、行业参考价、入库位置、具体位置、品类动态采集属性、新存货条码。作废状态下实际数量与新条码显示为 --。",
    details: [
      {
        title: "产出规格与条码",
        items: [
          {
            label: "新存货条码",
            content: "完成加工入库成功后由系统签发全局唯一新存货条码，支持点击弹窗查看二维码（R26）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-detail-tab-audit",
    documentRefs: {
      rules: { section: "【审批中心通用任务流转】(R11)" },
      prd: { section: "修订记录", match: "跨模块协同与系统链路", element: "row" },
    },
    targetId: "processing-detail-tab-audit",
    number: 5,
    kind: "规则",
    title: "标签页 3：审核记录",
    content:
      "回显单据在系统通用审批中心流转的完整历史轨迹。垂直时间轴展示总流程名称、发起申请、分配、审批节点及处理人意见，提供【任务详情 >】页面直达跳转（R11）。",
    details: [
      {
        title: "流转节点与权限",
        items: [
          {
            label: "节点回显",
            content: "包含申请提交、现场核实、主管终审等节点的处理人、所属机构、时间戳与审批意见。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-detail-tab-modify",
    documentRefs: {
      rules: { section: "【未完成单据作废与审计留痕】(R14)", match: "单据处于 未完成 状态时，具备作废权限的人员可点击【作废】；", element: "text" },
      prd: { section: "修订记录", match: "初版加工管理主 PRD", element: "row" },
    },
    targetId: "processing-detail-tab-modify",
    number: 6,
    kind: "规则",
    title: "标签页 4：修改记录",
    content:
      "已完成单据展示完成加工人、完成时间与损耗信息；作废单据展示作废人、作废时间与必填作废原因（≤500字）。只读追溯展示，不可修改（R14/R35）。",
    details: [
      {
        title: "审计留痕",
        items: [
          {
            label: "修改审计",
            content: "记录终态责任人的姓名、所属机构与准确时间戳，作为司法存证与审计凭证。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-detail-fields",
    documentRefs: {
      fields: { section: "加工管理字段清单", match: "货品基础信息", element: "row" },
      rules: { section: "【实际产出数量合规性】(R21)", match: "完成加工登记时，每条产出货物的实际产出数量必须 大于 0；允许大于或小于预计产出", element: "text" },
    },
    targetId: "processing-detail-basic-section",
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
