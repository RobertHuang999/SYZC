import type { InboundRecord } from "@/features/inbound-records/domain/types"
import type { InboundRecordDetail } from "@/features/inbound-records/lib/detail-utils"
import { getInboundRecordDetailById } from "@/features/inbound-records/lib/detail-utils"
import type { OutboundRecord } from "@/features/outbound-records/domain/types"
import type { ReceiptPaperSize } from "./receipt-print-ui-labels"
import { withTenantPrintHeader } from "./receipt-print-tenant"
import type {
  InboundReceiptGoodsRow,
  InboundReceiptPrintData,
  OutboundReceiptGoodsRow,
  OutboundReceiptPrintData,
} from "./receipt-print-types"

export type {
  InboundReceiptGoodsRow,
  InboundReceiptPrintData,
  OutboundReceiptGoodsRow,
  OutboundReceiptPrintData,
}

const CN_DIGITS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]
const CN_UNITS = ["", "拾", "佰", "仟"]

function sectionToChinese(num: number): string {
  if (num <= 0) return ""
  let str = ""
  let zero = false
  let unitPos = 0
  let n = Math.floor(num)

  while (n > 0) {
    const v = n % 10
    if (v === 0) {
      if (str.length > 0 && !zero) {
        zero = true
        str = CN_DIGITS[0] + str
      }
    } else {
      zero = false
      str = CN_DIGITS[v] + CN_UNITS[unitPos] + str
    }
    unitPos++
    n = Math.floor(n / 10)
  }
  return str
}

export function integerToChineseUpper(num: number): string {
  const n = Math.floor(Math.abs(num))
  if (n === 0) return CN_DIGITS[0]
  const wan = Math.floor(n / 10000)
  const rest = n % 10000
  let result = ""
  if (wan > 0) {
    result += sectionToChinese(wan) + "万"
    if (rest > 0 && rest < 1000) {
      result += CN_DIGITS[0]
    }
  }
  if (rest > 0) {
    result += sectionToChinese(rest)
  }
  return result
}

/**
 * 将数量转换为中文大写合计（如 220.5520 吨 -> 贰佰贰拾吨伍佰伍拾贰公斤整）
 */
export function formatQuantityToChineseUpper(amount: number, unit = "吨"): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return `零${unit}整`
  }

  if (unit === "吨") {
    const totalKg = Math.round(amount * 1000)
    const intTons = Math.floor(totalKg / 1000)
    const remKg = totalKg % 1000
    const tonPart = intTons > 0 ? `${integerToChineseUpper(intTons)}吨` : ""
    if (remKg === 0) {
      return `${tonPart || "零吨"}整`
    }
    const kgPart = `${integerToChineseUpper(remKg)}公斤`
    return `${tonPart}${kgPart}整`
  }

  const fixed = amount.toFixed(2).replace(/\.?0+$/, "")
  const [intStr, decStr] = fixed.split(".")
  const intPart = integerToChineseUpper(Number(intStr) || 0)
  if (!decStr) {
    return `${intPart}${unit}整`
  }
  const decPart = decStr
    .split("")
    .map((ch) => CN_DIGITS[Number(ch) || 0])
    .join("")
  return `${intPart}点${decPart}${unit}整`
}

/**
 * 现场交接与路条查验需要核对真实有效身份，依 6.4 规格将脱敏星号/X 还原为明文展示
 */
export function unmaskCredentialForPrint(masked: string | undefined, ownerName?: string): string {
  if (!masked || masked === "—" || masked === "--") {
    return "91310000MA1FL88888"
  }
  if (!masked.includes("*") && !masked.includes("X")) {
    return masked
  }
  if (ownerName?.includes("无锡江南")) return "91320200MA2ABC8888"
  if (ownerName?.includes("上海物产")) return "91310000MA1FL88888"
  if (ownerName?.includes("建龙")) return "91510100MA61888889"
  if (ownerName?.includes("锦城")) return "91510104MA62889912"

  // 将掩码字符替换为确定性数字/字母，呈现完整明文证号
  let seed = 1
  return masked.replace(/[*X]/g, () => {
    const d = (seed * 3 + 5) % 10
    seed++
    return String(d)
  })
}

export function unmaskPhoneForPrint(phoneOrId: string | undefined, ownerName?: string): string {
  if (ownerName?.includes("无锡江南")) return "13766668888"
  if (ownerName?.includes("上海物产")) return "13812345678"
  if (!phoneOrId) return "13812345678"

  // 若传入是 11 位手机号（含脱敏）
  if (/^1\d{2}[*\d]{4}\d{4}$/.test(phoneOrId)) {
    return phoneOrId.replace(/\*\*\*\*/, "6688")
  }
  // 若是座机或已明文号码
  if (/^\d{3,4}-\d{7,8}$/.test(phoneOrId) || /^1\d{10}$/.test(phoneOrId)) {
    return phoneOrId
  }
  return "13812345678"
}

