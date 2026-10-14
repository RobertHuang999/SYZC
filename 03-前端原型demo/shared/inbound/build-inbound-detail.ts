/** PC / H5 共用的入库详情 Mock 构造（字段口径一致，对齐 11yuanma 现网字段） */

import {
  INBOUND_APPROVED_SEEDS,
  approvedSeedToListRow,
} from "./inbound-approved-seed"
import {
  formatCollectValuesAsOtherInfo,
  formatInboundGoodsLineName,
  formatInboundQuantityLabel,
  parseInboundGoodsName,
} from "./inbound-goods-display"
import {
  formatSpecSummary,
  getSkuById,
  listSkus,
  measureLabelFromParam,
  type GoodsSkuRecord,
} from "../goods/goods-sku-catalog"

export type InboundCheckStatus = 0 | 1 | 2 | 3 | 4

export const INBOUND_STATUS_MAP: Record<InboundCheckStatus, string> = {
  0: "待审核",
  1: "审核中",
  2: "已通过",
  3: "未通过",
  4: "已撤销",
}

/** 多货品明细行：各行独立计量（对齐制单多卡片） */
export type InboundGoodsLineItem = {
  name: string
  amount: number
  unit?: string
}

export type { SeedGoodsLineItem } from "./inbound-approved-seed"

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
  /** 各行数量之和宜与 inboundQuantity 一致（列表汇总）；未传则均分 inboundQuantity */
  goodsLineItems?: InboundGoodsLineItem[]
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
  skuId?: string
  category: string
  variety: string
  spec: string
  measureLabel: string
  otherInfo: string
  amount: number
  unit: string
  totalQuantityLabel: string
  remark: string
  stacks: InboundStackLine[]
  scenePhotos: string[]
  supplementaryImages: { name: string; url: string }[]
  supplementaryDocuments: { name: string; url: string; size: string }[]
  /** 该货品行关联库区的 IoT 抓拍（R18）；与现场照片同属货品行附件 */
  iotCaptures: InboundIotCapture[]
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

const IOT_CAPTURE_IMAGES = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=80",
]

function buildLineIotCaptures(
  row: InboundListRowForDetail,
  index: number,
  storeroomLabel: string,
  goodsName: string
): InboundIotCapture[] {
  const failOrder = row.orderNo === "2108429012345678901" && index === 0
  return [
    {
      id: `${row.id}-iot-goods-${index}`,
      deviceName: `${storeroomLabel}-垛位枪机`,
      capturedAt: bumpTime(row.inboundDate, index * 3),
      status: failOrder ? "失败" : "成功",
      thumbnailLabel: failOrder
        ? `抓拍失败（网络超时，R18 降级）· ${goodsName}`
        : `入库抓拍-货位全景 · ${goodsName}`,
      imageUrl: failOrder ? undefined : IOT_CAPTURE_IMAGES[index % IOT_CAPTURE_IMAGES.length],
    },
  ]
}

const DEFAULT_SCENE_PHOTOS = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=80",
]

function resolveSkuForGoodsName(name: string): GoodsSkuRecord | undefined {
  const { category, variety, spec } = parseInboundGoodsName(name)
  if (!category || !variety) return undefined
  const candidates = listSkus(category, variety)
  return candidates.find((sku) => {
    const specLabel = formatSpecSummary(sku.specValues)
    return specLabel === spec || name.includes(specLabel)
  })
}

function demoCollectOtherInfo(sku: GoodsSkuRecord | undefined, index: number): string {
  if (!sku || sku.inboundCollect.length === 0) {
    return index === 0 ? "无：--" : "无：--"
  }
  const labels: Record<string, string> = {}
  const values: Record<string, string> = {}
  for (const field of sku.inboundCollect) {
    labels[field.fieldKey] = field.label
    if (field.fieldKey.includes("vehicle") || field.label.includes("车")) {
      values[field.fieldKey] = "川A·876B2（13.5米高栏）"
    } else if (field.control === "date") {
      values[field.fieldKey] = "2026-05-18"
    } else {
      values[field.fieldKey] = field.options?.[0] ?? "—"
    }
  }
  return formatCollectValuesAsOtherInfo(values, labels)
}

function resolveGoodsLineItems(row: InboundListRowForDetail): InboundGoodsLineItem[] {
  if (row.goodsLineItems?.length) {
    return row.goodsLineItems
  }
  return row.goodsNames.map((name) => ({
    name,
    amount:
      row.goodsNames.length === 1
        ? row.inboundQuantity
        : Math.round((row.inboundQuantity / row.goodsNames.length) * 100) / 100,
    unit: row.unit,
  }))
}

