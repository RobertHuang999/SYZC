import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const supervisionHandlingAnnotations: PrototypeAnnotation[] = [
  {
    id: "supervision-handling-page",
    documentRefs: {
      prd: { section: "监管办理 主PRD", match: "菜单路径（6.2）：融资/监管 → 监管业务 → 监管办理", element: "text" },
      rules: { section: "【监管服务质权人合作方引用规则】(R15)", match: "【界面称谓】：表单 Label 使用 质权人 或 服务方，禁止 使用「资金方」「", element: "text" },
    },
    targetId: "supervision-handling-page",
    number: 1,
    kind: "页面",
    title: "监管办理 · 业务发起与台账闭环",
    content:
      "承接质押单、抵押单与监管服务单的开立、选货锁定、提交审核与办理记录追踪；PC 端仅支持在库实物存货圈选，暂不支持数字仓单。",
    details: [
      {
        title: "生命周期与资产锁定流转",
        items: [
          {
            label: "流转图",
            content: `flowchart LR
  A[草稿/新发起] -->|填写基础信息+选货| B[提交审核]
  B -->|货位锁为申请中| C[工作中心审批中]
  C -->|终审通过| D[已生效 · 货位锁为质押/抵押中]
  C -->|审批驳回/主动撤回| E[已驳回/已撤回 · 释放为存货中]
  D -->|结清解押| F[已解押 · 恢复存货中]`,
          },
          {
            label: "权限与数据范围",
            content:
              "仅具备【抵质押业务经办开立权限】(P01) 的经办人可发起开立、编辑、撤回与提交审核；列表按租户与管辖仓库数据权限隔离。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-handling-basic-form",
    documentRefs: {
      fields: { section: "一、基础信息区字段 (Basic Information)", match: "货主类型", element: "row" },
      rules: { section: "【主体类型与要素动态映射规则】(R01)", match: "在未选择具体货主前，界面仅渲染", element: "text" },
    },
    targetId: "supervision-handling-basic-form",
    number: 2,
    kind: "字段",
    title: "基础信息与风控参数字段字典",
    content:
      "遵循【主体类型与要素动态映射规则】(R01)、【单据类型担保方式自适应与权人企业恒定规则】(R02)、【货值安全线浮动与流动条件触发规则】(R03) 与【实际贷款金额与授信额度合规校验规则】(R11)。",
    details: [
      {
        title: "字段字典表",
        items: [
          {
            label: "核心字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 校验与提示 |
| 货主类型 | 下拉单选 | 是 | 企业 / 个人 | 切换时清空已选货主与反显列 |
| 货主名称 | 合作方选择器+OCR | 是 | 货主信息域主档 | 未选前不渲染货主标识与联系电话（R01） |
| 开立单据类型 | 下拉单选 | 是 | 质押单 / 抵押单 / 监管服务单 | 切换时自适应担保方式与权人标签，保留货品明细（R02） |
| 贷款/授信金额 | 数值+单位切换 | 否 | 不小于0，最多2位小数（万元/元） | 贷款金额不可大于授信金额（R11/C03） |
| 货值安全线 | 开关+数值+单位 | 条件必填 | 大于 0（万元/元） | 仅流动/浮动/动态模式展示；固定/静态彻底隐藏（R03） |`,
          },
        ],
      },
    ],
  },
  {
    id: "supervision-handling-holder-picker",
    documentRefs: {
      fields: { section: "一、基础信息区字段 (Basic Information)", match: "6.3 嵌入式选择器绑定主档；见 R14 / R15", element: "row" },
      rules: { section: "【监管服务质权人合作方引用规则】(R15)", match: "【界面称谓】：表单 Label 使用 质权人 或 服务方，禁止 使用「资金方」「", element: "text" },
    },
    targetId: "supervision-handling-holder-picker",
    number: 3,
    kind: "字段",
    title: "权人 / 质权人合作方域隔离选择器",
    content:
      "抵押/质押单权人引用「资金方信息」域（【抵质押权人合作方引用规则】(R14)）；监管服务单质权人引用「服务方信息」域（【监管服务质权人合作方引用规则】(R15)）；权人主体恒定为企业只读。",
    details: [
      {
        title: "域对照与防混域",
        items: [
          {
            label: "单据与档案域",
            content:
              "抵押单/质押单 → 资金方信息域；监管服务单 → 服务方信息域；货主 → 货主信息域（【货主合作方引用规则】(R16)）。禁止跨菜单域混选。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-handling-goods-table",
    documentRefs: {
      fields: { section: "二、货品明细区业务字段 (两级级联表格 - PC 端)", match: "货物名称", element: "row" },
      rules: { section: "【货品两级级联选货与数量防超额硬拦截规则】(R04)", match: "任何子货位的分配数量严禁超过其实时可用数量", element: "text" },
    },
    targetId: "supervision-handling-goods-table",
    number: 4,
    kind: "字段",
    title: "两级货品明细与选货防超额校验",
    content:
      "点击「+ 添加货物」唤起两级树形圈选弹窗（仓库/货物多选+三维排序），单货位录入不可超可用数量（【超额抵质押数量异常阻断】(C01)），单价只读继承 SKU 基准价并汇总总价值（【SKU基准单价继承与动态货值核算引擎规则】(R05)）。",
    details: [
      {
        title: "快捷补库联动",
        items: [
          {
            label: "去发起入库",
            content:
              "在库合格存货不足时，点击右上角橙色超链接「没有我想选的? 去发起入库」直达入库发起页。",
          },
        ],
      },
    ],
  },
]
