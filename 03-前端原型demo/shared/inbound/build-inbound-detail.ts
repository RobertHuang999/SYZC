/** PC / H5 共用的入库详情 Mock 构造（字段口径一致，对齐 11yuanma 现网字段） */

export type InboundCheckStatus = 0 | 1 | 2 | 3 | 4

export const INBOUND_STATUS_MAP: Record<InboundCheckStatus, string> = {
  0: "待审核",
  1: "审核中",
  2: "已通过",
  3: "未通过",
  4: "已撤销",
}

export type InboundListRowForDetail = {
  id: string
  orderNo: string
  ownerName: string
  ownerType?: "1" | "2"
  ownerIdentifierMasked: string
  inboundType: string
  inboundDate: string
  warehouseName: string
  houseNames?: string
  relatedOrderNo: string | null
  goodsNames: string[]
  inboundQuantity: number
  unit?: string
  creatorDisplay: string
  createdAt: string
  checkStatus?: InboundCheckStatus
  revokedTime?: string | null
  remark?: string | null
}

export type InboundStackLine = {
  id?: string
  storeroom: string
  zone: string
  position: string
  amount: number
  unit: string
  quantityLabel: string
  qrCodeNo: string
  qrCodeUrl: string
}

export type InboundGoodsDetailLine = {
  id: string
  name: string
  cateName?: string
  typeName?: string
  specName?: string
  otherInfo: string
  amount: number
  unit: string
  totalQuantityLabel: string
  remark: string
  stacks: InboundStackLine[]
  scenePhotos: string[]
  supplementaryImages: { name: string; url: string }[]
  supplementaryDocuments: { name: string; url: string; size: string }[]
}

export type InboundAuditStep = {
  node: string
  actor: string
  time: string
  action: string
  opinion?: string
}

export type InboundModifyLog = {
  fieldLabel: string
  beforeValue: string
  afterValue: string
  operator: string
  operatedAt: string
}

export type InboundIotCapture = {
  id: string
  deviceName: string
  capturedAt: string
  status: "成功" | "失败"
  thumbnailLabel: string
  imageUrl?: string
}

export type InboundRecordDetail = {
  id: string
  orderNo: string
  ownerName: string
  ownerType: "1" | "2"
  ownerIdentifierMasked: string
  inboundType: string
  inboundDate: string
  warehouseName: string
  houseNames: string
  relatedOrderNo: string | null
  remark: string | null
  creatorDisplay: string
  createdAt: string
  checkStatus: InboundCheckStatus
  statusLabel: string
  revokedTime?: string | null
  goodsLines: InboundGoodsDetailLine[]
  auditTrail: InboundAuditStep[]
  modifyLogs: InboundModifyLog[]
  iotCaptures: InboundIotCapture[]
}

const DEFAULT_SCENE_PHOTOS = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=80",
]

function buildGoodsLines(row: InboundListRowForDetail): InboundGoodsDetailLine[] {
  return row.goodsNames.map((name, index) => {
    const portion =
      row.goodsNames.length === 1
        ? row.inboundQuantity
        : Math.round((row.inboundQuantity / row.goodsNames.length) * 100) / 100
    const unit =
      row.unit ||
      (name.includes("电解铜") || name.includes("吨") || row.inboundQuantity >= 50
        ? "吨"
        : "公斤")
    const qtyLabel = `${portion.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}${unit}`

    const houseBase = row.houseNames || `${row.warehouseName.replace("仓库", "").replace("-冻库1审核", "")}1号库`

    return {
      id: `${row.id}-goods-${index}`,
      name,
      otherInfo: index === 0 ? "车辆：川A·876B2（13.5米高栏）" : "生产批次：20260518-A",
      amount: portion,
      unit,
      totalQuantityLabel: qtyLabel,
      remark: index === 0 ? "进场验收外观完好，铅封完好，过磅核验一致。" : "——",
      stacks: [
        {
          id: `${row.id}-stack-${index}-1`,
          storeroom: houseBase,
          zone: "分区1冷藏",
          position: index === 0 ? "一楼 A 垛 01" : "一楼 B 垛 03",
          amount: portion,
          unit,
          quantityLabel: qtyLabel,
          qrCodeNo: `SYZC-${row.orderNo.slice(-8)}-${index + 1}-01`,
          qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SYZC-" + row.orderNo,
        },
      ],
      scenePhotos: DEFAULT_SCENE_PHOTOS,
      supplementaryImages: [
        {
          name: "过磅单现场抓拍.jpg",
          url: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&auto=format&fit=crop&q=80",
        },
      ],
      supplementaryDocuments: [
        {
          name: "到货质检合格证明与铅封记录.pdf",
          url: "https://example.com/inbound-inspect-cert.pdf",
          size: "1.2 MB",
        },
      ],
    }
  })
}

