import type { ExportRecordItem } from "@/features/inventory-management/domain/types"

export function nowExportStamp() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  return {
    date,
    time,
    compact: `${date.replace(/-/g, "")}${time.replace(/:/g, "")}`,
    display: `${date} ${time}`,
  }
}

export function createDocumentExportRecord(args: {
  kind: "入库堆放明细" | "出库扣减明细"
  orderNo: string
  recordCount: number
  creator?: string
  creatorOrg?: string
  status?: ExportRecordItem["status"]
  createTime?: string
  fileSize?: string
}): ExportRecordItem {
  const stamp = nowExportStamp()
  const compactFromTime = args.createTime
    ? args.createTime.replace(/\D/g, "").slice(0, 14)
    : stamp.compact
  return {
    id: `DOC-EXP-${args.orderNo}-${compactFromTime}`,
    fileName: `${args.kind}-${args.orderNo}-${compactFromTime}.xlsx`,
    viewDimension: args.kind,
    filterSummary: `单据编号 ${args.orderNo}`,
    recordCount: args.recordCount,
    fileSize: args.fileSize ?? "86.4 KB",
    creator: args.creator ?? "lxy",
    creatorOrg: args.creatorOrg ?? "四川享宇科技有限公司",
    createTime: args.createTime ?? stamp.display,
    status: args.status ?? "GENERATING",
    downloadUrl: "#",
  }
}

export const DEFAULT_INBOUND_EXPORT_RECORDS: ExportRecordItem[] = [
  createDocumentExportRecord({
    kind: "入库堆放明细",
    orderNo: "RK202611120005541",
    recordCount: 3,
    creator: "王五",
    creatorOrg: "江苏无锡锡山保税监管仓",
    status: "SUCCESS",
    createTime: "2026-11-12 09:40:18",
    fileSize: "128.6 KB",
  }),
  createDocumentExportRecord({
    kind: "入库堆放明细",
    orderNo: "2108777000011222333",
    recordCount: 3,
    creator: "王监管",
    creatorOrg: "华东仓储运营中心",
    status: "SUCCESS",
    createTime: "2026-06-01 14:22:06",
    fileSize: "96.2 KB",
  }),
  createDocumentExportRecord({
    kind: "入库堆放明细",
    orderNo: "2108438504322834432",
    recordCount: 3,
    creator: "lxy",
    creatorOrg: "四川享宇科技有限公司",
    status: "SUCCESS",
    createTime: "2026-06-03 10:08:41",
    fileSize: "90.1 KB",
  }),
]

export const DEFAULT_OUTBOUND_EXPORT_RECORDS: ExportRecordItem[] = [
  createDocumentExportRecord({
    kind: "出库扣减明细",
    orderNo: "CK202611120008892",
    recordCount: 2,
    creator: "张三",
    creatorOrg: "上海宝山一号钢材监管仓",
    status: "SUCCESS",
    createTime: "2026-11-12 10:52:08",
    fileSize: "112.0 KB",
  }),
  createDocumentExportRecord({
    kind: "出库扣减明细",
    orderNo: "20617289020070320130",
    recordCount: 2,
    creator: "lxy",
    creatorOrg: "四川享宇科技有限公司",
    status: "SUCCESS",
    createTime: "2026-06-03 11:08:22",
    fileSize: "104.5 KB",
  }),
  createDocumentExportRecord({
    kind: "出库扣减明细",
    orderNo: "2060512891000123406",
    recordCount: 2,
    creator: "lxy",
    creatorOrg: "四川享宇科技有限公司",
    status: "SUCCESS",
    createTime: "2026-05-09 13:40:00",
    fileSize: "78.8 KB",
  }),
]
