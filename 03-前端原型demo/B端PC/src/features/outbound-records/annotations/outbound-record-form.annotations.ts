import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const outboundRecordFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-form-header",
    targetId: "outbound-form-header",
    number: 1,
    kind: "页面",
    title: "新增出库申请 · 制单入口与防未保存离开拦截",
    content:
      "出库申请制单入口（P-CKG-010-ADD）。提供【取消】与【提交审核】操作；当表单已录入内容时，点击返回或取消触发防未保存离开二次确认弹窗，防止用户误触丢失已选货品或录入信息。",
    documentRefs: {
      prd: {
        section: "6.3 新增出库页（P-CKG-010-ADD）",
        match: "提交审核",
        element: "text",
      },
    },
    details: [
      {
        title: "交互防护",
        items: [
          {
            label: "Dirty防离开",
            content: "检测货主、备注、货品、提货人或现场照片任意有值时弹窗拦截确认。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-form-basic",
    targetId: "outbound-form-basic",
    number: 2,
    kind: "字段",
    title: "基础信息 · 时间合规与货主隔离",
    content:
      "出库日期默认系统当前时间，严禁选择未来时间（O04）。货主须 **货主信息** 域嵌入式选择器（PA-R12），**仅选已有档案、无快捷建档**（新建货主无在库货）；【查看档案】深链带菜单路径。货主类型切换清空已选货主与货品（O05）。协同见 05 **3.3** 与出库 **O05**。",
    documentRefs: {
      rules: {
        section: "【业务时间合规性】(O04)",
        match: "严禁选择未来时间",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "货主类型",
        element: "row",
      },
    },
    details: [
      {
        title: "业务约束",
        items: [
          {
            label: "O04 严禁未来时间",
            content: "精确到秒，超出当前时间阻断提交。",
          },
          {
            label: "O05 切换清空",
            content: "切换货主类型清空主体信息、关联单号及已选货品。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-form-goods",
    targetId: "outbound-form-goods",
    number: 3,
    kind: "交互",
    title: "货品明细 · 选货弹窗与关联行独立勾选",
    content:
      "普通出库：点击【+ 添加货品】打开选货弹窗（未选货主提示‘请输入货主名称’ C01），弹窗先按货品分组展示，展开后选择具体库存位置并输入数量；不满足单仓条件时提示‘仅允许单个仓库出库’（O07）；选货回填后主行可展开查看二级位置明细。关联出库：通过关联单号带出货品明细，首列提供独立复选框【行选择】，行勾选与数量输入独立，不提供普通【添加货品】入口（O02）。",
    documentRefs: {
      rules: {
        section: "【普通出库选货与库存分组】(O01)",
        match: "添加货品",
        element: "text",
      },
    },
    details: [
      {
        title: "选货与扣减规则",
        items: [
          {
            label: "O02 行独立选择",
            content: "品类数按勾选行计数，总数量和价值仅统计已勾选且填写有效数量的行。",
          },
          {
            label: "O07 选货弹窗",
            content: "支持仓库货物筛选、正倒序排列与多仓提示。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-form-pickup",
    targetId: "outbound-form-pickup",
    number: 4,
    kind: "字段",
    title: "提货信息 · 提货主体与现场照片必传",
    content:
      "个人提货：**提货经办人** 须 **提货人信息** 域 `PartnerArchiveEmbeddedPicker` + 快捷建档（O06a · PP-R01），不触发货主 P02；选中后姓名/证号/电话只读反显。企业提货主体字段仍手输（P2 双层结构见 08 序号 14）。现场照片 1~10 张必传（C06）；审批通过后生成提货单（O11）。",
    documentRefs: {
      rules: {
        section: "【提货单自动生成与现场影像存证】(O11)",
        match: "现场照片",
        element: "text",
      },
    },
    details: [
      {
        title: "影像要求",
        items: [
          {
            label: "提货人域隔离",
            content:
              "【合作方改造-存量业务单据协同规格】3.3：经办人 archiveMenu=提货人信息；与货主信息域分字段。",
          },
          {
            label: "必传约束",
            content: "至少上传 1 张出库现场实物照片，支持缩略图与大图预览。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-form-summary",
    targetId: "outbound-form-summary",
    number: 5,
    kind: "规则",
    title: "固定底栏 · 统计汇总与原子提交前置校验",
    content:
      "固定底栏实时统计货品品类数、货品总数量；关联出库额外展示货物价值约（万元）。提交时校验库存可用量短时锁定（O09）、解押前置准入合规（O10）、Token 防重提交（C07），审批通过同一事务扣减可用库存并向证据管理输出带负号『-』流水（O16）。",
    documentRefs: {
      rules: {
        section: "【库存行级锁与防双花扣减】(O09)",
        match: "短时库存锁",
        element: "text",
      },
    },
    details: [
      {
        title: "原子提交",
        items: [
          {
            label: "O16 物证负号",
            content: "出库审批通过后向证据管理输出带负号『-』实物扣减记录。",
          },
        ],
      },
    ],
  },
]