function bumpTime(time: string, addMinutes: number): string {
  const m = time.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2}):(\d{2})$/)
  if (!m) return time
  const d = new Date(`${m[1]}T${m[2]}:${m[3]}:${m[4]}`)
  d.setMinutes(d.getMinutes() + addMinutes)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${m[1]} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function buildInboundRecordDetail(row: InboundListRowForDetail): InboundRecordDetail {
  const checkStatus = row.checkStatus ?? 2
  const statusLabel = INBOUND_STATUS_MAP[checkStatus] || "已通过"

  const auditTrail: InboundAuditStep[] = [
    {
      node: "发起申请",
      actor: row.creatorDisplay,
      time: row.createdAt,
      action: "提交入库审核申请",
      opinion: "现场货物验收合格，理货堆放已分配完毕，申请入库审批。",
    },
  ]

  if (checkStatus === 1) {
    auditTrail.push({
      node: "库管审核",
      actor: "黄主管(四川享宇科技有限公司)",
      time: bumpTime(row.createdAt, 5),
      action: "处理中",
      opinion: "正在进行现场视频抽查核验。",
    })
  } else if (checkStatus === 2) {
    auditTrail.push(
      {
        node: "库管审核",
        actor: "黄主管(四川享宇科技有限公司)",
        time: bumpTime(row.createdAt, 8),
        action: "审核通过",
        opinion: "现场货品核验一致，数量准确，准予入库。",
      },
      {
        node: "最终归档",
        actor: "系统自动",
        time: bumpTime(row.createdAt, 8),
        action: "入库完成，生成存货条码，更新库存台账",
      }
    )
  } else if (checkStatus === 3) {
    auditTrail.push({
      node: "库管审核",
      actor: "黄主管(四川享宇科技有限公司)",
      time: bumpTime(row.createdAt, 6),
      action: "审核未通过",
      opinion: "现场过磅单净重与系统录入数量偏差超过阈值，请重新核实后再次发起。",
    })
  } else if (checkStatus === 4) {
    auditTrail.push({
      node: "单据撤销",
      actor: row.creatorDisplay,
      time: row.revokedTime || bumpTime(row.createdAt, 15),
      action: "撤销申请",
      opinion: "制单人主动撤销申请（现场到货规格需重新调整）。",
    })
  }

  return {
    id: row.id,
    orderNo: row.orderNo,
    ownerName: row.ownerName,
    ownerType: row.ownerType ?? (row.ownerIdentifierMasked.startsWith("91") ? "2" : "1"),
    ownerIdentifierMasked: row.ownerIdentifierMasked,
    inboundType: row.inboundType,
    inboundDate: row.inboundDate,
    warehouseName: row.warehouseName,
    houseNames: row.houseNames || "1号冻库, 2号常温库",
    relatedOrderNo: row.relatedOrderNo,
    remark: row.remark ?? "进场已按供应链金融存货质押指引完成验收核对。",
    creatorDisplay: row.creatorDisplay,
    createdAt: row.createdAt,
    checkStatus,
    statusLabel,
    revokedTime: row.revokedTime,
    goodsLines: buildGoodsLines(row),
    auditTrail,
    modifyLogs:
      row.orderNo === "2059897000077811713"
        ? [
            {
              fieldLabel: "堆放位置 · 冻货-牛肉-36个月",
              beforeValue: "分区1冷藏 / 一楼 B 垛 · 48.29 公斤",
              afterValue: "分区1冷藏 / 一楼 A 垛 · 48.29 公斤",
              operator: "黄主管(四川享宇科技有限公司)",
              operatedAt: bumpTime(row.createdAt, 1),
            },
          ]
        : [],
    iotCaptures: [
      {
        id: `${row.id}-iot-1`,
        deviceName: "海霸王-卸货区-枪机03",
        capturedAt: row.inboundDate,
        status: "成功",
        thumbnailLabel: "入库抓拍-货位全景",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: `${row.id}-iot-2`,
        deviceName: "海霸王-月台-球机01",
        capturedAt: row.createdAt,
        status: row.orderNo === "2108429012345678901" ? "失败" : "成功",
        thumbnailLabel:
          row.orderNo === "2108429012345678901"
            ? "抓拍失败（网络超时，R18 降级）"
            : "入库抓拍-车牌特写",
        imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=80",
      },
    ],
  }
}

/** 与 PC `inbound-records.mock` 首条已通过台账对齐，供 H5 详情穿透 */
export function getCanonicalRowByOrderNo(
  orderNo: string
): InboundListRowForDetail | undefined {
  return CANONICAL_APPROVED_ROWS.find((r) => r.orderNo === orderNo)
}

export const CANONICAL_APPROVED_ROWS: InboundListRowForDetail[] = [
  {
    id: "inbound-1",
    orderNo: "2108438504322834433",
    ownerName: "乐富",
    ownerType: "1",
    ownerIdentifierMasked: "187****8900",
    inboundType: "普通入库",
    inboundDate: "2026-06-03 10:12:08",
    warehouseName: "海霸王仓库",
    houseNames: "1号冷冻库",
    relatedOrderNo: null,
    goodsNames: ["冻货-鸡翅-四川-特级-2025"],
    inboundQuantity: 1,
    unit: "吨",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-06-03 10:12:36",
    checkStatus: 2,
  },
  {
    id: "inbound-2",
    orderNo: "2108438504322834432",
    ownerName: "成都锦城冷链物流有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510104MA62XXXXX",
    inboundType: "普通入库",
    inboundDate: "2026-06-03 09:48:22",
    warehouseName: "海霸王仓库",
    houseNames: "1号冷冻库, 3号冷藏库",
    relatedOrderNo: null,
    goodsNames: [
      "冻货-鸡翅-四川-特级-2025",
      "冻货-牛肉-36个月",
      "冻货-鸡腿-四川",
    ],
    inboundQuantity: 1280.5,
    unit: "吨",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-06-03 09:49:01",
    checkStatus: 2,
  },
  {
    id: "inbound-3",
    orderNo: "2059897000077811713",
    ownerName: "李爱",
    ownerType: "1",
    ownerIdentifierMasked: "133****0027",
    inboundType: "普通入库",
    inboundDate: "2026-05-28 15:15:39",
    warehouseName: "海霸王仓库-冻库1审核",
    houseNames: "冻库1审核",
    relatedOrderNo: null,
    goodsNames: ["冻货-牛肉-36个月"],
    inboundQuantity: 182.33,
    unit: "公斤",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-05-28 15:18:12",
    checkStatus: 2,
  },
]
