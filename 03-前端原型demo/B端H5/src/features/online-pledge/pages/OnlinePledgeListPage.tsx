import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Filter, RotateCcw, Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  FINANCING_STATUS_META,
  H5_ONLINE_PLEDGE_STORAGE_KEY,
  PROCESSING_STAGE_LABEL,
  formatYuan,
  h5OnlinePledgeActionPath,
  h5OnlinePledgeDetailPath,
  type ApplicantType,
  type CollateralType,
  type FinancingStatus,
  type OnlinePledgeRecord,
} from "../domain/types"

export const INITIAL_H5_ONLINE_PLEDGE_MOCK: OnlinePledgeRecord[] = [
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
    ],
    timeline: [
      {
        id: "tl-op-1",
        time: "2026-11-12 15:40:00",
        action: "授信核准流入",
        operator: "张晓梅 (SY-1024)",
        operatorOrg: "浦发银行授信审批部",
        result: "申请成功",
        remark: "核定最高授信额度 350.00 万元，最长期限 6 期，待发起抵质押信息确认。",
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
      "原提交仓单质押率测算超出资方 65% 阈值，经与客户沟通后审核拒绝并在本地回退，请调整后重新发起。",
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
        remark: "原提交仓单质押率超出阈值，已本地回退并释放锁定（暂不入被拒池）。",
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
    ],
    timeline: [
      {
        id: "tl-op-301",
        time: "2026-11-12 17:12:44",
        action: "发起抵质押信息确认",
        operator: "周建国 (客户经办)",
        operatorOrg: "江苏华冶钢铁供应链有限公司",
        result: "处理中（信息确认审核中）",
        remark: "锁定热轧卷板 850 吨，生成风控审核任务。",
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
    ],
    timeline: [
      {
        id: "tl-op-402",
        time: "2026-11-11 16:45:12",
        action: "流程审核通过 · 订单生成",
        operator: "赵雅琪 (SY-1019)",
        operatorOrg: "森云风控合规部",
        result: "订单已生成（不可撤销）",
        remark: "生成正式抵质押订单 PO-20261111-0089，等待录入放款结果。",
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
    ],
    timeline: [
      {
        id: "tl-op-503",
        time: "2026-11-08 14:20:18",
        action: "录入贷款发放结果",
        operator: "孙志鹏 (客户经办)",
        operatorOrg: "交通银行无锡分行结算部",
        result: "已放款",
        remark: "实际放款 2,800,000.00 元，期数 6 期。",
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
    ],
    timeline: [
      {
        id: "tl-op-603",
        time: "2026-11-10 11:00:05",
        action: "解质押结清同步",
        operator: "系统事件总线",
        operatorOrg: "仓储监管中心",
        result: "已结清（终态只读）",
        remark: "关联抵质押订单 PO-20261029-0015 已完成全额解质押。",
      },
    ],
  },
]

export function loadH5OnlinePledgeRecords(): OnlinePledgeRecord[] {
  try {
    const raw = window.localStorage.getItem(H5_ONLINE_PLEDGE_STORAGE_KEY)
    if (!raw) return [...INITIAL_H5_ONLINE_PLEDGE_MOCK]
    const parsed = JSON.parse(raw) as OnlinePledgeRecord[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...INITIAL_H5_ONLINE_PLEDGE_MOCK]
    }
    return parsed
  } catch {
    return [...INITIAL_H5_ONLINE_PLEDGE_MOCK]
  }
}

export function saveH5OnlinePledgeRecords(records: OnlinePledgeRecord[]): void {
  try {
    window.localStorage.setItem(
      H5_ONLINE_PLEDGE_STORAGE_KEY,
      JSON.stringify(records),
    )
  } catch {
    // 忽略存储限制
  }
}

export function OnlinePledgeListPage() {
  const navigate = useNavigate()
  const [records] = useState<OnlinePledgeRecord[]>(() =>
    loadH5OnlinePledgeRecords(),
  )
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | FinancingStatus>("ALL")
  const [collateralFilter, setCollateralFilter] = useState<"ALL" | CollateralType>("ALL")
  const [applicantFilter, setApplicantFilter] = useState<"ALL" | ApplicantType>("ALL")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    return records.filter((item) => {
      if (statusFilter !== "ALL" && item.financingStatus !== statusFilter) {
        return false
      }
      if (collateralFilter !== "ALL" && item.collateralType !== collateralFilter) {
        return false
      }
      if (applicantFilter !== "ALL" && item.applicantType !== applicantFilter) {
        return false
      }
      if (
        q &&
        !item.applyNo.toLowerCase().includes(q) &&
        !item.applicantName.toLowerCase().includes(q) &&
        !item.productName.toLowerCase().includes(q)
      ) {
        return false
      }
      return true
    })
  }, [records, keyword, statusFilter, collateralFilter, applicantFilter])

  const handleReset = () => {
    setKeyword("")
    setStatusFilter("ALL")
    setCollateralFilter("ALL")
    setApplicantFilter("ALL")
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["online-pledge-h5-list-page"]}>
        <NavBar
          title="线上监管业务办理"
          showBack
          onBack={() => navigate("/m/workspace")}
        />
      </PrototypeAnnotationTarget>

      <div className="space-y-3 bg-[#F6F8FA] p-3 pb-20 min-h-[calc(100%-44px)]">
        <PrototypeAnnotationTarget annotationIds={["online-pledge-h5-filter"]}>
          <div className="space-y-2.5 rounded-xl bg-white p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索申请单号、申请人或产品名称"
                  className="h-8 w-full rounded-lg border border-gray-200 bg-[#F6F8FA] pr-3 pl-8 text-xs text-[#232D39] outline-none focus:border-[#2E54C6]"
                />
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-[#232D39]"
              >
                <Filter className="size-3.5" />
                筛选
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {(
                [
                  "ALL",
                  "CREDIT_SUCCESS",
                  "IN_PROCESSING",
                  "LOAN_DISBURSED",
                  "SETTLED",
                ] as const
              ).map((key) => {
                const active = statusFilter === key
                const label =
                  key === "ALL" ? "全部" : FINANCING_STATUS_META[key].label
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(key)}
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                      active
                        ? "border-[#2E54C6] bg-[#2E54C6] text-white"
                        : "border-gray-200 bg-white text-[#232D39]/70"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["online-pledge-h5-cards"]}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white px-4 py-12 text-center shadow-xs">
              <div className="text-sm font-medium text-[#232D39]">
                暂无匹配的线上监管业务单据
              </div>
              <div className="mt-1 text-xs text-[#232D39]/55">
                请调整搜索关键词或筛选条件后重试
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-3 inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#232D39]"
              >
                <RotateCcw className="size-3.5" />
                重置筛选
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((item) => {
                const statusMeta = FINANCING_STATUS_META[item.financingStatus]
                return (
                  <div
                    key={item.id}
                    className="rounded-xl bg-white p-3.5 shadow-xs space-y-2.5"
                  >
                    {/* 1. 单号与状态 */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => navigate(h5OnlinePledgeDetailPath(item.id))}
                          className="text-xs font-semibold text-[#2E54C6] break-all text-left"
                        >
                          {item.applyNo}
                        </button>
                        <div className="mt-0.5 text-xs font-medium text-[#232D39] truncate">
                          {item.productName}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusMeta.pillClass}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    {/* 2. 核心信息 */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-lg bg-[#F6F8FA] p-2.5 text-[11px]">
                      <div>
                        <span className="text-[#232D39]/55">申请人：</span>
                        <span className="font-medium text-[#232D39]">
                          {item.applicantName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#232D39]/55">标的：</span>
                        <span className="font-medium text-[#232D39]">
                          {item.collateralType === "INVENTORY"
                            ? "现货存货"
                            : "数字仓单"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#232D39]/55">授信额度：</span>
                        <span className="font-semibold text-[#232D39]">
                          {formatYuan(item.creditAmountYuan)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#232D39]/55">放款金额：</span>
                        <span className="font-semibold text-emerald-700">
                          {formatYuan(item.loanAmountYuan)}
                        </span>
                      </div>
                    </div>

                    {item.financingStatus === "IN_PROCESSING" &&
                      item.processingStage && (
                        <div className="text-[11px] text-amber-700">
                          当前阶段：{PROCESSING_STAGE_LABEL[item.processingStage]}
                        </div>
                      )}

                    {/* 3. 操作胶囊（一行 ≤4） */}
                    <div className="flex flex-wrap items-center justify-end gap-1.5 border-t border-gray-100 pt-2">
                      <button
                        type="button"
                        onClick={() => navigate(h5OnlinePledgeDetailPath(item.id))}
                        className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-medium text-[#232D39]"
                      >
                        查看详情
                      </button>

                      {item.financingStatus === "CREDIT_SUCCESS" && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(h5OnlinePledgeActionPath(item.id, "initiate"))
                          }
                          className="rounded-full bg-[#2E54C6] px-3 py-1 text-[11px] font-medium text-white"
                        >
                          发起确认
                        </button>
                      )}

                      {item.financingStatus === "IN_PROCESSING" &&
                        item.processingStage !== "ORDER_GENERATED" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                navigate(h5OnlinePledgeActionPath(item.id, "cancel"))
                              }
                              className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700"
                            >
                              主动撤销
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                navigate(h5OnlinePledgeActionPath(item.id, "audit"))
                              }
                              className="rounded-full bg-[#2E54C6] px-3 py-1 text-[11px] font-medium text-white"
                            >
                              审核
                            </button>
                          </>
                        )}

                      {item.financingStatus === "IN_PROCESSING" &&
                        item.processingStage === "ORDER_GENERATED" && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(h5OnlinePledgeActionPath(item.id, "disburse"))
                            }
                            className="rounded-full bg-[#2E54C6] px-3 py-1 text-[11px] font-medium text-white"
                          >
                            录入放款结果
                          </button>
                        )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </PrototypeAnnotationTarget>
      </div>

      {/* 底部筛选抽屉 */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <div className="w-full rounded-t-2xl bg-white p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#232D39]">
                更多筛选条件
              </span>
              <button type="button" onClick={() => setDrawerOpen(false)}>
                <X className="size-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500">抵/质押物类型</div>
              <div className="flex gap-2">
                {(
                  [
                    { key: "ALL", label: "全部" },
                    { key: "INVENTORY", label: "现货存货" },
                    { key: "WAREHOUSE_RECEIPT", label: "数字仓单" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setCollateralFilter(opt.key)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      collateralFilter === opt.key
                        ? "border-[#2E54C6] bg-[#2E54C6]/10 text-[#2E54C6] font-medium"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500">申请人类型</div>
              <div className="flex gap-2">
                {(
                  [
                    { key: "ALL", label: "全部" },
                    { key: "ENTERPRISE", label: "企业货主" },
                    { key: "INDIVIDUAL", label: "个人货主" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setApplicantFilter(opt.key)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      applicantFilter === opt.key
                        ? "border-[#2E54C6] bg-[#2E54C6]/10 text-[#2E54C6] font-medium"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleReset()
                  setDrawerOpen(false)
                }}
                className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium text-[#232D39]"
              >
                重置
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-full bg-[#2E54C6] py-2 text-xs font-medium text-white"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-2 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}
    </MobileShell>
  )
}