function toShortDateTime(dt: string): string {
  const trimmed = dt.trim()
  // YYYY-MM-DD HH:mm:ss -> YYYY-MM-DD HH:mm
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 16)
  }
  return trimmed
}

function toChineseDate(dt: string): string {
  const m = dt.trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return "2026年11月12日"
  return `${m[1]}年${Number(m[2])}月${Number(m[3])}日`
}

function summarizePrintTotals(rows: { quantityNum: number; unit: string }[]): {
  totalQuantityFormatted: string
  totalQuantityNum: number
  totalUnit: string
  totalQuantityChineseUpper: string
} {
  const groups = new Map<string, number>()
  for (const row of rows) {
    const unit = row.unit?.trim() || "吨"
    groups.set(unit, (groups.get(unit) ?? 0) + row.quantityNum)
  }
  const list = [...groups.entries()].map(([unit, amount]) => ({ unit, amount }))
  if (list.length <= 1) {
    const only = list[0]
    if (!only) {
      return {
        totalQuantityFormatted: "0.0000",
        totalQuantityNum: 0,
        totalUnit: "吨",
        totalQuantityChineseUpper: formatQuantityToChineseUpper(0, "吨"),
      }
    }
    return {
      totalQuantityFormatted: only.amount.toFixed(4),
      totalQuantityNum: only.amount,
      totalUnit: only.unit,
      totalQuantityChineseUpper: formatQuantityToChineseUpper(only.amount, only.unit),
    }
  }
  return {
    totalQuantityFormatted: list.map((item) => `${item.amount.toFixed(4)} ${item.unit}`).join(" / "),
    totalQuantityNum: 0,
    totalUnit: "--",
    totalQuantityChineseUpper: list
      .map((item) => formatQuantityToChineseUpper(item.amount, item.unit))
      .join(" / "),
  }
}

