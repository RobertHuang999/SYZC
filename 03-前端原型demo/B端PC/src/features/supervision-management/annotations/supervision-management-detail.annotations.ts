import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const supervisionManagementDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "supervision-management-detail-page",
    targetId: "supervision-management-detail-page",
    number: 1,
    kind: "页面",
    title: "监管订单全景详情定位与生命周期",
    content:
      "本页是监管管理列表行操作【查看详情】的落地页，只读展示监管办理终审生单后的不可变快照：基础信息、授信与贷款、四大风控指标与抵质押物明细。页面不提供存续期变更操作，解押、补仓、平仓等仍在列表行尾发起。",
    documentRefs: {
      prd: {
        section: "2.1 包含功能 (In Scope)",
        match: "全景详情",
        element: "text",
      },
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "抵押单号 / 质押单号",
        element: "row",
      },
      rules: { section: "1. 状态机本体与状态定义", match: "ACTIVE", element: "text" },
    },
    details: [
      {
        title: "单据状态与快照边界",
        items: [
          {
            label: "不可变快照",
            content:
              "发起人、抵押/质押时间、货主与权人三要素均来自生单确权快照，后续基础档案变更不回写本页。",
          },
          {
            label: "生命周期流转图",
            content: `flowchart TD
    A["监管办理终审生单<br/>固化货主 / 权人 / 货位 / 估值"] --> B["在押中（抵押中 / 质押中 / 监管中）"]
    B -->|"补仓 / 换货 / 移库"| B
    B -->|"贷款余额下降、部分结清"| B
    B -->|"解押 / 解除监管审批通过"| C["已解除（解抵押 / 解质押 / 解监管）"]
    B -.->|"在途审批锁"| D["在途：任务名<br/>变更类操作置灰"]`,
          },
        ],
      },
      {
        title: "角色与数据范围",
        items: [
          {
            label: "可见角色",
            content:
              "风控岗、监管岗、资方审核岗按订单所属仓库与机构的数据权限查看；只读，不产生操作留痕。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-detail-fields",
    targetId: "supervision-management-detail-fields",
    number: 2,
    kind: "字段",
    title: "详情五区块字段字典",
    content:
      "字段名称与取值口径严格继承《监管管理字段清单》，不在此页新增字段。个人货主手机号默认掩码，需查看明文时点眼睛图标。",
    documentRefs: {
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "货主名称",
        element: "row",
      },
      prd: { section: "2.1 包含功能 (In Scope)", match: "全景详情", element: "text" },
      rules: { section: "1. 状态机本体与状态定义", match: "ACTIVE", element: "text" },
    },
    details: [
      {
        title: "字段字典表",
        items: [
          {
            label: "基础信息",
            content:
              "| 字段 | 控件 | 必填 | 取值与格式 | 校验与提示 |\n| --- | --- | --- | --- | --- |\n| 发起人 | 只读文本 | 系统自动 | 姓名（所属机构） | 生单快照，不可修改 |\n| 抵押/质押时间 | 只读文本 | 系统自动 | YYYY-MM-DD HH:mm:ss | 终审确权时间戳 |\n| 货主类型 | 只读文本 | 系统自动 | 企业 / 个人 | 决定标识与证件展示 |\n| 货主标识 | 只读文本 + 眼睛图标 | 系统自动 | 企业信用代码 / 个人手机号 | 个人默认掩码，明文查看记审计 |\n| 权人三要素 | 只读文本 | 系统自动 | 类型 / 名称 / 证件号 | 来自合作方主档快照 |\n| 备注 | 只读文本 | 选填 | 最多 500 字 | 未填写显示 -- |",
          },
          {
            label: "授信与贷款",
            content:
              "| 字段 | 控件 | 必填 | 取值与格式 | 校验与提示 |\n| --- | --- | --- | --- | --- |\n| 授信金额/期数 | 只读文本 | 系统自动 | 万元，2~6 位小数 / 正整数 | 未录入显示 -- |\n| 贷款金额/期数/余额 | 只读文本 | 系统自动 | 万元，2~6 位小数 / 正整数 | 放款录入后回写 |\n| 抵押率 | 只读文本 + 变动记录 | 系统自动 | 百分比，保留 2 位小数 | 贷款余额 ÷ 评估价值 × 100% |",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-detail-actions",
    targetId: "supervision-management-detail-actions",
    number: 3,
    kind: "交互",
    title: "详情页交互矩阵",
    content:
      "详情页只提供查看类交互，不发起任何状态流转；所有变更入口保留在列表行尾，避免详情页绕过在途互斥锁。",
    documentRefs: {
      prd: { section: "2.1 包含功能 (In Scope)", match: "全景详情", element: "text" },
      fields: {
        section: "三、统计汇总与风控指标字段",
        match: "实时抵押率",
        element: "row",
      },
      rules: { section: "1. 状态机本体与状态定义", match: "ACTIVE", element: "text" },
    },
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "复制单号",
            content:
              "可见角色：全部查看角色；点击复制 19 位单号；成功提示原话「复制成功」，失败提示手动复制。",
          },
          {
            label: "查看明文",
            content:
              "仅个人货主展示眼睛图标；点击切换掩码/明文，明文查看写入审计日志。",
          },
          {
            label: "查看历史",
            content:
              "行业参考价、货物评估价值、抵押率三处入口；弹窗展示历次取数与重算流水，只读。",
          },
          {
            label: "展开货品批次",
            content:
              "点击父表行展开/收起该品类批次货位子表，展示位置、入库时间、条码、单价与总价。",
          },
          {
            label: "返回",
            content: "返回监管管理列表，保留原标签页、筛选条件与页码。",
          },
        ],
      },
    ],
  },
]