function buildGoodsLines(row: InboundListRowForDetail): InboundGoodsDetailLine[] {
  const lineItems = resolveGoodsLineItems(row)
  return lineItems.map((item, index) => {
    const name = item.name
    const parsed = parseInboundGoodsName(name)
    const sku = resolveSkuForGoodsName(name)
    const portion = item.amount
    const unit = sku?.measureUnit ?? item.unit ?? row.unit ?? "吨"
    const measureLabel = sku
      ? measureLabelFromParam(sku.measureParam)
      : unit === "吨" || unit === "公斤"
        ? "重量"
        : "数量"
    const qtyLabel = formatInboundQuantityLabel(portion, unit)

    const houseBase =
      row.houseNames?.split(/[,，]/)[0]?.trim() ||
      `${row.warehouseName.replace("仓库", "").replace("-冻库1审核", "")}1号库`

    return {
      id: sku?.skuId ? `${row.id}-${sku.skuId}` : `${row.id}-goods-${index}`,
      name,
      skuId: sku?.skuId,
      category: sku?.category ?? parsed.category,
      variety: sku?.variety ?? parsed.variety,
      spec: sku ? formatSpecSummary(sku.specValues) : parsed.spec,
      measureLabel,
      otherInfo: demoCollectOtherInfo(sku, index),
      amount: portion,
      unit,
      totalQuantityLabel: qtyLabel,
      remark: index === 0 ? "进场验收外观完好，铅封完好，过磅核验一致。" : "——",
      stacks: [
        {
          id: `${row.id}-stack-${index}-1`,
          storeroom: houseBase,
      zone: index === 0 ? "审核分区" : index === 1 ? "分区2冷藏" : "分区3常温",
      position: index === 0 ? "一楼 A 垛 01" : index === 1 ? "一楼 B 垛 03" : "二楼 C 垛 05",
          amount: portion,
          unit,
          quantityLabel: qtyLabel,
          qrCodeNo: `SYZC-${row.orderNo.slice(-8)}-${index + 1}-01`,
          qrCodeUrl:
            "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SYZC-" +
            row.orderNo,
        },
      ],
      scenePhotos: DEFAULT_SCENE_PHOTOS.slice(0, index === 0 ? 3 : 1),
      supplementaryImages:
        index === 0
          ? [
              {
                name: "过磅单现场抓拍.jpg",
                url: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&auto=format&fit=crop&q=80",
              },
            ]
          : [],
      supplementaryDocuments:
        index === 0
          ? [
              {
                name: "到货质检合格证明与铅封记录.pdf",
                url: "https://example.com/inbound-inspect-cert.pdf",
                size: "1.2 MB",
              },
            ]
          : [],
      iotCaptures: buildLineIotCaptures(row, index, houseBase, name),
    }
  })
}

/** 制单货品行 → 详情货品行（PC/H5 发起提交快照口径） */
export type InboundFormGoodsSnapshot = {
  id: string
  skuId: string
  category: string
  variety: string
  spec: string
  measureValue: string
  measureUnit: string
  measureLabel: string
  collectValues: Record<string, string>
  collectLabels?: Record<string, string>
  remark: string
  stackings: {
    storeroomLabel: string
    partitionLabel: string
    locationText: string
    quantity: string
  }[]
  sitePhotoCount: number
  supplementCount: number
}

export function buildGoodsDetailLineFromFormSnapshot(
  row: InboundListRowForDetail,
  line: InboundFormGoodsSnapshot,
  index: number
): InboundGoodsDetailLine {
  const sku = line.skuId ? getSkuById(line.skuId) : undefined
  const amount = Number.parseFloat(line.measureValue) || 0
  const unit = line.measureUnit || sku?.measureUnit || "吨"
  const name = formatInboundGoodsLineName({
    category: line.category,
    variety: line.variety,
    spec: line.spec,
  })
  const labels: Record<string, string> = { ...line.collectLabels }
  if (sku) {
    for (const f of sku.inboundCollect) labels[f.fieldKey] = f.label
  }
  const qtyLabel = formatInboundQuantityLabel(amount, unit)

  return {
    id: line.id,
    name,
    skuId: line.skuId,
    category: line.category,
    variety: line.variety,
    spec: line.spec,
    measureLabel: line.measureLabel || (sku ? measureLabelFromParam(sku.measureParam) : "计量数量"),
    otherInfo: formatCollectValuesAsOtherInfo(line.collectValues, labels),
    amount,
    unit,
    totalQuantityLabel: qtyLabel,
    remark: line.remark.trim() || "——",
    stacks: line.stackings.map((stack, sIdx) => {
      const stackAmount = Number.parseFloat(stack.quantity) || 0
      return {
        id: `${line.id}-stack-${sIdx}`,
        storeroom: stack.storeroomLabel,
        zone: stack.partitionLabel,
        position: stack.locationText || "—",
        amount: stackAmount,
        unit,
        quantityLabel: formatInboundQuantityLabel(stackAmount, unit),
        qrCodeNo: `SYZC-${row.orderNo.slice(-8)}-${index + 1}-${String(sIdx + 1).padStart(2, "0")}`,
        qrCodeUrl:
          "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SYZC-" + row.orderNo,
      }
    }),
    scenePhotos: DEFAULT_SCENE_PHOTOS.slice(0, Math.min(line.sitePhotoCount || 1, 3)),
    supplementaryImages:
      line.supplementCount > 0
        ? [
            {
              name: "补充资料.jpg",
              url: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&auto=format&fit=crop&q=80",
            },
          ]
        : [],
    supplementaryDocuments: [],
    iotCaptures: buildLineIotCaptures(row, index, line.stackings[0]?.storeroomLabel ?? row.warehouseName, name),
  }
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
    /** 单据级已废弃：IoT 抓拍挂在各 `goodsLines[].iotCaptures` */
    iotCaptures: [],
  }
}

/** 与 PC `inbound-records.mock` 首条已通过台账对齐，供 H5 详情穿透 */
export function getCanonicalRowByOrderNo(
  orderNo: string
): InboundListRowForDetail | undefined {
  return CANONICAL_APPROVED_ROWS.find((r) => r.orderNo === orderNo)
}

export const CANONICAL_APPROVED_ROWS: InboundListRowForDetail[] =
  INBOUND_APPROVED_SEEDS.map(approvedSeedToListRow)
