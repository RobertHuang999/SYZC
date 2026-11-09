import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deliveryOrderDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "delivery-detail-header",
    targetId: "delivery-detail-header",
    number: 1,
    kind: "页面",
    title: "提货单详情头部与状态凭据",
    content:
      "头部清晰展示当前提货单号、关联出库单号（附带一键复制图标）、当前单据流转状态印章/徽标（未提货/已提货/已取消）。若处于未提货状态，右上角提供【核销提货码】与【确认提货】快捷操作入口。",
    documentRefs: {
      prd: {
        section: "5.2 出库详情弹窗（P-CKG-010-DETAIL）",
        match: "出库单号、复制图标",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段（列表与筛选）",
        match: "出库单号",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【出库详情弹窗复用与提货记录回写】(R07)",
        element: "text",
      },
    },
    details: [
      {
        title: "头部凭据与动作",
        items: [
          {
            label: "状态指示",
            content: "未提货（琥珀黄）、已提货（翡翠绿）、已取消（冷灰）。",
          },
          {
            label: "快捷履约",
            content: "未提货状态下在详情头部直接提供核销提货码与确认提货按钮。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-detail-base-info",
    targetId: "delivery-detail-base-info",
    number: 2,
    kind: "字段",
    title: "单据基础信息与固化追溯",
    content:
      "展示关联出库单号、出库业务类型（普通出库/仓单出库/质押出库/抵押出库）、货主主体全称与统一社会信用代码/脱敏手机号、出库申请制单人（固化字段）、提货单系统自动生成落库时间（精确到秒）。",
    documentRefs: {
      fields: {
        section: "一、单据级业务字段（列表与筛选）",
        match: "货主名称/标识",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【列表操作人与时间字段固化】(R02)",
        element: "text",
      },
    },
    details: [
      {
        title: "字段映射与继承",
        items: [
          {
            label: "制单人固化",
            content: "R02 规则：始终为出库申请人，不被现场提货操作人覆盖。",
          },
          {
            label: "时间固化",
            content: "出库审批通过一瞬间系统自动写入的服务端时间戳。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-detail-pickup-profile",
    targetId: "delivery-detail-pickup-profile",
    number: 3,
    kind: "字段",
    title: "预留提货人主体档案 (R03)",
    content:
      "继承自出库制单时登记的预留提货人信息。个人提货人展示姓名、脱敏手机号、脱敏身份证号；企业提货人展示经办人姓名、经办人手机号、所属企业名称及统一社会信用代码。出库登记后提货人档案灰底锁定只读，防止被现场调包篡改。",
    documentRefs: {
      fields: {
        section: "二、提货人主体与经办人字段",
        match: "经办人/提货人姓名",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【提货人展示与企业悬停浮层】(R03)",
        element: "text",
      },
    },
    details: [
      {
        title: "提货主体档案",
        items: [
          {
            label: "防篡改",
            content: "预留提货人档案灰底只读，交接现场严格比对。",
          },
          {
            label: "脱敏规范",
            content: "手机号隐藏中间四位，身份证隐藏中间八位。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-detail-fulfillment-record",
    targetId: "delivery-detail-fulfillment-record",
    number: 4,
    kind: "规则",
    title: "现场履约凭据与提货记录回写 (R07)",
    content:
      "未提货状态下，区块居中灰字展示“暂无提货记录”空态；已提货状态下，完整回显履约存证：提货通道（4位动态码核销/免码直接确认）、核销操作人账号及机构、实际提货时间、是否本人提货凭据、提货车牌号、说明内容、现场提货交接照片（可点击放大预览）、原出库货物外观比对原图及物联网摄像头现场抓拍图（无设备时展示‘抓图失败/无监控设备’）。",
    documentRefs: {
      prd: {
        section: "5.2 出库详情弹窗（P-CKG-010-DETAIL）",
        match: "中部为【提货记录】板块",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【出库详情弹窗复用与提货记录回写】(R07)",
        element: "text",
      },
    },
    details: [
      {
        title: "履约回写规则",
        items: [
          {
            label: "未提货空态",
            content: "居中灰字展示【暂无提货记录】。",
          },
          {
            label: "已提货存证",
            content: "完整固化操作人、时间、本人凭据、现场照片及抓拍图。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-detail-goods-table",
    targetId: "delivery-detail-goods-table",
    number: 5,
    kind: "字段",
    title: "出库货品与储位分配明细",
    content:
      "表格展示本次提货对应的货品大类、品类、规格/属性、出库提货数量与计量单位。支持展开二级储位详情，包括实体仓库、监管库房、仓储分区、具体货位/条码及分布数量，账实严格对应出库审批扣减流水。",
    documentRefs: {
      fields: {
        section: "一、单据级业务字段（列表与筛选）",
        match: "货物",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【出库单终审原子生成提货单】(R01)",
        element: "text",
      },
    },
    details: [
      {
        title: "明细核验",
        items: [
          {
            label: "账实核对",
            content: "严格对应上游出库审批扣减流水。",
          },
          {
            label: "储位分布",
            content: "展示仓库、库房、分区、具体储位与条码。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-detail-audit-logs",
    targetId: "delivery-detail-audit-logs",
    number: 6,
    kind: "规则",
    title: "全过程不可变时间轴审计记录 (R08)",
    content:
      "按发生时间倒序排布提货单全生命周期所有关键事件（生成、获取提货码、重置提货码、免码确认、动态码核销、取消提货），包含经办人、精确时间戳及说明留言，满足司法级合规与资方穿透审计要求。",
    documentRefs: {
      prd: {
        section: "5.6 操作记录时间轴弹窗",
        match: "涵盖 6 大事件节点",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【操作记录全生命周期审计】(R08)",
        element: "text",
      },
    },
    details: [
      {
        title: "审计合规",
        items: [
          {
            label: "时间倒序",
            content: "最新事件在最上方，时间精确到秒。",
          },
          {
            label: "防篡改",
            content: "所有事件入库即固化，禁止物理删除或改写。",
          },
        ],
      },
    ],
  },
]
