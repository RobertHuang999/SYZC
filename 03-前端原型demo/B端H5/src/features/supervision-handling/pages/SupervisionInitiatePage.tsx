import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  QrCode,
  ScanLine,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import { NativeInboundStepBar } from "@/features/inbound-records/components/NativeInboundStepBar"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"

type DocKind = "PLEDGE" | "MORTGAGE" | "SUPERVISION_SERVICE"
type OwnerKind = "ENTERPRISE" | "INDIVIDUAL"
type CargoType = "INVENTORY" | "RECEIPT"
type DeductMode = "FIFO" | "CUSTOM"

interface H5OwnerOption {
  id: string
  type: OwnerKind
  name: string
  identifier: string
  contact: string
}

interface H5HolderOption {
  id: string
  domain: "资金方信息" | "服务方信息"
  name: string
  identifier: string
}

interface H5ReceiptItem {
  id: string
  receiptNo: string
  status: "正常"
  holderName: string
  holderId: string
  custodianName: string
  custodianId: string
  issuedAt: string
  warehouseName: string
  goodsSummary: string[]
}

const OWNER_OPTIONS: H5OwnerOption[] = [
  {
    id: "own-1",
    type: "ENTERPRISE",
    name: "亮点信息科技有限公司",
    identifier: "91441400MA52XE5675",
    contact: "186****5923",
  },
  {
    id: "own-2",
    type: "ENTERPRISE",
    name: "上海晟源有色金属有限公司",
    identifier: "91310115MA1K4R892X",
    contact: "138****4512",
  },
  {
    id: "own-3",
    type: "INDIVIDUAL",
    name: "原原李",
    identifier: "185****7112",
    contact: "420101********4230",
  },
]

const HOLDER_OPTIONS: H5HolderOption[] = [
  {
    id: "hld-1",
    domain: "资金方信息",
    name: "浦发银行上海自贸试验区分行",
    identifier: "91310000MA1K38219E",
  },
  {
    id: "hld-2",
    domain: "资金方信息",
    name: "兴业银行苏州分行",
    identifier: "91320500MA1N77218Q",
  },
  {
    id: "hld-3",
    domain: "服务方信息",
    name: "森云智储监管服务有限公司",
    identifier: "91440300MA5H88120K",
  },
]

const H5_RECEIPT_CATALOG: H5ReceiptItem[] = [
  {
    id: "rec-1",
    receiptNo: "CD2061264146428260353",
    status: "正常",
    holderName: "阜阳市大数据资产运营有限公司",
    holderId: "913****1202MA2U0JHJ3F",
    custodianName: "海霸王仓库",
    custodianId: "CUST-HBW-001",
    issuedAt: "2026-11-01 09:51:15",
    warehouseName: "海霸王仓库",
    goodsSummary: ["冻货-牛肉丸-36个月-1公斤", "冻货-鸡翅-四川-特级-2斤"],
  },
  {
    id: "rec-2",
    receiptNo: "CD2061353246054866946",
    status: "正常",
    holderName: "阜阳市大数据资产运营有限公司",
    holderId: "913****1202MA2U0JHJ3F",
    custodianName: "海霸王仓库",
    custodianId: "CUST-HBW-001",
    issuedAt: "2026-11-02 15:45:01",
    warehouseName: "海霸王仓库",
    goodsSummary: ["水果-香蕉-海南-0.01斤"],
  },
  {
    id: "rec-3",
    receiptNo: "CD2061489920184750112",
    status: "正常",
    holderName: "上海晟源有色金属有限公司",
    holderId: "91310115MA1K4R892X",
    custodianName: "华东仓储运营中心",
    custodianId: "CUST-HD-002",
    issuedAt: "2026-11-05 11:20:00",
    warehouseName: "华东仓储运营中心",
    goodsSummary: ["有色金属-电解铜-1#阴极铜-100吨"],
  },
]

interface H5SlotLot {
  slotId: string
  storeroom: string
  zone: string
  inboundTime: string
  availableQty: number
  batchInfo: string
}