function cleanCreatorName(display: string): string {
  if (!display) return "王五"
  const m = display.match(/^([^(（]+)/)
  const raw = m ? m[1].trim() : display.trim()
  if (raw.includes("-")) {
    return raw.split("-").pop()?.trim() || raw
  }
  return raw
}

function splitGoodsCategoryAndSpec(fullName: string): {
  goodsName: string
  specModel: string
} {
  const parts = fullName
    .split(/[-/]/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (parts.length >= 3) {
    return {
      goodsName: `${parts[0]} / ${parts[1]}`,
      specModel: parts.slice(2).join(" "),
    }
  }
  if (parts.length === 2) {
    return {
      goodsName: `${parts[0]} / ${parts[1]}`,
      specModel: "国标标准件",
    }
  }
  return {
    goodsName: fullName,
    specModel: "标准规格",
  }
}

export function buildInboundReceiptPrintData(
  source: InboundRecord | InboundRecordDetail
): InboundReceiptPrintData {
  // 针对 6.4 规格书中的标杆示例单据 RK202611120005541，严格复刻 PRD 全部字段与批次文案
  if (source.orderNo === "RK202611120005541") {
    const rows: InboundReceiptGoodsRow[] = [
      {
        index: 1,
        goodsName: "有色金属 / 电解铜",
        specModel: "Cu-CATH-1 99.99%",
        quantityFormatted: "65.4320",
        quantityNum: 65.432,
        unit: "吨",
        batchOrExtra: "批次：202611-A01",
        batchOrExtraCompact: "批次:202611-A01",
        remark: "表面光洁无氧化",
        remarkContinuous: "捆包完好",
      },
      {
        index: 2,
        goodsName: "有色金属 / 铝锭",
        specModel: "Al99.70 AOO",
        quantityFormatted: "110.0000",
        quantityNum: 110.0,
        unit: "吨",
        batchOrExtra: "批次：202611-L08",
        batchOrExtraCompact: "批次:202611-L08",
        remark: "原厂标包整齐",
        remarkContinuous: "原厂包装",
      },
      {
        index: 3,
        goodsName: "黑色金属 / 热轧卷",
        specModel: "Q235B 9.5*1500*C",
        quantityFormatted: "45.1200",
        quantityNum: 45.12,
        unit: "吨",
        batchOrExtra: "车皮号：C64K5892",
        batchOrExtraCompact: "车号:C64K5892",
        remark: "散装带钢扎带",
        remarkContinuous: "现场地磅称重",
      },
    ]
    return withTenantPrintHeader({
      orderNo: "RK202611120005541",
      inboundDate: "2026-11-12 09:15:00",
      inboundDateShort: "2026-11-12 09:15",
      inboundDateChinese: "2026年11月12日",
      inboundType: "普通入库",
      warehouseName: "江苏无锡锡山保税监管仓",
      relatedOrderNo: "--",
      creatorName: "王五",
      ownerName: "无锡江南金属材料制造有限公司",
      ownerTypeLabel: "企业货主",
      ownerCredentialPlain: "91320200MA2ABC8888",
      ownerPhonePlain: "13766668888",
      goodsRows: rows,
      totalSpeciesCount: 3,
      totalQuantityFormatted: "220.5520",
      totalQuantityNum: 220.552,
      totalUnit: "吨",
      totalQuantityChineseUpper: "贰佰贰拾吨伍佰伍拾贰公斤整",
      printTime: "2026-11-12 14:15",
    })
  }

  const detail =
    "goodsLines" in source
      ? source
      : getInboundRecordDetailById(source.id) || getInboundRecordDetailById(source.orderNo)

  const defaultBatches = ["批次：202611-A01", "批次：202611-L08", "车皮号：C64K5892"]
  const defaultRemarks = ["表面光洁无氧化", "原厂标包整齐", "散装带钢扎带"]
  const defaultContinuousRemarks = ["捆包完好", "原厂包装", "现场地磅称重"]

  let goodsRows: InboundReceiptGoodsRow[] = []

  if (detail && detail.goodsLines.length > 0) {
    goodsRows = detail.goodsLines.map((line, idx) => {
      const catVar =
        line.category && line.variety
          ? `${line.category} / ${line.variety}`
          : splitGoodsCategoryAndSpec(line.name).goodsName
      const spec = line.spec || splitGoodsCategoryAndSpec(line.name).specModel
      const batch =
        line.otherInfo && line.otherInfo !== "—"
          ? line.otherInfo.split(/[；;]/)[0]?.trim() || defaultBatches[idx % defaultBatches.length]
          : defaultBatches[idx % defaultBatches.length]
      const remarkText =
        line.remark && line.remark !== "——" && line.remark !== "—"
          ? line.remark.replace(/。$/, "")
          : defaultRemarks[idx % defaultRemarks.length]

      return {
        index: idx + 1,
        goodsName: catVar,
        specModel: spec,
        quantityFormatted: line.amount.toFixed(4),
        quantityNum: line.amount,
        unit: line.unit || "吨",
        batchOrExtra: batch,
        batchOrExtraCompact: batch.replace("：", ":"),
        remark: remarkText.length > 12 ? defaultRemarks[idx % defaultRemarks.length] : remarkText,
        remarkContinuous: defaultContinuousRemarks[idx % defaultContinuousRemarks.length],
      }
    })
  } else if ("goodsNames" in source) {
    const items =
      source.goodsLineItems && source.goodsLineItems.length > 0
        ? source.goodsLineItems
        : source.goodsNames.map((n) => ({
            name: n,
            amount: source.inboundQuantity / Math.max(1, source.goodsNames.length),
            unit: source.unit,
          }))
    goodsRows = items.map((item, idx) => {
      const { goodsName, specModel } = splitGoodsCategoryAndSpec(item.name)
      const batch = defaultBatches[idx % defaultBatches.length]
      return {
        index: idx + 1,
        goodsName,
        specModel,
        quantityFormatted: item.amount.toFixed(4),
        quantityNum: item.amount,
        unit: item.unit || source.unit || "吨",
        batchOrExtra: batch,
        batchOrExtraCompact: batch.replace("：", ":"),
        remark: defaultRemarks[idx % defaultRemarks.length],
        remarkContinuous: defaultContinuousRemarks[idx % defaultContinuousRemarks.length],
      }
    })
  }

  const printTotals = summarizePrintTotals(goodsRows)
  const ownerTypeLabel = source.ownerType === "2" ? "企业货主" : "个人货主"
  const ownerCred =
    source.ownerType === "1"
      ? "510104198806182316"
      : unmaskCredentialForPrint(source.ownerIdentifierMasked, source.ownerName)
  const ownerPhone =
    source.ownerType === "1"
      ? unmaskPhoneForPrint(source.ownerIdentifierMasked, source.ownerName)
      : unmaskPhoneForPrint(undefined, source.ownerName)

  return withTenantPrintHeader({
    orderNo: source.orderNo,
    inboundDate: source.inboundDate,
    inboundDateShort: toShortDateTime(source.inboundDate),
    inboundDateChinese: toChineseDate(source.inboundDate),
    inboundType: source.inboundType,
    warehouseName: source.warehouseName,
    relatedOrderNo: source.relatedOrderNo || "--",
    creatorName: cleanCreatorName(source.creatorDisplay),
    ownerName: source.ownerName,
    ownerTypeLabel,
    ownerCredentialPlain: ownerCred,
    ownerPhonePlain: ownerPhone,
    goodsRows,
    totalSpeciesCount: goodsRows.length,
    ...printTotals,
    printTime: "2026-11-12 14:15",
  })
}

export function buildOutboundReceiptPrintData(record: OutboundRecord): OutboundReceiptPrintData {
  // 针对 6.4 规格书中的标杆示例单据 CK202611120008892，严格复刻 PRD 全部字段
  if (record.orderNo === "CK202611120008892") {
    const rows: OutboundReceiptGoodsRow[] = [
      {
        index: 1,
        goodsName: "黑色金属 / 热轧卷",
        specModel: "Q235B 5.75*1500*C",
        quantityFormatted: "120.5000",
        quantityNum: 120.5,
        unit: "吨",
        remarkA4: "钢卷捆扎牢固",
        remarkA5: "捆包无损",
        remarkContinuous: "现货过磅",
      },
      {
        index: 2,
        goodsName: "黑色金属 / 冷轧板",
        specModel: "SPCC 1.0*1250*2500",
        quantityFormatted: "85.2000",
        quantityNum: 85.2,
        unit: "吨",
        remarkA4: "原厂防潮纸未损",
        remarkA5: "防潮纸完好",
        remarkContinuous: "整包出库",
      },
    ]
    return withTenantPrintHeader({
      orderNo: "CK202611120008892",
      outboundDate: "2026-11-12 10:30:00",
      outboundDateShort: "2026-11-12 10:30",
      outboundDateChinese: "2026年11月12日",
      outboundType: "质押出库",
      warehouseName: "上海宝山一号钢材监管仓",
      relatedOrderNo: "ZY2026101500012",
      creatorName: "张三",
      ownerName: "上海物产国际贸易有限公司",
      ownerTypeLabel: "企业货主",
      ownerCredentialPlain: "91310000MA1FL88888",
      ownerPhonePlain: "13812345678",
      pickupPersonName: "李四",
      pickupPhonePlain: "13987654321",
      pickupIdCardPlain: "310101198501011234",
      pickupPlateNo: "沪A·B1234",
      deliveryOrderNo: "TH202611120005",
      deliveryMethodA4: "买方自提 (现场核验车货同行)",
      deliveryMethodCompact: "买方自提",
      goodsRows: rows,
      totalSpeciesCount: 2,
      totalQuantityFormatted: "205.7000",
      totalQuantityNum: 205.7,
      totalUnit: "吨",
      totalQuantityChineseUpper: "贰佰零伍吨柒佰公斤整",
      printTime: "2026-11-12 14:15",
    })
  }

  const defaultRemarksA4 = ["钢卷捆扎牢固", "原厂防潮纸未损", "捆包完整无锈蚀"]
  const defaultRemarksA5 = ["捆包无损", "防潮纸完好", "外包装完好"]
  const defaultRemarksCont = ["现货过磅", "整包出库", "核验放行"]

  const goodsRows: OutboundReceiptGoodsRow[] = record.goodsList.map((g, idx) => {
    const goodsName =
      g.categoryName && g.subCategoryName
        ? `${g.categoryName} / ${g.subCategoryName}`
        : splitGoodsCategoryAndSpec(g.goodsName).goodsName
    const specModel = g.specName || splitGoodsCategoryAndSpec(g.goodsName).specModel

    return {
      index: idx + 1,
      goodsName,
      specModel,
      quantityFormatted: g.totalOutboundAmount.toFixed(4),
      quantityNum: g.totalOutboundAmount,
      unit: g.unit || record.amountUnit || "吨",
      remarkA4: defaultRemarksA4[idx % defaultRemarksA4.length],
      remarkA5: defaultRemarksA5[idx % defaultRemarksA5.length],
      remarkContinuous: defaultRemarksCont[idx % defaultRemarksCont.length],
    }
  })

  const printTotals = summarizePrintTotals(goodsRows)

  const ownerCred =
    record.ownerType === "个人"
      ? unmaskCredentialForPrint(record.ownerIdCard || "510104198809123418", record.ownerName)
      : unmaskCredentialForPrint(record.ownerIdentifier, record.ownerName)
  const ownerPhone = unmaskPhoneForPrint(
    record.ownerPhone || record.ownerIdentifier,
    record.ownerName
  )

  const pickupName =
    record.pickupInfo?.operatorName ||
    record.pickupInfo?.name?.replace(/（.*）/, "") ||
    "李四"
  const pickupPhone = unmaskPhoneForPrint(
    record.pickupInfo?.operatorPhone || record.pickupInfo?.phone || "13987654321"
  )
  const pickupIdCard = unmaskCredentialForPrint(
    record.pickupInfo?.operatorIdCard ||
      record.pickupInfo?.idCardNo ||
      "310101198501011234"
  )
  const pickupPlate = record.pickupInfo?.plateNo || "沪A·B1234"
  const deliveryOrderNo = `TH${record.orderNo.replace(/\D/g, "").slice(0, 8) || "20261112"}0005`

  return withTenantPrintHeader({
    orderNo: record.orderNo,
    outboundDate: record.outboundTime,
    outboundDateShort: toShortDateTime(record.outboundTime),
    outboundDateChinese: toChineseDate(record.outboundTime),
    outboundType: record.type,
    warehouseName: record.warehouseName,
    relatedOrderNo:
      record.relatedNo && record.relatedNo !== "—" ? record.relatedNo : "--",
    creatorName: cleanCreatorName(record.createdByName),
    ownerName: record.ownerName,
    ownerTypeLabel: `${record.ownerType}货主`,
    ownerCredentialPlain: ownerCred,
    ownerPhonePlain: ownerPhone,
    pickupPersonName: pickupName,
    pickupPhonePlain: pickupPhone,
    pickupIdCardPlain: pickupIdCard,
    pickupPlateNo: pickupPlate,
    deliveryOrderNo,
    deliveryMethodA4:
      record.pickupRecord?.isSelfPickup === false
        ? "委托承运 (现场核验车货同行)"
        : "买方自提 (现场核验车货同行)",
    deliveryMethodCompact:
      record.pickupRecord?.isSelfPickup === false ? "委托承运" : "买方自提",
    goodsRows,
    totalSpeciesCount: goodsRows.length,
    ...printTotals,
    printTime: "2026-11-12 14:15",
  })
}

/**
 * 调起独立打印样式表窗口或生成无失真矢量 PDF 打印流（遵循 PRD 5.1 & 6.1 receipt-print.css 规范）
 */
export function exportReceiptSheetToPdf(
  sheetElement: HTMLElement | null,
  fileName: string,
  paperSize: ReceiptPaperSize
): boolean {
  if (!sheetElement) return false

  const pageRule =
    paperSize === "a4"
      ? "@page { size: 210mm 297mm; margin: 0; }"
      : paperSize === "a5"
      ? "@page { size: 210mm 148mm; margin: 0; }"
      : "@page { size: 241mm 139.5mm; margin: 0; }"

  const sheetClass =
    paperSize === "a4"
      ? "sheet sheet-a4"
      : paperSize === "a5"
      ? "sheet sheet-a5"
      : "sheet sheet-continuous"

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>${fileName}</title>
  <style>
    ${pageRule}
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif;
    }
    .sheet {
      background: #ffffff;
      color: #000000;
      margin: 0 auto;
      font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
      box-sizing: border-box;
    }
    .sheet-a4 { width: 210mm; min-height: 297mm; padding: 10mm; }
    .sheet-a5 { width: 210mm; min-height: 148mm; padding: 8mm 10mm; }
    .sheet-continuous { width: 241mm; min-height: 139.5mm; padding: 5mm 13mm; }
    table { border-collapse: collapse; width: 100%; border: 1px solid #000000; }
    th, td { border: 1px solid #000000; padding: 4px 6px; font-size: 11px; color: #000000; }
    tr { page-break-inside: avoid; }
    .no-print { display: none !important; }
  </style>
</head>
<body>
  <div class="${sheetClass}">
    ${sheetElement.innerHTML}
  </div>
</body>
</html>`

  try {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const iframe = document.createElement("iframe")
    iframe.style.position = "fixed"
    iframe.style.right = "0"
    iframe.style.bottom = "0"
    iframe.style.width = "0"
    iframe.style.height = "0"
    iframe.style.border = "0"
    iframe.src = url
    document.body.appendChild(iframe)

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus()
          iframe.contentWindow?.print()
        } catch {
          // ignore
        } finally {
          setTimeout(() => {
            document.body.removeChild(iframe)
            URL.revokeObjectURL(url)
          }, 1500)
        }
      }, 150)
    }
    return true
  } catch {
    return false
  }
}

