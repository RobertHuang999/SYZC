import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const customerFinancingLeadsDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "lead-detail-header",
    targetId: "lead-detail-header",
    number: 1,
    kind: "页面",
    title: "线索详情摘要与状态看板",
    content:
      "顶部展示线索全局唯一流水编号、外部申请流水号、当前融资状态徽标及核心操作按钮。遵循全生命周期审计留痕（P03），展示申请时间、受理人、最新操作人与时间戳。",
    documentRefs: {
      prd: { section: "5.2 详情交互抽屉/页面", match: "基本信息区", element: "text" },
      fields: { section: "三、系统与审计字段", match: "线索唯一标识", element: "row" },
      rules: { section: "三、全景业务状态机与时序图", match: "状态名称", element: "row" },
    },
    details: [
      {
        title: "状态控制",
        items: [
          {
            label: "待受理",
            content: "可直接在详情顶部操作【基础校验通过并受理】或【驳回】。",
          },
          {
            label: "已受理",
            content: "展示受理人及受理时间戳，顶部开放【分配跟进】及【主动驳回】按钮。",
          },
          {
            label: "申请失败",
            content: "标红展示驳回原因与详细驳回说明，提供前往【被拒退回池】的指引链接。",
          },
        ],
      },
      {
        title: "详情可做什么",
        items: [
          {
            label: "状态与操作对应图",
            content: `flowchart TD
    A["待受理"] -->|基础校验通过并受理| B["已受理"]
    A -->|驳回| C["申请失败"]
    B -->|分配跟进（快照分流）| D["处理中"]
    B -->|主动驳回| C
    D --> E["下游尽调 / 授信办理"]
    C --> F["被拒退回池 → 线索被拒"]`,
          },
        ],
      },
    ],
  },
  {
    id: "lead-detail-applicant",
    targetId: "lead-detail-applicant",
    number: 2,
    kind: "字段",
    title: "申请主体资质卡片与隐私合规脱敏",
    content:
      "企业货主展示公司名称、统一社会信用代码、法定代表人或经办人姓名及脱敏手机号，支持营业执照凭据点击预览；个人货主展示姓名、脱敏身份证号与脱敏手机号，遵循个人信息保护法与隐私安全控制规范。",
    documentRefs: {
      prd: { section: "5.2 详情交互抽屉/页面", match: "申请主体资质卡片", element: "text" },
      fields: { section: "一、业务字段", match: "申请人标识", element: "row" },
      rules: { section: "六、核心业务规则清单 (R01 ~ R08)", match: "【申请要素必填与格式合规校验规则】(R01)", element: "text" },
    },
    details: [
      {
        title: "脱敏规范",
        items: [
          {
            label: "手机号脱敏",
            content: "前3位及后4位明文，中间4位掩码显示（如 138****6688）。",
          },
          {
            label: "身份证号脱敏",
            content: "前6位及后4位明文，中间8位掩码显示（如 4201**********6682）。",
          },
        ],
      },
      {
        title: "申请主体字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **线索编号** | 只读文本 | 系统生成 | 全局唯一流水号 | 可复制 | — |
| **外部申请流水号** | 只读文本 | 必填 | 第三方推送流水号 | 单行 | 用于防重 (R02) |
| **申请人名称** | 只读文本 | 必填 | 企业全称 / 个人姓名 | 单行 | — |
| **统一社会信用代码 / 身份证号** | 只读文本 | 条件必填 | 18 位，脱敏 | 单行 | 个人脱敏中间 8 位 |
| **法定代表人 / 经办人** | 只读文本 | 条件展示 | 姓名 | 单行 | 企业货主展示 |
| **联系电话** | 只读文本 | 必填 | 11 位，脱敏中间 4 位 | 单行 | — |
| **营业执照** | 缩略图 | 条件展示 | 点击预览大图 | 单行 | 企业货主必备 |
| **产品名称** | 只读文本 | 必填 | 融资产品名 | 单行 | — |
| **融资状态** | 状态标签 | 系统维护 | 待受理 / 已受理 / 处理中 / 申请成功 / 申请失败 | 彩色标签 | — |`,
          },
        ],
      },
    ],
  },
  {
    id: "lead-detail-assets",
    documentRefs: {
      fields: { section: "二、明细字段", match: "支持多仓单展示，提供 Deep link 点击跳转仓单档案详情", element: "row" },
    },
    targetId: "lead-detail-assets",
    number: 3,
    kind: "字段",
    title: "抵/质押资产清单与仓单穿透调阅",
    content:
      "详细展示动产质押标的明细。若为仓单质押，展示仓单编号、开单仓库并支持点击 Deep link 穿透至【仓单管理 -> 仓单档案详情】；若为存货抵押，展示货品大类、品类、规格、数量吨位及申报公允货值。",
    details: [
      {
        title: "资产穿透",
        items: [
          {
            label: "仓单档案联动",
            content: "仓单单号支持一键复制，点击可平滑穿透调阅该仓单的物理库位与质押记录。",
          },
        ],
      },
    ],
  },
  {
    id: "lead-detail-timeline",
    documentRefs: {
      rules: { section: "2. 路由分流与执行规则" },
      prd: { section: "修订记录", match: "完善线索接入、受理与路由分流规格", element: "row" },
    },
    targetId: "lead-detail-timeline",
    number: 4,
    kind: "规则",
    title: "全流程流转时间轴与司法存证 (P03)",
    content:
      "垂直呈现线索从外部接口接入、运营初审核验、路由分流指派到下游任务派发的完整履约轨迹，记录每个节点的处理人员、所属机构、时间戳与操作意见，证据链完整不可篡改。",
    details: [
      {
        title: "审计要点",
        items: [
          {
            label: "节点留痕",
            content: "每个节点固化操作快照，包含接入时的意向额度与需要尽调初始标记。",
          },
        ],
      },
    ],
  },
  {
    id: "lead-detail-actions",
    documentRefs: {
      prd: { section: "1.1 业务背景" },
      fields: { section: "一、业务字段", match: "枚举：待受理、处理中、申请成功、申请失败", element: "row" },
    },
    targetId: "lead-detail-header",
    number: 98,
    kind: "交互",
    title: "页头操作与业务提示",
    content:
      "待受理可受理或驳回；已受理可分配跟进或主动驳回；失败后引导去被拒池。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "按钮与提示",
            content: `| 操作 | 可见状态 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **基础校验通过并受理** | 待受理 | 状态置已受理并记录受理人时间 | — |
| **分配跟进** | 已受理 | 按需要尽调快照分流派单，状态置处理中 | 未选对象时阻断「请选择跟进对象」 |
| **驳回** | 待受理 / 已受理 | 必填原因分类与说明后置申请失败并入被拒池 | 「请填写驳回原因（最多 200 字）」 |
| **前往被拒退回池** | 申请失败 | 跳转被拒池线索标签页 | — |`,
          },
        ],
      },
    ],
  },
]
