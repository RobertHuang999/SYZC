import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DownloadIcon, HistoryIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { ExportRecordsDialog } from "@/features/inventory-management/components/ExportRecordsDialog"
import type { ExportRecordItem } from "@/features/inventory-management/domain/types"
import { nowExportStamp } from "@/features/shared/document-export-records"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { SegmentedTabs } from "@/shared/components/SegmentedTabs"
import { ONLINE_PLEDGE_PAGE_USER_DESC } from "@prototype/shared/online-pledge/online-pledge-ui-labels"
import { onlinePledgeListAnnotations } from "../annotations/online-pledge-list.annotations"
import { OnlinePledgeFiltersPanel } from "../components/OnlinePledgeFiltersPanel"
import {
  OnlinePledgeTable,
  type OnlinePledgeRowActionKind,
} from "../components/OnlinePledgeTable"
import { onlinePledgeDocuments } from "../documents/online-pledge-documents"
import {
  DEFAULT_ONLINE_PLEDGE_FILTERS,
  FINANCING_STATUS_META,
  ONLINE_PLEDGE_STORAGE_KEY,
  onlinePledgeActionPath,
  onlinePledgeDetailPath,
  type FinancingStatus,
  type OnlinePledgeFilters,
  type OnlinePledgeRecord,
} from "../domain/types"

/**
 * 全状态内联 Mock 数据（覆盖 4 种主状态 + 处理中子阶段 + 企业/个人 + 现货存货/数字仓单 + 本地回退件）
 */
