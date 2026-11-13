import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  Filter,
  Lock,
  RotateCcw,
  Search,
  X,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  RecordCard,
  RecordCardMetricRow,
  type RecordCardAction,
} from "@/shared/components/RecordCard"
import {
  H5_FILTER_BAR,
  H5_FILTER_PILL_ROW,
  H5_LIST_SCROLL,
  H5_PAGE_BODY,
  H5_SCROLL_HOST,
  H5_SEARCH_INPUT,
} from "@/shared/h5-ui-theme"
import {
  RejectPoolH5ActionSheet,
  RejectPoolH5FilterSheet,
  type H5ActionKind,
} from "../components/RejectPoolH5ActionSheet"
import {
  DEFAULT_H5_FILTERS,
  H5_REJECT_POOL_STORAGE_KEY,
  OVERDUE_HOURS_THRESHOLD,
  TAB_META,
  formatYuan,
  h5RejectPoolDetailPath,
  isCircuitBroken,
  nextBatchNo,
  type RejectPoolH5Filters,
  type RejectPoolRecord,
  type RejectPoolTabKey,
} from "../domain/types"

/** 内联全状态 Mock 数据（覆盖 3 标签页、申请失败/受理失败、企业/个人、存货/仓单、超期 >72h、5次熔断） */
export const INITIAL_H5_REJECT_POOL_MOCK: RejectPoolRecord[] = [
  {
    id: "rp-20261110-0001",
    applyNo: "FIN-20261110-0001",
    batchNo: "FIN-20261110-0001-B02",
    tabKey: "CLUE_REJECTED",
    rejectNodeName: "需求线索驳回",
    businessStatus: "APPLY_FAILED",
    productName: "有色金属动态质押贷（电解铜专享）",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "上海晟源有色金属有限公司",
    applicantIdentifier: "91310115MA1K4R892X",
    businessLicenseNo: "91310115MA1K4R892X",
    businessLicenseFileName: "上海晟源有色金属_营业执照副本.pdf",
    agentName: "沈文涛",
    agentPhone: "138****4512",
    agentIdCard: "310115********3418",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-1",
        categoryName: "有色金属",
        varietyName: "电解铜",
        specModel: "沪产 1# 标准阴极铜 (Cu≥99.95%)",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · A区 A-01-03",
        pledgeQuantity: 68.5,
        unit: "吨",
        unitPriceYuan: 74200,
        assessedValueYuan: 5082700,
      },
    ],
    intendedAmountYuan: 3200000,
    intendedPeriods: 6,
    lastRejectReason:
      "上游冶炼厂采购发票与入库磅单重量存在 1.8 吨差异，且缺少最近一期增值税完税证明。",
    rejectCount: 2,
    stagnationHours: 96.4,
    appliedAt: "2026-11-08 14:22:10",
    rejectHandler: "张晓梅",
    rejectHandlerOrg: "森云融资运营中心",
    rejectedAt: "2026-11-09 10:15:00",
    historicalRejectedFunders: [],
    attachments: [
      {
        id: "att-101",
        category: "申请资料",
        fileName: "上海晟源_电解铜购销合同_202611.pdf",
        fileSize: "2.3 MB",
        uploadedBy: "沈文涛",
        uploadedAt: "2026-11-08 14:20:05",
        summary: "70 吨 1# 电解铜框架采购协议及首付款回单。",
      },
    ],
    batchHistory: [
      {
        batchNo: "FIN-20261110-0001-B02",
        nodeName: "需求线索驳回",
        actionResult: "申请失败（二次驳回入池）",
        operatorName: "张晓梅",
        operatorOrg: "森云融资运营中心",
        operatedAt: "2026-11-09 10:15:00",
        reasonOrNote: "采购发票与入库磅单重量差异 1.8 吨，退回补正。",
      },
      {
        batchNo: "FIN-20261110-0001-B01",
        nodeName: "需求线索驳回",
        actionResult: "申请失败（首次入池）",
        operatorName: "李雪",
        operatorOrg: "森云融资运营中心",
        operatedAt: "2026-11-08 17:40:12",
        reasonOrNote: "企业授权经办人委托书未加盖骑缝章。",
      },
    ],
  },
  {
    id: "rp-20261112-0002",
    applyNo: "FIN-20261112-0002",
    batchNo: "FIN-20261112-0002-B01",
    tabKey: "CLUE_REJECTED",
    rejectNodeName: "需求线索驳回",
    businessStatus: "APPLY_FAILED",
    productName: "数字仓单极速质押通（免现场尽调）",
    needDiligence: false,
    applicantType: "INDIVIDUAL",
    applicantName: "周建国",
    applicantIdentifier: "139****6682",
    applicantPhone: "139****6682",
    applicantIdCard: "320281********2219",
    collateralType: "WAREHOUSE_RECEIPT",
    warehouseReceiptCodes: ["CD2091023847561102336"],
    inventoryItems: [
      {
        id: "inv-2",
        categoryName: "有色金属",
        varietyName: "铝锭",
        specModel: "国标 A00 重熔用铝锭",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "二号库房 · B区 B-03-11",
        pledgeQuantity: 92.0,
        unit: "吨",
        unitPriceYuan: 20650,
        assessedValueYuan: 1899800,
      },
    ],
    intendedAmountYuan: 1200000,
    intendedPeriods: 3,
    lastRejectReason: "收款结算账户开户行支行名称不完整，请补充后按路由直派合作资方。",
    rejectCount: 1,
    stagnationHours: 18.5,
    appliedAt: "2026-11-12 09:30:18",
    rejectHandler: "陈丽华",
    rejectHandlerOrg: "森云融资运营中心",
    rejectedAt: "2026-11-12 16:05:33",
    historicalRejectedFunders: [],
    attachments: [],
    batchHistory: [
      {
        batchNo: "FIN-20261112-0002-B01",
        nodeName: "需求线索驳回",
        actionResult: "申请失败（首次入池）",
        operatorName: "陈丽华",
        operatorOrg: "森云融资运营中心",
        operatedAt: "2026-11-12 16:05:33",
        reasonOrNote: "收款账户支行信息缺失。",
      },
    ],
  },
  {
    id: "rp-20261105-0003",
    applyNo: "FIN-20261105-0003",
    batchNo: "FIN-20261105-0003-B05",
    tabKey: "CLUE_REJECTED",
    rejectNodeName: "需求线索驳回",
    businessStatus: "APPLY_FAILED",
    productName: "钢铁大宗供应链保理融",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "江苏弘毅钢铁贸易有限公司",
    applicantIdentifier: "91320506MA1P9X330D",
    businessLicenseNo: "91320506MA1P9X330D",
    businessLicenseFileName: "江苏弘毅钢铁_营业执照.pdf",
    agentName: "吴志远",
    agentPhone: "136****9087",
    agentIdCard: "320506********0912",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-3",
        categoryName: "黑色金属",
        varietyName: "热轧卷板",
        specModel: "Q235B 5.75*1500mm 沙钢",
        warehouseName: "西南大宗物流监管仓",
        zoneLocation: "大宗库房 · 一号分区 垛位-01",
        pledgeQuantity: 420.0,
        unit: "吨",
        unitPriceYuan: 3780,
        assessedValueYuan: 1587600,
      },
    ],
    intendedAmountYuan: 1100000,
    intendedPeriods: 6,
    lastRejectReason: "连续五轮提交的货权证明存在多头质押疑点，已触发风控熔断。",
    rejectCount: 5,
    stagnationHours: 168.0,
    appliedAt: "2026-11-01 11:10:00",
    rejectHandler: "高风控",
    rejectHandlerOrg: "森云首席风控办公室",
    rejectedAt: "2026-11-06 10:30:00",
    historicalRejectedFunders: ["浙商银行宁波分行"],
    attachments: [],
    batchHistory: [
      {
        batchNo: "FIN-20261105-0003-B05",
        nodeName: "需求线索驳回",
        actionResult: "申请失败（累计第 5 次入池触发熔断）",
        operatorName: "高风控",
        operatorOrg: "森云首席风控办公室",
        operatedAt: "2026-11-06 10:30:00",
        reasonOrNote: "存在多头质押风险告警，锁定线上重调度权限。",
      },
    ],
  },
  {
    id: "rp-20261109-0004",
    applyNo: "FIN-20261109-0004",
    batchNo: "FIN-20261109-0004-B02",
    tabKey: "DILIGENCE_FAILED",
    rejectNodeName: "尽调风控不通过",
    businessStatus: "ACCEPT_FAILED",
    productName: "橡胶化工现货监管贷",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "浙江远大橡胶制品有限公司",
    applicantIdentifier: "91330200MA287E451K",
    businessLicenseNo: "91330200MA287E451K",
    businessLicenseFileName: "浙江远大橡胶_营业执照正本.pdf",
    agentName: "方敏",
    agentPhone: "158****3301",
    agentIdCard: "330203********5524",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-4",
        categoryName: "能源化工",
        varietyName: "天然橡胶",
        specModel: "云南农垦全乳胶 SCRWF",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · C区 C-02-05",
        pledgeQuantity: 115.0,
        unit: "吨",
        unitPriceYuan: 15800,
        assessedValueYuan: 1817000,
      },
    ],
    intendedAmountYuan: 1250000,
    intendedPeriods: 6,
    lastRejectReason: "原尽调专员陈志强外勤排期冲突拒单退回（受理失败），建议改派新专员。",
    rejectCount: 2,
    stagnationHours: 84.2,
    appliedAt: "2026-11-07 15:40:20",
    rejectHandler: "陈志强",
    rejectHandlerOrg: "华东仓储监管尽调一组",
    rejectedAt: "2026-11-09 22:20:00",
    lastSurveyorId: "SUR-001",
    lastSurveyorName: "陈志强",
    historicalRejectedFunders: ["平安银行大宗商品金融事业部"],
    attachments: [],
    batchHistory: [
      {
        batchNo: "FIN-20261109-0004-B02",
        nodeName: "尽调风控不通过",
        actionResult: "受理失败（尽调专员拒单退回）",
        operatorName: "陈志强",
        operatorOrg: "华东仓储监管尽调一组",
        operatedAt: "2026-11-09 22:20:00",
        reasonOrNote: "排期已满退回改派其他尽调专员。",
      },
    ],
  },
  {
    id: "rp-20261111-0005",
    applyNo: "FIN-20261111-0005",
    batchNo: "FIN-20261111-0005-B03",
    tabKey: "DILIGENCE_FAILED",
    rejectNodeName: "尽调风控不通过",
    businessStatus: "APPLY_FAILED",
    productName: "粤港澳有色金属仓单质押贷",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "广东粤海铜业供应链有限公司",
    applicantIdentifier: "91440101MA59T8821N",
    businessLicenseNo: "91440101MA59T8821N",
    businessLicenseFileName: "广东粤海铜业_营业执照.pdf",
    agentName: "梁家辉",
    agentPhone: "135****7721",
    agentIdCard: "440106********1833",
    collateralType: "WAREHOUSE_RECEIPT",
    warehouseReceiptCodes: ["CD2092155678901234567"],
    inventoryItems: [
      {
        id: "inv-5",
        categoryName: "有色金属",
        varietyName: "电解铜",
        specModel: "标准阴极铜 贵溪牌",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · A区 A-02-01",
        pledgeQuantity: 105.0,
        unit: "吨",
        unitPriceYuan: 74500,
        assessedValueYuan: 7822500,
      },
    ],
    intendedAmountYuan: 5200000,
    intendedPeriods: 12,
    lastRejectReason: "智风控涉诉扫描命中历史买卖纠纷记录，若补足保证金可申请特批直分资方。",
    rejectCount: 3,
    stagnationHours: 36.8,
    appliedAt: "2026-11-09 10:12:45",
    rejectHandler: "赵明远",
    rejectHandlerOrg: "华南产业风控尽调组",
    rejectedAt: "2026-11-11 21:45:12",
    lastSurveyorId: "SUR-002",
    lastSurveyorName: "赵明远",
    historicalRejectedFunders: ["浦发银行供应链金融部"],
    attachments: [],
    batchHistory: [
      {
        batchNo: "FIN-20261111-0005-B03",
        nodeName: "尽调风控不通过",
        actionResult: "申请失败（尽调驳回）",
        operatorName: "赵明远",
        operatorOrg: "华南产业风控尽调组",
        operatedAt: "2026-11-11 21:45:12",
        reasonOrNote: "智风控命中涉诉异常。",
      },
    ],
  },
  {
    id: "rp-20261108-0007",
    applyNo: "FIN-20261108-0007",
    batchNo: "FIN-20261108-0007-B02",
    tabKey: "CREDIT_FAILED",
    rejectNodeName: "授信资方拒绝",
    businessStatus: "APPLY_FAILED",
    productName: "数字仓单银企直连授信产品",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "宁波港通金属材料有限公司",
    applicantIdentifier: "91330206MA29K5527P",
    businessLicenseNo: "91330206MA29K5527P",
    businessLicenseFileName: "宁波港通金属_营业执照.pdf",
    agentName: "胡海波",
    agentPhone: "137****6190",
    agentIdCard: "330206********7714",
    collateralType: "WAREHOUSE_RECEIPT",
    warehouseReceiptCodes: ["CD2088001122334455667"],
    inventoryItems: [
      {
        id: "inv-7",
        categoryName: "有色金属",
        varietyName: "铝锭",
        specModel: "A00 重熔用铝锭",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "二号库房 · B区 B-04-06",
        pledgeQuantity: 280.0,
        unit: "吨",
        unitPriceYuan: 20500,
        assessedValueYuan: 5740000,
      },
    ],
    intendedAmountYuan: 4000000,
    intendedPeriods: 6,
    approvedCreditAmountYuan: 3500000,
    approvedCreditPeriods: 6,
    lastRejectReason: "浦发银行本月有色授信额度已满拒绝放款，原尽调结论继续有效，建议改派其他资方。",
    rejectCount: 2,
    stagnationHours: 110.6,
    appliedAt: "2026-11-06 13:18:00",
    rejectHandler: "王授信",
    rejectHandlerOrg: "浦发银行供应链金融部",
    rejectedAt: "2026-11-08 19:45:00",
    historicalRejectedFunders: ["浦发银行供应链金融部", "浙商银行宁波分行"],
    attachments: [],
    batchHistory: [
      {
        batchNo: "FIN-20261108-0007-B02",
        nodeName: "授信资方拒绝",
        actionResult: "申请失败（浦发银行拒批）",
        operatorName: "王授信",
        operatorOrg: "浦发银行供应链金融部",
        operatedAt: "2026-11-08 19:45:00",
        reasonOrNote: "当月额度受限拒批。",
        isConfidentialFunderRemark: true,
      },
    ],
  },
  {
    id: "rp-20261102-0009",
    applyNo: "FIN-20261102-0009",
    batchNo: "FIN-20261102-0009-B05",
    tabKey: "CREDIT_FAILED",
    rejectNodeName: "授信资方拒绝",
    businessStatus: "APPLY_FAILED",
    productName: "天然橡胶仓单质押授信",
    needDiligence: true,
    applicantType: "ENTERPRISE",
    applicantName: "山东齐鲁化工物流有限公司",
    applicantIdentifier: "91370200MA3N5R6T8W",
    businessLicenseNo: "91370200MA3N5R6T8W",
    businessLicenseFileName: "齐鲁化工物流_营业执照.pdf",
    agentName: "赵刚",
    agentPhone: "159****4432",
    agentIdCard: "370202********2901",
    collateralType: "WAREHOUSE_RECEIPT",
    warehouseReceiptCodes: ["CD2093344556677889900"],
    inventoryItems: [
      {
        id: "inv-9",
        categoryName: "能源化工",
        varietyName: "天然橡胶",
        specModel: "泰国 3# 烟片胶 RSS3",
        warehouseName: "西南大宗物流监管仓",
        zoneLocation: "大宗库房 · 三号分区 垛位-03",
        pledgeQuantity: 150.0,
        unit: "吨",
        unitPriceYuan: 16400,
        assessedValueYuan: 2460000,
      },
    ],
    intendedAmountYuan: 1700000,
    intendedPeriods: 6,
    lastRejectReason: "5 家合作资方均因基差波动风险拒批，累计满 5 次已触发熔断锁定。",
    rejectCount: 5,
    stagnationHours: 216.0,
    appliedAt: "2026-10-28 16:00:00",
    rejectHandler: "李审",
    rejectHandlerOrg: "苏州银行贸易融资中心",
    rejectedAt: "2026-11-04 10:00:00",
    historicalRejectedFunders: [
      "浦发银行供应链金融部",
      "浙商银行宁波分行",
      "网商银行产业金融部",
      "平安银行大宗商品金融事业部",
      "苏州银行贸易融资中心",
    ],
    attachments: [],
    batchHistory: [
      {
        batchNo: "FIN-20261102-0009-B05",
        nodeName: "授信资方拒绝",
        actionResult: "申请失败（第 5 次被拒触发熔断）",
        operatorName: "李审",
        operatorOrg: "苏州银行贸易融资中心",
        operatedAt: "2026-11-04 10:00:00",
        reasonOrNote: "流动折价过高拒批。",
        isConfidentialFunderRemark: true,
      },
    ],
  },
]

