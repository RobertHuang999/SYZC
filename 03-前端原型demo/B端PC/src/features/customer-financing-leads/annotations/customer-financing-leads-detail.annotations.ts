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
    ],
  },
  {
    id: "lead-detail-assets",
    targetId: "lead-detail-assets",
    number: 3,
    kind: "字段",
    title: "抵/质押资产清单与仓单穿透调阅",
    content:
      "详细展示动产质押标的明细。若为仓单质押，展示仓单编号、开单仓库并支持点击 Deep link 穿透至【仓单管理 -> 仓单档案详情】；若为存货抵押，展示货品大类、品类、规格、数量吨位及申报公允货值。",
    documentRefs: {
      prd: { section: "5.2 详情交互抽屉/页面", match: "抵质押资产清单", element: "text" },
      fields: { section: "二、明细字段", match: "存货明细", element: "row" },
      rules: { section: "一、对象定位与单据层级", match: "核心职责", element: "text" },
    },
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
    targetId: "lead-detail-timeline",
    number: 4,
    kind: "规则",
    title: "全流程流转时间轴与司法存证 (P03)",
    content:
      "垂直呈现线索从外部接口接入、运营初审核验、路由分流指派到下游任务派发的完整履约轨迹，记录每个节点的处理人员、所属机构、时间戳与操作意见，证据链完整不可篡改。",
    documentRefs: {
      prd: { section: "5.2 详情交互抽屉/页面", match: "全流程流转时间轴", element: "text" },
      fields: { section: "三、系统与审计字段", match: "最新处理时间", element: "row" },
      rules: { section: "八、权限、风控与安全控制 (P01 ~ P03)", match: "【全路径操作审计日志留痕】(P03)", element: "text" },
    },
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
]