const H5_INVENTORY_SKUS: Array<{
  skuId: string
  skuName: string
  warehouse: string
  unit: string
  unitPriceYuan: number | null
  lots: H5SlotLot[]
}> = [
  {
    skuId: "h5-sku-1",
    skuName: "钢-碳素钢-中级",
    warehouse: "钢铁智慧监管仓",
    unit: "吨",
    unitPriceYuan: 3820,
    lots: [
      {
        slotId: "h5-lot-1",
        storeroom: "审核库房",
        zone: "临时分区",
        inboundTime: "2026-10-18 13:59:32",
        availableQty: 450,
        batchInfo: "季节: 秋季 / 车辆: 沪A·89210",
      },
      {
        slotId: "h5-lot-2",
        storeroom: "重型钢材库",
        zone: "北区",
        inboundTime: "2026-11-02 09:15:00",
        availableQty: 320,
        batchInfo: "钢厂: 宝钢 / 炉号: BG261102",
      },
    ],
  },
  {
    skuId: "h5-sku-2",
    skuName: "有色金属-电解铜-1#阴极铜",
    warehouse: "华东仓储运营中心",
    unit: "吨",
    unitPriceYuan: 74500,
    lots: [
      {
        slotId: "h5-lot-3",
        storeroom: "一号库房",
        zone: "A区",
        inboundTime: "2026-11-01 10:20:00",
        availableQty: 120.5,
        batchInfo: "产地: 江西贵溪 / 批次: CU261101",
      },
    ],
  },
]

