import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const relocationRecordAnnotations: PrototypeAnnotation[] = [
  {
    id: "relocation-list-page",
    targetId: "relocation-list-page",
    number: 1,
    kind: "页面",
    title: "移库记录台账定位",
    content:
      "移库是同一监管仓库内部的储位调拨，只改物理位置、不改变货权归属。本台账只收录审批通过的移库单，已生效单据不支持反审批撤回，需要回移时按反向重新发起一笔移库。",
  },
  {
    id: "relocation-list-filter",
    targetId: "relocation-list-filter",
    number: 2,
    kind: "字段",
    title: "筛选区与默认 4 项",
    content:
      "默认展示移库单号、移库日期、货主名称/标识、移库类型四项；仓库名称、货品名称、制单人、制单时间放在展开区。按移库业务规则，本台账不设状态筛选和重置按钮。",
  },
  {
    id: "relocation-list-table",
    targetId: "relocation-list-table",
    number: 3,
    kind: "字段",
    title: "列表 9 列与操作极简",
    content:
      "列表按字段清单固定顺序展示：序号、移库单号、货主名称/标识、移库时间、移库类型、仓库名称、货物名称、移库数量、制单人、操作。操作列只保留【查看详情】。",
  },
  {
    id: "relocation-form-goods",
    targetId: "relocation-form-goods",
    number: 4,
    kind: "交互",
    title: "同仓移库与目标储位必填",
    content:
      "移库只允许在同一个仓库内换库房/分区，跨仓库必须走出库加入库。每一条货品都要选择移入库房/分区，移库数量不能超过该储位可用量。",
  },
  {
    id: "relocation-detail-goods",
    targetId: "relocation-detail-goods",
    number: 5,
    kind: "字段",
    title: "详情展示移出与移入位置",
    content:
      "详情按货品列出移出位置、移出具体位置、入库时间、条码、移库数量和移入位置，方便现场核对与审计追溯。",
  },
]