export function loadH5RejectPoolRecords(): RejectPoolRecord[] {
  try {
    const raw = localStorage.getItem(H5_REJECT_POOL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.error(e)
  }
  return INITIAL_H5_REJECT_POOL_MOCK
}

export function saveH5RejectPoolRecords(records: RejectPoolRecord[]) {
  try {
    localStorage.setItem(H5_REJECT_POOL_STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    console.error(e)
  }
}

const DILIGENCE_OPTIONS: DropdownOption[] = [
  { label: "需要尽调", value: "ALL" },
  { label: "是（需尽调）", value: "YES" },
  { label: "否（免尽调）", value: "NO" },
]

const STAGNATION_OPTIONS: DropdownOption[] = [
  { label: "停滞状态", value: "ALL" },
  { label: "超期大于 72h", value: "OVERDUE" },
  { label: "72h 内正常", value: "NORMAL" },
]

export function RejectPoolListPage() {
  const [records, setRecords] = useState<RejectPoolRecord[]>(loadH5RejectPoolRecords)
  const [activeTab, setActiveTab] = useState<"ALL" | RejectPoolTabKey>("ALL")
  const [filters, setFilters] = useState<RejectPoolH5Filters>(DEFAULT_H5_FILTERS)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [actionOpen, setActionOpen] = useState(false)
  const [actionKind, setActionKind] = useState<H5ActionKind | null>(null)
  const [actionTarget, setActionTarget] = useState<RejectPoolRecord | null>(null)

  useEffect(() => {
    saveH5RejectPoolRecords(records)
  }, [records])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const tabCounts = useMemo(() => {
    const counts: Record<"ALL" | RejectPoolTabKey, { total: number; overdue: number }> = {
      ALL: { total: 0, overdue: 0 },
      CLUE_REJECTED: { total: 0, overdue: 0 },
      DILIGENCE_FAILED: { total: 0, overdue: 0 },
      CREDIT_FAILED: { total: 0, overdue: 0 },
    }
    for (const r of records) {
      counts.ALL.total += 1
      counts[r.tabKey].total += 1
      if (r.stagnationHours > OVERDUE_HOURS_THRESHOLD) {
        counts.ALL.overdue += 1
        counts[r.tabKey].overdue += 1
      }
    }
    return counts
  }, [records])

  const filtered = useMemo(() => {
    return records
      .filter((item) => activeTab === "ALL" || item.tabKey === activeTab)
      .filter((item) => {
        if (filters.keyword.trim()) {
          const kw = filters.keyword.trim().toLowerCase()
          const hit =
            item.applyNo.toLowerCase().includes(kw) ||
            item.applicantName.toLowerCase().includes(kw) ||
            item.productName.toLowerCase().includes(kw)
          if (!hit) return false
        }
        if (filters.needDiligence !== "ALL") {
          const want = filters.needDiligence === "YES"
          if (item.needDiligence !== want) return false
        }
        if (filters.stagnationState === "OVERDUE") {
          if (item.stagnationHours <= OVERDUE_HOURS_THRESHOLD) return false
        } else if (filters.stagnationState === "NORMAL") {
          if (item.stagnationHours > OVERDUE_HOURS_THRESHOLD) return false
        }
        if (filters.businessStatus !== "ALL") {
          if (item.businessStatus !== filters.businessStatus) return false
        }
        if (filters.rejectedStart && item.rejectedAt.slice(0, 10) < filters.rejectedStart) {
          return false
        }
        if (filters.rejectedEnd && item.rejectedAt.slice(0, 10) > filters.rejectedEnd) {
          return false
        }
        return true
      })
      .sort((a, b) => b.stagnationHours - a.stagnationHours)
  }, [records, activeTab, filters])

  const openSheet = (item: RejectPoolRecord, kind: H5ActionKind) => {
    if (kind !== "unlock" && isCircuitBroken(item)) {
      showToast("已触发风控熔断，需线下特批解除")
      return
    }
    setActionTarget(item)
    setActionKind(kind)
    setActionOpen(true)
  }

  const handleActionDone = ({
    kind,
    record,
    assigneeName,
    ticketNo,
  }: {
    kind: H5ActionKind
    record: RejectPoolRecord
    assigneeName?: string
    ticketNo?: string
  }) => {
    if (kind === "unlock") {
      setRecords((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, demoUnlocked: true } : item,
        ),
      )
      showToast(`特批工单 ${ticketNo} 已解锁，可继续重调度`)
      return
    }

    setRecords((prev) => prev.filter((item) => item.id !== record.id))
    const nextBatch = nextBatchNo(record.batchNo)
    if (kind === "revive") {
      showToast(`${record.applyNo} 已救活并恢复待受理`)
    } else if (kind === "routeAssign") {
      showToast(`已按路由指派给 ${assigneeName}`)
    } else if (kind === "reinitDiligence") {
      showToast(`已生成新尽调批次 ${nextBatch}`)
    } else if (kind === "skipDiligence") {
      showToast(`特批免尽调已直推 ${assigneeName}`)
    } else if (kind === "reassignFunder") {
      showToast(`已生成新授信批次 ${nextBatch} 推至 ${assigneeName}`)
    }
  }

  const buildCardActions = (item: RejectPoolRecord): RecordCardAction[] => {
    const locked = isCircuitBroken(item)
    const detailAction: RecordCardAction = {
      key: "detail",
      label: "查看详情",
      to: h5RejectPoolDetailPath(item.id),
    }

    if (locked) {
      return [
        {
          key: "unlock",
          label: "特批解封",
          onClick: () => openSheet(item, "unlock"),
        },
        detailAction,
      ]
    }

    if (item.tabKey === "CLUE_REJECTED") {
      return [
        {
          key: "revive",
          label: "重新救活",
          onClick: () => openSheet(item, "revive"),
        },
        {
          key: "route",
          label: "按路由指派",
          onClick: () => openSheet(item, "routeAssign"),
        },
        detailAction,
      ]
    }

    if (item.tabKey === "DILIGENCE_FAILED") {
      return [
        {
          key: "reinit",
          label: "重新尽调",
          onClick: () => openSheet(item, "reinitDiligence"),
        },
        {
          key: "skip",
          label: "直分资方",
          onClick: () => openSheet(item, "skipDiligence"),
        },
        detailAction,
      ]
    }

    // 授信失败遵循 R02 仅开放重新分配资方 + 查看详情
    return [
      {
        key: "reassign",
        label: "分配资方",
        onClick: () => openSheet(item, "reassignFunder"),
      },
      detailAction,
    ]
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["reject-pool-h5-list-page"]}>
        <NavBar
          title="被拒退回记录池"
          backTo="/m/workspace"
          right={
            <button
              type="button"
              onClick={() => {
                setRecords(INITIAL_H5_REJECT_POOL_MOCK)
                showToast("已恢复 7 条全状态演示数据")
              }}
              className="text-[12px] font-medium text-blue-600"
            >
              重置数据
            </button>
          }
        />
      </PrototypeAnnotationTarget>

      <div className={H5_PAGE_BODY}>
        {/* 4 大异常分类标签页（对齐现网：全部 / 线索被拒 / 尽调失败 / 授信失败） */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-h5-tabs"]}>
          <div className="grid shrink-0 grid-cols-4 border-b border-gray-200/80 bg-white">
            {(["ALL", "CLUE_REJECTED", "DILIGENCE_FAILED", "CREDIT_FAILED"] as const).map(
              (key) => {
                const active = activeTab === key
                const stat = tabCounts[key]
                const label = key === "ALL" ? "全部" : TAB_META[key].label
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`relative flex flex-col items-center py-2.5 text-xs transition-colors ${
                      active
                        ? "font-bold text-blue-600"
                        : "font-medium text-gray-500"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span>{label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                          active
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {stat.total}
                      </span>
                    </span>
                    {stat.overdue > 0 && (
                      <span className="mt-0.5 text-[10px] text-rose-500">
                        超期 {stat.overdue}
                      </span>
                    )}
                    {active && (
                      <span className="absolute bottom-0 h-0.5 w-10 rounded-full bg-blue-600" />
                    )}
                  </button>
                )
              },
            )}
          </div>
        </PrototypeAnnotationTarget>

        {/* 搜索 + 筛选胶囊行 */}
        <PrototypeAnnotationTarget annotationIds={["reject-pool-h5-filter"]}>
          <div className={H5_FILTER_BAR}>
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-gray-400" />
                <input
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, keyword: e.target.value }))
                  }
                  placeholder="搜索申请单号、申请人或产品名称"
                  className={`${H5_SEARCH_INPUT} pl-8`}
                />
                {filters.keyword && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, keyword: "" }))
                    }
                    className="absolute right-2.5 top-2.5 text-gray-400"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className="flex h-8 shrink-0 items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-2.5 text-xs font-medium text-gray-700"
              >
                <Filter className="size-3.5" />
                筛选
              </button>
            </div>

            <div className={H5_FILTER_PILL_ROW}>
              <DropdownFilterPill
                label="需要尽调"
                value={filters.needDiligence}
                options={DILIGENCE_OPTIONS}
                compactRow
                onChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    needDiligence: val as RejectPoolH5Filters["needDiligence"],
                  }))
                }
              />
              <DropdownFilterPill
                label="停滞状态"
                value={filters.stagnationState}
                options={STAGNATION_OPTIONS}
                compactRow
                onChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    stagnationState:
                      val as RejectPoolH5Filters["stagnationState"],
                  }))
                }
              />
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {/* 卡片滚动列表 */}
        <PrototypeAnnotationTarget
          annotationIds={["reject-pool-h5-cards"]}
          className={H5_SCROLL_HOST}
        >
          <div className={`${H5_LIST_SCROLL} pb-8`}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                  <Search className="size-7" />
                </div>
                <p className="text-xs font-medium text-[#232D39]/60">
                  「{activeTab === "ALL" ? "全部" : TAB_META[activeTab].label}」暂无匹配记录
                </p>
                <button
                  type="button"
                  onClick={() => setFilters(DEFAULT_H5_FILTERS)}
                  className="mt-3 inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-xs"
                >
                  <RotateCcw className="size-3" />
                  重置筛选条件
                </button>
              </div>
            ) : (
              filtered.map((item) => {
                const overdue = item.stagnationHours > OVERDUE_HOURS_THRESHOLD
                const locked = isCircuitBroken(item)
                return (
                  <RecordCard
                    key={item.id}
                    orderNo={item.applyNo}
                    detailTo={h5RejectPoolDetailPath(item.id)}
                    typeLabel={item.rejectNodeName}
                    statusLabel={
                      item.businessStatus === "ACCEPT_FAILED"
                        ? "受理失败"
                        : "申请失败"
                    }
                    statusTone={
                      item.businessStatus === "ACCEPT_FAILED" ? "amber" : "rose"
                    }
                    ownerName={item.applicantName}
                    ownerIdentifier={item.applicantIdentifier}
                    person={item.rejectHandler}
                    personLabel="退回人"
                    personOrg={item.rejectHandlerOrg}
                    time={item.rejectedAt}
                    timeLabel="退回时间"
                    alert={
                      locked ? (
                        <span
                          className="inline-flex items-center gap-0.5 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700"
                          title="已触发 5 次熔断保护"
                        >
                          <Lock className="size-3" />
                          已熔断
                        </span>
                      ) : overdue ? (
                        <span
                          className="inline-flex items-center gap-0.5 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600"
                          title="停滞超 72 小时"
                        >
                          <AlertCircle className="size-3" />
                          超期 {item.stagnationHours.toFixed(0)}h
                        </span>
                      ) : null
                    }
                    metrics={
                      <>
                        <RecordCardMetricRow
                          label="融资产品"
                          value={item.productName}
                        />
                        <RecordCardMetricRow
                          label="意向额度"
                          value={`${formatYuan(item.intendedAmountYuan)} 元 / ${item.intendedPeriods} 期`}
                        />
                        <RecordCardMetricRow
                          label="需要尽调"
                          value={item.needDiligence ? "是（走尽调流程）" : "否（直推资方）"}
                        />
                        <RecordCardMetricRow
                          label="担保标的"
                          value={
                            item.collateralType === "WAREHOUSE_RECEIPT" &&
                            item.warehouseReceiptCodes?.length ? (
                              <Link
                                to={`/m/workspace/warehouse-receipts/${encodeURIComponent(item.warehouseReceiptCodes[0])}`}
                                className="font-medium text-blue-600 underline"
                              >
                                仓单 {item.warehouseReceiptCodes[0]}
                              </Link>
                            ) : (
                              `现货 · ${item.inventoryItems[0]?.varietyName ?? "质押存货"}`
                            )
                          }
                        />
                        <RecordCardMetricRow
                          label="被拒/停滞"
                          value={
                            <span className={overdue ? "font-semibold text-rose-600" : ""}>
                              累计 {item.rejectCount} 次 · 停滞{" "}
                              {item.stagnationHours.toFixed(1)}h
                            </span>
                          }
                        />
                        <div className="mt-1 rounded-lg border border-rose-100 bg-rose-50/70 px-2.5 py-1.5 text-[11px] leading-relaxed text-rose-800">
                          <span className="font-semibold">被拒原因：</span>
                          {item.lastRejectReason}
                        </div>
                      </>
                    }
                    actions={buildCardActions(item)}
                  />
                )
              })
            )}
          </div>
        </PrototypeAnnotationTarget>
      </div>

      {toast && (
        <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}

      <RejectPoolH5FilterSheet
        open={filterDrawerOpen}
        value={filters}
        onClose={() => setFilterDrawerOpen(false)}
        onReset={() => setFilters(DEFAULT_H5_FILTERS)}
        onConfirm={(next) => setFilters(next)}
      />

      <RejectPoolH5ActionSheet
        open={actionOpen}
        kind={actionKind}
        record={actionTarget}
        onClose={() => setActionOpen(false)}
        onDone={handleActionDone}
      />
    </MobileShell>
  )
}

