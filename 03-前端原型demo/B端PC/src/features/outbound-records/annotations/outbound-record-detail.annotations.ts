import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const outboundRecordDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-detail-header",
    targetId: "outbound-detail-header",
    number: 1,
    kind: "页面",
    title: "出库详情 · 单据概览与不可变快照",
    content:
      "单据详情页（P-CKG-010-DETAIL）。顶部展示 19 位出库单号（支持一键复制）、返回按钮以及绿色【已通过】状态印章。展示内容为审批通过时固化的不可变历史业务快照，不因后续库存变动或关联单据变化而覆盖（O13）。",
    documentRefs: {
      prd: {
        section: "6.2 出库单详情页（P-CKG-010-DETAIL）",
        match: "已通过",
        element: "text",
      },
    },
    details: [
      {
        title: "快照保护",
        items: [
          {
            label: "O13 历史不可篡改",
            content: "审批通过固化快照，不随后续库存调整而反写。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-detail-basic",
    targetId: "outbound-detail-basic",
    number: 2,
    kind: "字段",
    title: "出库详情 · 基础信息与提货人回显",
    content:
      "展示制单人（账号+机构）、制单时间、货主名称/标识（脱敏）、出库日期、出库类型、仓库名称、关联单号及备注。若单据已完成提货，基础信息同步回显提货人类型、提货人姓名、脱敏身份证号、脱敏手机号及车牌号；未完成提货时不回显提货人（O11/O14）。",
    documentRefs: {
      fields: {
        section: "三、提货与影像字段",
        match: "提货人姓名",
        element: "row",
      },
    },
    details: [
      {
        title: "回显条件",
        items: [
          {
            label: "提货闭环",
            content: "仅在提货单完成回写后展示提货人回显字段。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-detail-pickup-record",
    targetId: "outbound-detail-pickup-record",
    number: 3,
    kind: "规则",
    title: "出库详情 · 提货信息 Tab（条件展示）",
    content:
      "【提货信息】为独立标签页：移库/转让出库展示免提货说明；待提货展示核销引导；提货完成后展示提货人登记信息与现场提货记录（操作人、提货时间、是否本人提货、其他说明、现场照片及设备抓拍图）。未提货时不展示已完成记录，防止事实混淆（O03/O11）。",
    documentRefs: {
      rules: {
        section: "【提货单自动生成与现场影像存证】(O11)",
        match: "提货记录",
        element: "text",
      },
    },
    details: [
      {
        title: "展示边界",
        items: [
          {
            label: "板块控制",
            content: "未提货或联动类出库单不呈现提货记录卡片。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-detail-goods-tab",
    targetId: "outbound-detail-goods-tab",
    number: 4,
    kind: "字段",
    title: "出库详情 · 货物明细按类型分流呈现",
    content:
      "普通出库：一级表格展示货物主行，首列提供展开箭头，展开后展示二级库存位置明细（位置、具体位置、入库时间、存货条码、出库数量），不提供操作列；抵押/质押/仓单出库：平铺明细表格，展示货物名称、其他信息、出库数量、仓库、库房、分区、出库前数量、出库后数量及存货条码二维码（O13）。",
    documentRefs: {
      fields: {
        section: "2.3 关联出库详情平铺字段",
        match: "出库前数量",
        element: "row",
      },
    },
    details: [
      {
        title: "样式分流",
        items: [
          {
            label: "平铺 vs 折叠",
            content: "普通出库二级展开；关联出库直接平铺展示扣减前后数量。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-detail-audit-tab",
    targetId: "outbound-detail-audit-tab",
    number: 5,
    kind: "交互",
    title: "出库详情 · 审核记录时间轴与自审禁止留痕",
    content:
      "时间轴全流程展示出库单审批履历：包含总流程名称、各审批节点、操作人（带所属机构）、操作时间、处理结果与审核意见。严格落实自审禁止原则（P06/R11/O12），审批中心专网流转全程审计留痕。",
    documentRefs: {
      rules: {
        section: "【审批专网独立流转与自审禁止】(O12)",
        match: "自审禁止",
        element: "text",
      },
    },
    details: [
      {
        title: "风控合规",
        items: [
          {
            label: "O12 自审禁止",
            content: "本人单据仅支持查看，审批中心专网专道处理。",
          },
        ],
      },
    ],
  },
]