export const INITIAL_ONLINE_PLEDGE_MOCK: OnlinePledgeRecord[] = [
  {
    id: "op-20261112-0001",
    applyNo: "PLEDGE-20261112-0001",
    productName: "有色金属动态质押贷（电解铜专享）",
    needDiligence: true,
    funderName: "浦发银行上海自贸试验区分行",
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
        id: "inv-op-101",
        categoryName: "有色金属",
        varietyName: "电解铜",
        specModel: "沪产 1# 标准阴极铜 (Cu≥99.95%)",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · A区 A-01-03",
        pledgeQuantity: 72.0,
        unit: "吨",
        unitPriceYuan: 74500,
        assessedValueYuan: 5364000,
        availability: "AVAILABLE",
      },
      {
        id: "inv-op-102",
        categoryName: "有色金属",
        varietyName: "电解铜",
        specModel: "贵冶 A 级阴极铜 (Cu≥99.97%)",
        warehouseName: "华东仓储运营中心",
        zoneLocation: "一号库房 · A区 A-02-01",
        pledgeQuantity: 15.0,
        unit: "吨",
        unitPriceYuan: 74800,
        assessedValueYuan: 1122000,
        availability: "OCCUPIED",
      },
    ],
    receiptItems: [],
    assessedValueYuan: 5364000,
    intendedAmountYuan: 3600000,
    intendedPeriods: 6,
    creditAmountYuan: 3500000,
    creditPeriods: 6,
    financingStatus: "CREDIT_SUCCESS",
    appliedAt: "2026-11-12 09:30:15",
    handlerName: "张晓梅 (SY-1024)",
    handledAt: "2026-11-12 15:40:00",
    version: 1,
    attachments: [
      {
        id: "att-op-1",
        category: "申请资料",
        fileName: "上海晟源_授信批复通知书.pdf",
        fileSize: "1.42 MB",
        uploadedAt: "2026-11-12 15:38:20",
      },
      {
        id: "att-op-2",
        category: "尽调报告",
        fileName: "华东仓储_电解铜现场尽调报告.pdf",
        fileSize: "3.18 MB",
        uploadedAt: "2026-11-12 11:20:05",
      },
    ],
    timeline: [
      {
        id: "tl-op-1",
        time: "2026-11-12 15:40:00",
        action: "授信核准流入",
        operator: "张晓梅 (SY-1024)",
        operatorOrg: "浦发银行授信审批部",
        result: "申请成功",
        remark: "核定最高授信额度 350.00 万元，最长期限 6 期，待经办人发起抵质押信息确认。",
      },
    ],
  },
  {
    id: "op-20261111-0002",
    applyNo: "PLEDGE-20261111-0002",
    productName: "标准仓单极速质押贷",
    needDiligence: false,
    funderName: "招商银行杭州分行",
    applicantType: "INDIVIDUAL",
    applicantName: "陈志强",
    applicantIdentifier: "139****6821",
    applicantPhone: "139****6821",
    applicantIdCard: "330106********4519",
    collateralType: "WAREHOUSE_RECEIPT",
    inventoryItems: [],
    receiptItems: [
      {
        id: "wr-op-201",
        receiptNo: "WR202611050018",
        goodsSummary: "铝锭 AL99.70（重熔用铝锭）",
        warehouseName: "宁波北仑大宗交割库",
        quantityText: "110.00 吨",
        assessedValueYuan: 2266000,
        availability: "AVAILABLE",
      },
    ],
    assessedValueYuan: 2266000,
    intendedAmountYuan: 1500000,
    intendedPeriods: 3,
    creditAmountYuan: 1450000,
    creditPeriods: 3,
    financingStatus: "CREDIT_SUCCESS",
    appliedAt: "2026-11-11 10:12:40",
    handlerName: "李明远 (SY-1088)",
    handledAt: "2026-11-12 10:05:30",
    version: 3,
    lastRollbackReason:
      "原提交仓单质押率测算超出资方 65% 阈值，经与客户沟通后审核拒绝并在本地回退，请调整申请额度或补充仓单后重新发起。",
    attachments: [
      {
        id: "att-op-201",
        category: "申请资料",
        fileName: "陈志强_仓单质押授信确认函.pdf",
        fileSize: "890 KB",
        uploadedAt: "2026-11-11 10:12:40",
      },
    ],
    timeline: [
      {
        id: "tl-op-202",
        time: "2026-11-12 10:05:30",
        action: "审核拒绝 · 本地回退",
        operator: "李明远 (SY-1088)",
        operatorOrg: "森云风控合规部",
        result: "回退至申请成功",
        remark:
          "原提交仓单质押率测算超出资方 65% 阈值，已本地回退至「申请成功」并释放仓单临时锁定（暂不流入被拒退回池）。",
      },
      {
        id: "tl-op-201",
        time: "2026-11-11 16:20:10",
        action: "发起抵质押信息确认",
        operator: "陈志强（个人货主）",
        operatorOrg: "移动端 H5 发起",
        result: "进入处理中",
        remark: "关联仓单 WR202611050018 发起质押确认。",
      },
    ],
  },
  {
    id: "op-20261110-0003",
    applyNo: "PLEDGE-20261110-0003",
    productName: "黑色金属供应链现货监管贷",
    needDiligence: true,
    funderName: "兴业银行苏州分行",
    applicantType: "ENTERPRISE",
    applicantName: "江苏华冶钢铁供应链有限公司",
    applicantIdentifier: "91320500MA1X9B210K",
    businessLicenseNo: "91320500MA1X9B210K",
    businessLicenseFileName: "江苏华冶钢铁_营业执照.pdf",
    agentName: "周建国",
    agentPhone: "137****2290",
    agentIdCard: "320502********1931",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-op-301",
        categoryName: "黑色金属",
        varietyName: "热轧卷板",
        specModel: "Q235B 4.75*1500*C 沙钢",
        warehouseName: "苏州工业园钢材监管库",
        zoneLocation: "二号露天货场 · B-03 垛位",
        pledgeQuantity: 850.0,
        unit: "吨",
        unitPriceYuan: 3680,
        assessedValueYuan: 3128000,
        availability: "LOCKED",
      },
    ],
    receiptItems: [],
    assessedValueYuan: 3128000,
    intendedAmountYuan: 2100000,
    intendedPeriods: 6,
    creditAmountYuan: 2000000,
    creditPeriods: 6,
    financingStatus: "IN_PROCESSING",
    processingStage: "INFO_REVIEW",
    appliedAt: "2026-11-10 14:18:05",
    handlerName: "周建国 (客户经办)",
    handledAt: "2026-11-12 17:12:44",
    version: 2,
    attachments: [
      {
        id: "att-op-301",
        category: "申请资料",
        fileName: "江苏华冶_抵质押物权确认单.pdf",
        fileSize: "1.15 MB",
        uploadedAt: "2026-11-12 17:12:44",
      },
      {
        id: "att-op-302",
        category: "尽调报告",
        fileName: "苏州钢材监管库_现场盘库尽调报告.pdf",
        fileSize: "4.06 MB",
        uploadedAt: "2026-11-10 18:00:00",
      },
    ],
    timeline: [
      {
        id: "tl-op-301",
        time: "2026-11-12 17:12:44",
        action: "发起抵质押信息确认",
        operator: "周建国 (客户经办)",
        operatorOrg: "江苏华冶钢铁供应链有限公司",
        result: "处理中（信息确认审核中）",
        remark: "锁定热轧卷板 850 吨（评估货值 312.80 万元），生成风控审核任务。",
      },
    ],
  },
  {
    id: "op-20261109-0004",
    applyNo: "PLEDGE-20261109-0004",
    productName: "大宗橡胶仓单监管融资",
    needDiligence: true,
    funderName: "中信银行宁波分行",
    applicantType: "ENTERPRISE",
    applicantName: "宁波海通橡胶贸易有限公司",
    applicantIdentifier: "91330200MA2H5C119P",
    businessLicenseNo: "91330200MA2H5C119P",
    businessLicenseFileName: "宁波海通橡胶_营业执照.pdf",
    agentName: "吴敏敏",
    agentPhone: "158****7741",
    agentIdCard: "330203********2284",
    collateralType: "WAREHOUSE_RECEIPT",
    inventoryItems: [],
    receiptItems: [
      {
        id: "wr-op-401",
        receiptNo: "WR202611020009",
        goodsSummary: "天然橡胶 SCR WF（全乳胶）",
        warehouseName: "青岛前湾保税监管库",
        quantityText: "260.00 吨",
        assessedValueYuan: 4160000,
        availability: "LOCKED",
      },
    ],
    assessedValueYuan: 4160000,
    intendedAmountYuan: 2800000,
    intendedPeriods: 9,
    creditAmountYuan: 2700000,
    creditPeriods: 9,
    pledgeOrderNo: "PO-20261111-0089",
    evidenceHash:
      "8f4e2a9c1b7d604e3a5f8c9d2e1b4a7c6d5e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    financingStatus: "IN_PROCESSING",
    processingStage: "ORDER_GENERATED",
    appliedAt: "2026-11-09 11:05:22",
    handlerName: "赵雅琪 (SY-1019)",
    handledAt: "2026-11-11 16:45:12",
    version: 3,
    attachments: [
      {
        id: "att-op-401",
        category: "电子质押协议",
        fileName: "三方动产质押监管协议_PO202611110089.pdf",
        fileSize: "2.34 MB",
        uploadedAt: "2026-11-11 16:45:12",
      },
      {
        id: "att-op-402",
        category: "尽调报告",
        fileName: "青岛保税库_天然橡胶尽调核验书.pdf",
        fileSize: "2.89 MB",
        uploadedAt: "2026-11-09 15:20:00",
      },
    ],
    timeline: [
      {
        id: "tl-op-402",
        time: "2026-11-11 16:45:12",
        action: "流程审核通过 · 订单生成",
        operator: "赵雅琪 (SY-1019)",
        operatorOrg: "森云风控合规部",
        result: "订单已生成（不可撤销）",
        remark:
          "电子签章及区块链存证已固化，生成正式抵质押订单 PO-20261111-0089，等待录入放款结果。",
      },
      {
        id: "tl-op-401",
        time: "2026-11-10 09:15:30",
        action: "发起抵质押信息确认",
        operator: "吴敏敏 (客户经办)",
        operatorOrg: "宁波海通橡胶贸易有限公司",
        result: "进入处理中",
        remark: "关联仓单 WR202611020009 发起质押确认。",
      },
    ],
  },
  {
    id: "op-20261106-0005",
    applyNo: "PLEDGE-20261106-0005",
    productName: "有色金属动态质押贷（锌锭专享）",
    needDiligence: true,
    funderName: "交通银行无锡分行",
    applicantType: "ENTERPRISE",
    applicantName: "无锡恒泰金属材料有限公司",
    applicantIdentifier: "91320200MA1N8K334W",
    businessLicenseNo: "91320200MA1N8K334W",
    businessLicenseFileName: "无锡恒泰金属_营业执照.pdf",
    agentName: "孙志鹏",
    agentPhone: "135****8832",
    agentIdCard: "320202********6612",
    collateralType: "INVENTORY",
    inventoryItems: [
      {
        id: "inv-op-501",
        categoryName: "有色金属",
        varietyName: "0# 锌锭",
        specModel: "Zn99.995 国标零号锌锭",
        warehouseName: "无锡锡山有色交割库",
        zoneLocation: "三号库房 · C区 C-04-02",
        pledgeQuantity: 180.0,
        unit: "吨",
        unitPriceYuan: 25200,
        assessedValueYuan: 4536000,
        availability: "LOCKED",
      },
    ],
    receiptItems: [],
    assessedValueYuan: 4536000,
    intendedAmountYuan: 3000000,
    intendedPeriods: 6,
    creditAmountYuan: 2900000,
    creditPeriods: 6,
    loanAmountYuan: 2800000,
    loanPeriods: 6,
    disburseDate: "2026-11-08",
    disburseReceiptFileName: "交通银行_放款电子回单_280万.pdf",
    approvedPledgeRatio: 61.73,
    pledgeOrderNo: "PO-20261107-0042",
    evidenceHash:
      "3c7b9e1d4f6a2b8c0e5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e",
    financingStatus: "LOAN_DISBURSED",
    appliedAt: "2026-11-06 13:45:00",
    handlerName: "孙志鹏 (客户经办)",
    handledAt: "2026-11-08 14:20:18",
    version: 4,
    attachments: [
      {
        id: "att-op-501",
        category: "放款回单",
        fileName: "交通银行_放款电子回单_280万.pdf",
        fileSize: "642 KB",
        uploadedAt: "2026-11-08 14:20:18",
      },
      {
        id: "att-op-502",
        category: "电子质押协议",
        fileName: "动产质押电子监管协议_PO202611070042.pdf",
        fileSize: "1.98 MB",
        uploadedAt: "2026-11-07 17:10:00",
      },
    ],
    timeline: [
      {
        id: "tl-op-503",
        time: "2026-11-08 14:20:18",
        action: "录入贷款发放结果",
        operator: "孙志鹏 (客户经办)",
        operatorOrg: "交通银行无锡分行结算部",
        result: "已放款",
        remark: "实际放款 2,800,000.00 元，期数 6 期，已异步回写线索与尽调台账。",
      },
      {
        id: "tl-op-502",
        time: "2026-11-07 17:10:00",
        action: "流程审核通过 · 订单生成",
        operator: "赵雅琪 (SY-1019)",
        operatorOrg: "森云风控合规部",
        result: "订单已生成",
        remark: "生成正式抵质押订单 PO-20261107-0042，存货正式锁定为质押中。",
      },
    ],
  },
  {
    id: "op-20261028-0006",
    applyNo: "PLEDGE-20261028-0006",
    productName: "标准仓单极速质押贷",
    needDiligence: false,
    funderName: "平安银行上海分行",
    applicantType: "INDIVIDUAL",
    applicantName: "林建华",
    applicantIdentifier: "136****9104",
    applicantPhone: "136****9104",
    applicantIdCard: "350102********7735",
    collateralType: "WAREHOUSE_RECEIPT",
    inventoryItems: [],
    receiptItems: [
      {
        id: "wr-op-601",
        receiptNo: "WR202610150032",
        goodsSummary: "螺纹钢 HRB400E Φ20mm",
        warehouseName: "上海宝山钢材交割库",
        quantityText: "320.00 吨",
        assessedValueYuan: 1184000,
        availability: "AVAILABLE",
      },
    ],
    assessedValueYuan: 1184000,
    intendedAmountYuan: 800000,
    intendedPeriods: 1,
    creditAmountYuan: 780000,
    creditPeriods: 1,
    loanAmountYuan: 750000,
    loanPeriods: 1,
    disburseDate: "2026-10-30",
    disburseReceiptFileName: "平安银行_放款电子回单_75万.pdf",
    approvedPledgeRatio: 63.34,
    pledgeOrderNo: "PO-20261029-0015",
    evidenceHash:
      "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    financingStatus: "SETTLED",
    appliedAt: "2026-10-28 09:10:00",
    handlerName: "系统事件总线",
    handledAt: "2026-11-10 11:00:05",
    version: 5,
    attachments: [
      {
        id: "att-op-601",
        category: "放款回单",
        fileName: "平安银行_放款电子回单_75万.pdf",
        fileSize: "520 KB",
        uploadedAt: "2026-10-30 15:02:11",
      },
      {
        id: "att-op-602",
        category: "电子质押协议",
        fileName: "电子仓单质押协议_PO202610290015.pdf",
        fileSize: "1.76 MB",
        uploadedAt: "2026-10-29 14:30:00",
      },
    ],
    timeline: [
      {
        id: "tl-op-603",
        time: "2026-11-10 11:00:05",
        action: "解质押结清同步",
        operator: "系统事件总线",
        operatorOrg: "仓储监管中心",
        result: "已结清（终态只读）",
        remark: "关联抵质押订单 PO-20261029-0015 已完成全额解质押，单据自动归档锁定。",
      },
      {
        id: "tl-op-602",
        time: "2026-10-30 15:02:11",
        action: "录入贷款发放结果",
        operator: "林建华（个人货主）",
        operatorOrg: "PC 端录入",
        result: "已放款",
        remark: "实际放款 750,000.00 元，期数 1 期。",
      },
    ],
  },
]