export function SupervisionInitiatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<0 | 1>(0)
  const [docKind, setDocKind] = useState<DocKind>("MORTGAGE")
  const [ownerType, setOwnerType] = useState<OwnerKind>("ENTERPRISE")
  const [selectedOwner, setSelectedOwner] = useState<H5OwnerOption | null>(null)
  const [selectedHolder, setSelectedHolder] = useState<H5HolderOption | null>(null)

  const [guaranteeMode, setGuaranteeMode] = useState<"DYNAMIC" | "STATIC">("DYNAMIC")
  const [safetyLineEnabled, setSafetyLineEnabled] = useState(true)
  const [safetyLineAmount, setSafetyLineAmount] = useState("10")
  const [loanAmount, setLoanAmount] = useState("")
  const [loanUnit, setLoanUnit] = useState<"万元" | "元">("万元")
  const [loanPeriods, setLoanPeriods] = useState("")
  const [creditAmount, setCreditAmount] = useState("")
  const [creditUnit, setCreditUnit] = useState<"万元" | "元">("万元")
  const [creditPeriods, setCreditPeriods] = useState("")
  const [contractNo, setContractNo] = useState("")
  const [remark, setRemark] = useState("")
  const [cargoType, setCargoType] = useState<CargoType>("INVENTORY")

  // 存货三级选货状态
  const [pickingStage, setPickingStage] = useState<"MAIN" | "SELECT_SKU" | "SELECT_LOT">("MAIN")
  const [activeSkuId, setActiveSkuId] = useState<string>("h5-sku-1")
  const [deductMode, setDeductMode] = useState<DeductMode>("FIFO")
  const [fifoTotalInput, setFifoTotalInput] = useState("")
  const [lotAllocations, setLotAllocations] = useState<Record<string, number>>({})
  const [expandedDetailSku, setExpandedDetailSku] = useState<Record<string, boolean>>({
    "h5-sku-1": true,
  })

  // 仓单专道状态
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<string[]>([])
  const [custodianConflictOpen, setCustodianConflictOpen] = useState(false)
  const [faceVerifyOpen, setFaceVerifyOpen] = useState(false)
  const [faceVerifying, setFaceVerifying] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const pageTitle =
    docKind === "MORTGAGE"
      ? "抵押单填写"
      : docKind === "PLEDGE"
        ? "质押单填写"
        : "监管服务单填写"

  const holderDomain = docKind === "SUPERVISION_SERVICE" ? "服务方信息" : "资金方信息"
  const holderLabel =
    docKind === "MORTGAGE"
      ? "抵押权人"
      : docKind === "PLEDGE"
        ? "质押权人"
        : "质权人（服务方）"

  const filteredHolders = HOLDER_OPTIONS.filter((h) => h.domain === holderDomain)
  const filteredOwners = OWNER_OPTIONS.filter((o) => o.type === ownerType)

  const selectedSkus = useMemo(() => {
    return H5_INVENTORY_SKUS.map((sku) => {
      const lots = sku.lots
        .map((l) => ({ ...l, qty: lotAllocations[l.slotId] ?? 0 }))
        .filter((l) => l.qty > 0)
      const totalQty = lots.reduce((s, x) => s + x.qty, 0)
      return { ...sku, lots, totalQty }
    }).filter((s) => s.totalQty > 0)
  }, [lotAllocations])

  const totalInventoryValue = useMemo(() => {
    let sum = 0
    for (const s of selectedSkus) {
      if (s.unitPriceYuan !== null) sum += s.totalQty * s.unitPriceYuan
    }
    return sum
  }, [selectedSkus])

  const handleNextStep = () => {
    if (!selectedOwner) {
      showToast("请先选择货主信息")
      return
    }
    if (!selectedHolder) {
      showToast(`请先选择${holderLabel}`)
      return
    }
    const loanNum = loanAmount ? Number(loanAmount) : 0
    const creditNum = creditAmount ? Number(creditAmount) : 0
    if (loanAmount && creditAmount) {
      const loanY = loanUnit === "万元" ? loanNum * 10000 : loanNum
      const creditY = creditUnit === "万元" ? creditNum * 10000 : creditNum
      if (loanY > creditY) {
        showToast("贷款金额不能高于资金方核准的授信金额")
        return
      }
    }
    if (loanPeriods && creditPeriods && Number(loanPeriods) > Number(creditPeriods)) {
      showToast("贷款期数不能高于授信期数")
      return
    }
    if (guaranteeMode === "DYNAMIC" && safetyLineEnabled) {
      if (!safetyLineAmount || Number(safetyLineAmount) <= 0) {
        showToast("流动/浮动模式下必须输入大于 0 的货值安全线")
        return
      }
    }
    setStep(1)
  }

  const applyFifoAllocation = (skuId: string, totalStr: string) => {
    setFifoTotalInput(totalStr)
    const sku = H5_INVENTORY_SKUS.find((s) => s.skuId === skuId)
    if (!sku) return
    let remain = Math.max(0, Number(totalStr) || 0)
    const next = { ...lotAllocations }
    for (const lot of sku.lots) {
      const take = Math.min(remain, lot.availableQty)
      if (take > 0) {
        next[lot.slotId] = Number(take.toFixed(4))
        remain = Number((remain - take).toFixed(4))
      } else {
        delete next[lot.slotId]
      }
    }
    setLotAllocations(next)
  }

  const handleToggleReceipt = (rec: H5ReceiptItem) => {
    setSelectedReceiptIds((prev) =>
      prev.includes(rec.id) ? prev.filter((x) => x !== rec.id) : [...prev, rec.id],
    )
  }

  const handleFinalSubmit = () => {
    if (cargoType === "INVENTORY") {
      if (selectedSkus.length === 0) {
        showToast("请先添加并分配货物数量")
        return
      }
      showToast("提交成功！存货货位已锁定并推入工作中心审批")
      window.setTimeout(() => navigate("/m/supervision/records"), 700)
      return
    }

    // 仓单模式：检查选中与保管人一致性 (R07/R08/C02)
    if (selectedReceiptIds.length === 0) {
      showToast("请至少勾选 1 张正常状态的电子仓单")
      return
    }
    const chosen = H5_RECEIPT_CATALOG.filter((r) => selectedReceiptIds.includes(r.id))
    const custodianIds = new Set(chosen.map((r) => r.custodianId))
    if (custodianIds.size > 1) {
      setCustodianConflictOpen(true)
      return
    }

    // 仓单模式强制唤起法定代表人活体人脸识别 (R09/P02)
    setFaceVerifyOpen(true)
  }

  const handleConfirmFaceAuth = () => {
    setFaceVerifying(true)
    window.setTimeout(() => {
      setFaceVerifying(false)
      setFaceVerifyOpen(false)
      showToast("活体人脸核验通过（置信度 99.4%），仓单已锁定并推入审批流")
      window.setTimeout(() => navigate("/m/supervision/records"), 700)
    }, 900)
  }

  // 二级货物明细分配页 (FIFO / 自定义)
  if (step === 1 && cargoType === "INVENTORY" && pickingStage === "SELECT_LOT") {
    const sku = H5_INVENTORY_SKUS.find((s) => s.skuId === activeSkuId) ?? H5_INVENTORY_SKUS[0]
    const skuAvailable = sku.lots.reduce((s, l) => s + l.availableQty, 0)
    const skuSelected = sku.lots.reduce((s, l) => s + (lotAllocations[l.slotId] ?? 0), 0)
    return (
      <MobileShell>
        <NavBar
          title="货物明细"
          showBack
          onBack={() => setPickingStage("SELECT_SKU")}
        />
        <div className="flex-1 space-y-3 overflow-y-auto bg-[#F5F7FA] p-3 pb-24">
          <div className="rounded-xl bg-white p-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-[#232D39]">{sku.skuName}</div>
              <span className="shrink-0 text-xs font-medium text-[#1875F0]">
                可用: {skuAvailable}
                {sku.unit}
              </span>
            </div>
            <div className="mt-1 text-xs text-[#64748B]">{sku.warehouse}</div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-[#232D39]">扣减方式</span>
              <div className="flex gap-2">
                {(
                  [
                    { key: "FIFO", label: "先进先出" },
                    { key: "CUSTOM", label: "自定义" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setDeductMode(m.key)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      deductMode === m.key
                        ? "bg-[#1875F0] text-white"
                        : "bg-slate-100 text-[#64748B]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {deductMode === "FIFO" ? (
              <div className="mt-3 space-y-2 rounded-lg bg-blue-50/70 p-2.5">
                <div className="text-[11px] text-[#1875F0]">
                  根据入库时间先后顺序，对下方货位依次自动扣除可用数量
                </div>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xs text-[#232D39]">总抵押数量：</span>
                  <input
                    type="number"
                    min={0}
                    max={skuAvailable}
                    value={fifoTotalInput}
                    onChange={(e) => applyFifoAllocation(sku.skuId, e.target.value)}
                    placeholder={`最大 ${skuAvailable}${sku.unit}`}
                    className="h-8 flex-1 rounded border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-[#1875F0]"
                  />
                </div>
              </div>
            ) : null}
          </div>

          {sku.lots.map((lot) => {
            const val = lotAllocations[lot.slotId] ?? 0
            return (
              <div key={lot.slotId} className="rounded-xl bg-white p-3.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#232D39]">
                    {lot.storeroom} · {lot.zone}
                  </span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">
                    存货中
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-[#64748B]">入库时间：{lot.inboundTime}</div>
                <div className="mt-0.5 text-[11px] text-[#64748B]">{lot.batchInfo}</div>
                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <span className="text-xs text-[#64748B]">
                    可用 {lot.availableQty}
                    {sku.unit}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#232D39]">数量：</span>
                    <input
                      type="number"
                      min={0}
                      max={lot.availableQty}
                      disabled={deductMode === "FIFO"}
                      value={val > 0 ? val : ""}
                      onChange={(e) => {
                        const num = Math.min(lot.availableQty, Math.max(0, Number(e.target.value) || 0))
                        setLotAllocations((prev) => ({ ...prev, [lot.slotId]: num }))
                      }}
                      placeholder="0"
                      className="h-7 w-24 rounded border border-slate-200 px-2 text-right text-xs disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <div className="text-xs text-[#232D39]">
            合计数量：<strong className="text-sm text-[#1875F0]">{skuSelected}</strong> {sku.unit}
          </div>
          <button
            type="button"
            onClick={() => setPickingStage("SELECT_SKU")}
            className="rounded-lg bg-[#1875F0] px-5 py-2 text-xs font-medium text-white"
          >
            添加货物
          </button>
        </div>
      </MobileShell>
    )
  }

  // 一级选择货物卡片页
  if (step === 1 && cargoType === "INVENTORY" && pickingStage === "SELECT_SKU") {
    return (
      <MobileShell>
        <NavBar title="选择货物" showBack onBack={() => setPickingStage("MAIN")} />
        <div className="flex-1 space-y-3 overflow-y-auto bg-[#F5F7FA] p-3 pb-24">
          {H5_INVENTORY_SKUS.map((sku) => {
            const selectedSum = sku.lots.reduce((s, l) => s + (lotAllocations[l.slotId] ?? 0), 0)
            const totalAvail = sku.lots.reduce((s, l) => s + l.availableQty, 0)
            return (
              <div key={sku.skuId} className="rounded-xl bg-white p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-[#232D39]">{sku.skuName}</div>
                    <div className="mt-1 text-xs text-[#64748B]">
                      {sku.warehouse} · 可用 {totalAvail}
                      {sku.unit}
                    </div>
                  </div>
                  {selectedSum > 0 ? (
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                      已选 {selectedSum}
                      {sku.unit}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSkuId(sku.skuId)
                      setPickingStage("SELECT_LOT")
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#1875F0]"
                  >
                    <span>去选取</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setPickingStage("MAIN")}
            className="w-full rounded-lg bg-[#1875F0] py-2.5 text-sm font-medium text-white"
          >
            确认选货
          </button>
        </div>
      </MobileShell>
    )
  }

  return (
    <PrototypeAnnotationTarget annotationIds={["supervision-h5-initiate-page"]}>
      <MobileShell>
        <NavBar
          title={pageTitle}
          showBack
          onBack={() => navigate("/m/tasks")}
          right={
            <button
              type="button"
              onClick={() => navigate("/m/supervision/records")}
              className="text-xs font-medium text-[#1875F0]"
            >
              办理记录
            </button>
          }
        />

        <div id="supervision-h5-initiate-page" className="flex-1 overflow-y-auto bg-[#F5F7FA] px-3 pb-24">
          <NativeInboundStepBar current={step} />

          {step === 0 ? (
            <div className="space-y-3">
              {/* 单据类型切换胶囊 */}
              <NativeInfoCard title="开立单据类型">
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {(
                    [
                      { key: "MORTGAGE", label: "抵押单" },
                      { key: "PLEDGE", label: "质押单" },
                      { key: "SUPERVISION_SERVICE", label: "监管服务单" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setDocKind(item.key)
                        setSelectedHolder(null)
                      }}
                      className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                        docKind === item.key
                          ? "border-[#1875F0] bg-[#1875F0]/10 text-[#1875F0]"
                          : "border-slate-200 bg-white text-[#232D39]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </NativeInfoCard>

              {/* 货主信息 */}
              <NativeInfoCard title="货主信息">
                <NativeFormRow label="货主类型" required>
                  <div className="flex gap-2">
                    {(
                      [
                        { key: "ENTERPRISE", label: "企业" },
                        { key: "INDIVIDUAL", label: "个人" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setOwnerType(opt.key)
                          setSelectedOwner(null)
                        }}
                        className={`rounded-full px-3 py-1 text-xs ${
                          ownerType === opt.key
                            ? "bg-[#1875F0] text-white"
                            : "bg-slate-100 text-[#64748B]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </NativeFormRow>

                <NativeFormRow label="货主名称" required>
                  <select
                    value={selectedOwner?.id ?? ""}
                    onChange={(e) => {
                      const found = OWNER_OPTIONS.find((o) => o.id === e.target.value) ?? null
                      setSelectedOwner(found)
                    }}
                    className="w-full bg-transparent text-right text-xs text-[#232D39] outline-none"
                  >
                    <option value="">请选择货主</option>
                    {filteredOwners.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </NativeFormRow>

                {selectedOwner ? (
                  <>
                    <NativeFormRow label="货主标识">
                      <span className="text-xs text-[#64748B]">{selectedOwner.identifier}</span>
                    </NativeFormRow>
                    <NativeFormRow
                      label={ownerType === "ENTERPRISE" ? "联系电话" : "身份证号"}
                    >
                      <span className="text-xs text-[#64748B]">{selectedOwner.contact}</span>
                    </NativeFormRow>
                  </>
                ) : null}
              </NativeInfoCard>

              {/* 担保与授信信息 */}
              <NativeInfoCard title="担保与风控参数">
                <NativeFormRow label="担保方式" required>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGuaranteeMode("DYNAMIC")}
                      className={`rounded-full px-3 py-1 text-xs ${
                        guaranteeMode === "DYNAMIC"
                          ? "bg-[#1875F0] text-white"
                          : "bg-slate-100 text-[#64748B]"
                      }`}
                    >
                      {docKind === "MORTGAGE"
                        ? "浮动抵押"
                        : docKind === "PLEDGE"
                          ? "流动质押"
                          : "动态监管"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuaranteeMode("STATIC")}
                      className={`rounded-full px-3 py-1 text-xs ${
                        guaranteeMode === "STATIC"
                          ? "bg-[#1875F0] text-white"
                          : "bg-slate-100 text-[#64748B]"
                      }`}
                    >
                      {docKind === "MORTGAGE"
                        ? "固定抵押"
                        : docKind === "PLEDGE"
                          ? "静态质押"
                          : "静态监管"}
                    </button>
                  </div>
                </NativeFormRow>

                {guaranteeMode === "DYNAMIC" ? (
                  <>
                    <NativeFormRow label="货值安全线开关">
                      <button
                        type="button"
                        onClick={() => setSafetyLineEnabled((v) => !v)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          safetyLineEnabled
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-[#64748B]"
                        }`}
                      >
                        {safetyLineEnabled ? "已开启" : "已关闭"}
                      </button>
                    </NativeFormRow>
                    {safetyLineEnabled ? (
                      <NativeFormRow label="货值安全线(万元)" required>
                        <input
                          type="number"
                          value={safetyLineAmount}
                          onChange={(e) => setSafetyLineAmount(e.target.value)}
                          placeholder="大于 0"
                          className="w-full bg-transparent text-right text-xs outline-none"
                        />
                      </NativeFormRow>
                    ) : null}
                  </>
                ) : null}

                <NativeFormRow label="贷款金额">
                  <div className="flex items-center justify-end gap-1.5">
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="请输入实际贷款金额"
                      className="w-28 bg-transparent text-right text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setLoanUnit((u) => (u === "万元" ? "元" : "万元"))}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-[#232D39]"
                    >
                      {loanUnit}
                    </button>
                  </div>
                </NativeFormRow>

                <NativeFormRow label="授信金额">
                  <div className="flex items-center justify-end gap-1.5">
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      placeholder="请输入授信金额"
                      className="w-28 bg-transparent text-right text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCreditUnit((u) => (u === "万元" ? "元" : "万元"))}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-[#232D39]"
                    >
                      {creditUnit}
                    </button>
                  </div>
                </NativeFormRow>

                <NativeFormRow label="贷款/授信期数">
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <input
                      type="number"
                      value={loanPeriods}
                      onChange={(e) => setLoanPeriods(e.target.value)}
                      placeholder="贷款期数"
                      className="w-16 bg-transparent text-right outline-none"
                    />
                    <span className="text-slate-300">/</span>
                    <input
                      type="number"
                      value={creditPeriods}
                      onChange={(e) => setCreditPeriods(e.target.value)}
                      placeholder="授信期数"
                      className="w-16 bg-transparent text-right outline-none"
                    />
                    <span className="text-[#64748B]">期</span>
                  </div>
                </NativeFormRow>
              </NativeInfoCard>

              {/* 权人信息 */}
              <NativeInfoCard title={`${holderLabel}信息`}>
                <NativeFormRow label={`${holderLabel}类型`} required>
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    企业（只读）
                  </span>
                </NativeFormRow>
                <NativeFormRow label={holderLabel} required>
                  <select
                    value={selectedHolder?.id ?? ""}
                    onChange={(e) => {
                      const found = HOLDER_OPTIONS.find((h) => h.id === e.target.value) ?? null
                      setSelectedHolder(found)
                    }}
                    className="w-full bg-transparent text-right text-xs text-[#232D39] outline-none"
                  >
                    <option value="">请选择（{holderDomain}）</option>
                    {filteredHolders.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </NativeFormRow>
                {selectedHolder ? (
                  <NativeFormRow label="权人证件号">
                    <span className="text-xs text-[#64748B]">{selectedHolder.identifier}</span>
                  </NativeFormRow>
                ) : null}
                <NativeFormRow label="合同编号">
                  <input
                    value={contractNo}
                    onChange={(e) => setContractNo(e.target.value)}
                    placeholder="选填，最多50字"
                    className="w-full bg-transparent text-right text-xs outline-none"
                  />
                </NativeFormRow>
                <NativeFormRow label="备注">
                  <input
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="选填，最多500字"
                    className="w-full bg-transparent text-right text-xs outline-none"
                  />
                </NativeFormRow>
                <NativeFormRow label="货物类型" required>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCargoType("INVENTORY")}
                      className={`rounded-full px-3 py-1 text-xs ${
                        cargoType === "INVENTORY"
                          ? "bg-[#1875F0] text-white"
                          : "bg-slate-100 text-[#64748B]"
                      }`}
                    >
                      存货
                    </button>
                    <button
                      type="button"
                      onClick={() => setCargoType("RECEIPT")}
                      className={`rounded-full px-3 py-1 text-xs ${
                        cargoType === "RECEIPT"
                          ? "bg-[#1875F0] text-white"
                          : "bg-slate-100 text-[#64748B]"
                      }`}
                    >
                      仓单
                    </button>
                  </div>
                </NativeFormRow>
              </NativeInfoCard>
            </div>
          ) : cargoType === "INVENTORY" ? (
            /* Step 2 存货模式（四级手风琴展示） */
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-[#232D39]">货物明细（存货）</span>
                <button
                  type="button"
                  onClick={() => navigate("/m/inbound/initiate")}
                  className="text-xs font-medium text-amber-600"
                >
                  没有我想选的? 去入库货物
                </button>
              </div>

              {selectedSkus.length === 0 ? (
                <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                  <p className="text-xs text-[#64748B]">暂未选择在库货物</p>
                  <button
                    type="button"
                    onClick={() => setPickingStage("SELECT_SKU")}
                    className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#1875F0] px-4 py-2 text-xs font-medium text-white"
                  >
                    <Plus className="size-3.5" />
                    添加货物
                  </button>
                </div>
              ) : (
                <>
                  {selectedSkus.map((sku) => {
                    const expanded = Boolean(expandedDetailSku[sku.skuId])
                    return (
                      <div key={sku.skuId} className="rounded-xl bg-white p-3.5 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-[#232D39]">{sku.skuName}</div>
                            <div className="mt-1 text-xs text-[#64748B]">
                              数量：{sku.totalQty}
                              {sku.unit} · {sku.warehouse}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const next = { ...lotAllocations }
                                for (const l of sku.lots) delete next[l.slotId]
                                setLotAllocations(next)
                              }}
                              className="text-rose-500"
                            >
                              <Trash2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedDetailSku((p) => ({ ...p, [sku.skuId]: !expanded }))
                              }
                              className="text-xs text-[#1875F0]"
                            >
                              {expanded ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {expanded ? (
                          <div className="mt-3 space-y-2 border-t border-slate-100 pt-2.5">
                            {sku.lots.map((lot) => (
                              <div
                                key={lot.slotId}
                                className="rounded-lg bg-slate-50 p-2.5 text-xs text-[#64748B]"
                              >
                                <div className="flex items-center justify-between text-[#232D39]">
                                  <span className="font-medium">
                                    {lot.storeroom} - {lot.zone}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">
                                    存货中
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center justify-between text-[11px]">
                                  <span>{lot.inboundTime}</span>
                                  <span className="inline-flex items-center gap-0.5 text-[#1875F0]">
                                    <QrCode className="size-3" /> 条码
                                  </span>
                                </div>
                                <div className="mt-1 text-[11px]">{lot.batchInfo}</div>
                                <div className="mt-1 font-medium text-[#232D39]">
                                  分配数量：{lot.qty}
                                  {sku.unit}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}

                  <div className="rounded-xl bg-amber-50/70 p-3 text-xs text-[#232D39]">
                    <div className="flex items-center justify-between">
                      <span>
                        货品类型：<strong>{selectedSkus.length}</strong> · 总价值：
                        <strong className="text-[#1875F0]">
                          {(totalInventoryValue / 10000).toFixed(2)}万元
                        </strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setPickingStage("SELECT_SKU")}
                        className="rounded-md border border-amber-400 bg-white px-2.5 py-1 text-[11px] font-medium text-amber-700"
                      >
                        重新编辑货物
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Step 2 仓单模式（整单打包 + 同保管人横幅 + 人脸签章） */
            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-rose-700">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <span>
                  重要提示：选择的所有电子仓单保管人必须为同一企业或个人，否则将会导致流程中保管人签章错误！
                </span>
              </div>

              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-[#232D39]">电子仓单列表（整单打包）</span>
                <button
                  type="button"
                  onClick={() => navigate("/m/receipts/initiate")}
                  className="text-xs font-medium text-amber-600"
                >
                  没有我想选的? 去开立仓单
                </button>
              </div>

              {H5_RECEIPT_CATALOG.map((rec) => {
                const checked = selectedReceiptIds.includes(rec.id)
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => handleToggleReceipt(rec)}
                    className={`w-full rounded-xl border p-3.5 text-left shadow-sm transition-colors ${
                      checked ? "border-[#1875F0] bg-blue-50/40" : "border-transparent bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex size-4 items-center justify-center rounded-full border ${
                            checked
                              ? "border-[#1875F0] bg-[#1875F0] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {checked ? <Check className="size-3" /> : null}
                        </span>
                        <span className="text-sm font-semibold text-[#232D39]">{rec.receiptNo}</span>
                      </div>
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#1875F0]">
                        {rec.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-[#64748B]">
                      <div>持有人：{rec.holderName}</div>
                      <div>保管人：{rec.custodianName}</div>
                      <div>开立时间：{rec.issuedAt}</div>
                    </div>
                    <div className="mt-2 rounded-lg bg-slate-50 p-2 text-[11px] text-[#232D39]">
                      {rec.goodsSummary.map((g) => (
                        <div key={g}>• {g}</div>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          {step === 0 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full rounded-lg bg-[#1875F0] py-2.5 text-sm font-medium text-white"
            >
              下一步
            </button>
          ) : (
            <>
              {cargoType === "INVENTORY" ? (
                <button
                  type="button"
                  onClick={() => showToast("现场条码扫码选货为二期硬件规划功能")}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-[#64748B]"
                  title="扫码选货（二期规划）"
                >
                  <ScanLine className="size-4" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 rounded-lg border border-amber-400 bg-white py-2.5 text-xs font-medium text-amber-700"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={
                  cargoType === "INVENTORY"
                    ? selectedSkus.length === 0
                    : selectedReceiptIds.length === 0
                }
                className="flex-1 rounded-lg bg-[#1875F0] py-2.5 text-xs font-medium text-white disabled:bg-slate-300"
              >
                {cargoType === "RECEIPT" ? "提交审核" : "提交"}
              </button>
            </>
          )}
        </div>

        {/* C02 不同保管人阻断弹窗 */}
        {custodianConflictOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-600">
                <AlertTriangle className="size-4" />
                保管人冲突，无法完成统一电子签章
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
                您勾选的多张电子仓单属于不同保管人，严禁合并在同一笔监管办理单据中提交。请取消勾选其他保管人的仓单后重试。
              </p>
              <button
                type="button"
                onClick={() => setCustodianConflictOpen(false)}
                className="mt-4 w-full rounded-lg bg-[#1875F0] py-2 text-xs font-medium text-white"
              >
                我知道了
              </button>
            </div>
          </div>
        ) : null}

        {/* R09/P02 仓单活体人脸识别弹窗 */}
        {faceVerifyOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-xl">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50 text-[#1875F0]">
                {faceVerifying ? <ShieldCheck className="size-7 animate-pulse" /> : <Camera className="size-7" />}
              </div>
              <div className="mt-3 text-sm font-semibold text-[#232D39]">
                法定代表人公安活体人脸识别
              </div>
              <p className="mt-1.5 text-xs text-[#64748B]">
                数字仓单抵质押提审前须完成法定代表人实名活体核验并加盖 CA 电子印章。
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={faceVerifying}
                  onClick={() => setFaceVerifyOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-xs text-[#64748B]"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={faceVerifying}
                  onClick={handleConfirmFaceAuth}
                  className="flex-1 rounded-lg bg-[#1875F0] py-2 text-xs font-medium text-white"
                >
                  {faceVerifying ? "活体比对中..." : "开始人脸核验"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {toast ? (
          <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#232D39] px-4 py-2 text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </MobileShell>
    </PrototypeAnnotationTarget>
  )
}