export function loadOnlinePledgeRecords(): OnlinePledgeRecord[] {
  try {
    const raw = window.localStorage.getItem(ONLINE_PLEDGE_STORAGE_KEY)
    if (!raw) return [...INITIAL_ONLINE_PLEDGE_MOCK]
    const parsed = JSON.parse(raw) as OnlinePledgeRecord[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...INITIAL_ONLINE_PLEDGE_MOCK]
    }
    return parsed
  } catch {
    return [...INITIAL_ONLINE_PLEDGE_MOCK]
  }
}

export function saveOnlinePledgeRecords(records: OnlinePledgeRecord[]): void {
  try {
    window.localStorage.setItem(
      ONLINE_PLEDGE_STORAGE_KEY,
      JSON.stringify(records),
    )
  } catch {
    // 忽略沙箱或隐私模式存储限制
  }
}

export function OnlinePledgeListPage() {
  const navigate = useNavigate()
  const [records] = useState<OnlinePledgeRecord[]>(() =>
    loadOnlinePledgeRecords(),
  )
  const [draftFilters, setDraftFilters] = useState<OnlinePledgeFilters>(
    DEFAULT_ONLINE_PLEDGE_FILTERS,
  )
  const [appliedFilters, setAppliedFilters] = useState<OnlinePledgeFilters>(
    DEFAULT_ONLINE_PLEDGE_FILTERS,
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exportRecords, setExportRecords] = useState<ExportRecordItem[]>(() => [
    {
      id: "OP-EXP-202611120930",
      fileName: "线上监管业务办理台账-20261112.xlsx",
      viewDimension: "线上监管业务办理台账",
      filterSummary: "全部状态 · 全部标的",
      recordCount: 6,
      creator: "张晓梅",
      creatorOrg: "森云融资运营中心",
      createTime: "2026-11-12 09:30:00",
      status: "SUCCESS",
      fileSize: "92.8 KB",
    },
  ])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3000)
  }


  const filtered = useMemo(() => {
    const applyNoQ = appliedFilters.applyNo.trim().toLowerCase()
    const kwQ = appliedFilters.keyword.trim().toLowerCase()

    return records.filter((item) => {
      if (
        appliedFilters.financingStatus !== "ALL" &&
        item.financingStatus !== appliedFilters.financingStatus
      ) {
        return false
      }
      if (
        appliedFilters.needDiligence !== "ALL" &&
        (appliedFilters.needDiligence === "YES") !== item.needDiligence
      ) {
        return false
      }
      if (
        appliedFilters.collateralType !== "ALL" &&
        item.collateralType !== appliedFilters.collateralType
      ) {
        return false
      }
      if (
        appliedFilters.applicantType !== "ALL" &&
        item.applicantType !== appliedFilters.applicantType
      ) {
        return false
      }
      if (applyNoQ && !item.applyNo.toLowerCase().includes(applyNoQ)) {
        return false
      }
      if (
        kwQ &&
        !item.applicantName.toLowerCase().includes(kwQ) &&
        !item.productName.toLowerCase().includes(kwQ)
      ) {
        return false
      }
      const dateStr = item.appliedAt.slice(0, 10)
      if (
        appliedFilters.appliedStartDate &&
        dateStr < appliedFilters.appliedStartDate
      ) {
        return false
      }
      if (
        appliedFilters.appliedEndDate &&
        dateStr > appliedFilters.appliedEndDate
      ) {
        return false
      }
      return true
    })
  }, [records, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_ONLINE_PLEDGE_FILTERS)
    setAppliedFilters(DEFAULT_ONLINE_PLEDGE_FILTERS)
    setPage(1)
  }

  const handleExportExcel = () => {
    const stamp = nowExportStamp()
    const task: ExportRecordItem = {
      id: `OP-EXP-${stamp.compact}`,
      fileName: `线上监管业务办理台账-${stamp.compact}.xlsx`,
      viewDimension: "线上监管业务办理台账",
      filterSummary: `融资状态：${appliedFilters.financingStatus === "ALL" ? "全部" : FINANCING_STATUS_META[appliedFilters.financingStatus].label}`,
      recordCount: filtered.length,
      creator: "当前经办人",
      creatorOrg: "森云融资运营中心",
      createTime: stamp.display,
      status: "GENERATING",
      fileSize: "--",
    }
    setExportRecords((current) => [task, ...current])
    setExportModalOpen(true)
    showToast(`已创建导出任务，正在导出 ${filtered.length} 条线上监管业务记录`)
    window.setTimeout(() => {
      setExportRecords((current) =>
        current.map((row) =>
          row.id === task.id
            ? { ...row, status: "SUCCESS", fileSize: "94.2 KB" }
            : row,
        ),
      )
    }, 1800)
  }

  const handleRowAction = (
    action: OnlinePledgeRowActionKind,
    item: OnlinePledgeRecord,
  ) => {
    if (action === "detail") {
      navigate(onlinePledgeDetailPath(item.id))
      return
    }
    navigate(onlinePledgeActionPath(item.id, action))
  }

  return (
    <PrototypeAnnotationProvider
      title="线上监管业务办理"
      documents={onlinePledgeDocuments}
      annotations={onlinePledgeListAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["online-pledge-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              线上监管业务办理
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {ONLINE_PLEDGE_PAGE_USER_DESC}
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <SegmentedTabs<"ALL" | FinancingStatus>
          items={[
            { key: "ALL", label: "全部" },
            {
              key: "CREDIT_SUCCESS",
              label: FINANCING_STATUS_META.CREDIT_SUCCESS.label,
            },
            {
              key: "IN_PROCESSING",
              label: FINANCING_STATUS_META.IN_PROCESSING.label,
            },
            {
              key: "LOAN_DISBURSED",
              label: FINANCING_STATUS_META.LOAN_DISBURSED.label,
            },
            {
              key: "SETTLED",
              label: FINANCING_STATUS_META.SETTLED.label,
            },
          ]}
          value={appliedFilters.financingStatus}
          onChange={(key) => {
            const next = { ...draftFilters, financingStatus: key }
            setDraftFilters(next)
            setAppliedFilters(next)
            setPage(1)
          }}
        />

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["online-pledge-filter"]}>
            <OnlinePledgeFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              extraActions={
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={handleExportExcel}
                  >
                    <DownloadIcon className="size-3.5" />
                    导出为Excel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setExportModalOpen(true)}
                  >
                    <HistoryIcon className="size-3.5" />
                    导出记录
                  </Button>
                </div>
              }
            />
          </PrototypeAnnotationTarget>
        </form>

        <div className="space-y-4">
          <PrototypeAnnotationTarget
            annotationIds={["online-pledge-table", "online-pledge-actions"]}
          >
            <OnlinePledgeTable
              data={pageData}
              onAction={handleRowAction}
              onResetFilters={handleReset}
            />
          </PrototypeAnnotationTarget>

          <WarningListPagination
            total={filtered.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </div>

        <ExportRecordsDialog
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          records={exportRecords}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}

