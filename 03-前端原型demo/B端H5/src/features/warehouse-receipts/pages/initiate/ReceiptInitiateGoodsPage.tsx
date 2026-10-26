import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Check,
  CheckCircle2,
  PackageOpen,
  Plus,
  QrCode,
  ScanLine,
  Trash2,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { IssuanceCandidate } from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import { formatReceiptQuantity } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { FaceSignatureSheet } from "../../components/FaceSignatureSheet"
import { ReceiptQrBox } from "../../components/ReceiptQrBox"
import { ReceiptSheet } from "../../components/ReceiptSheet"
import { ReceiptStepBar } from "../../components/ReceiptStepBar"
import {
  RECEIPT_H5_DETAIL_ROUTE,
  RECEIPT_H5_INITIATE_ROUTE,
  RECEIPT_H5_LIST_ROUTE,
  RECEIPT_MAX_GOODS,
} from "../../domain/constants"
import {
  buildReceiptFromDraft,
  persistCreatedReceipt,
} from "../../lib/created-receipts"
import {
  clearReceiptDraft,
  generateReceiptCode,
  loadReceiptDraft,
  saveReceiptDraft,
  type ReceiptDeductMode,
  type ReceiptInitiateDraft,
} from "../../lib/receipt-initiate-session"
import {
  buildFifoGoodsLines,
  buildFifoPlan,
  candidateGoodsKey,
  fifoPlanTotal,
} from "../../lib/receipt-fifo"
import { mobileIssuanceCandidates } from "../../mock/warehouse-receipts.mock"
import { cn } from "@/lib/utils"

const INBOUND_INITIATE_ROUTE = "/m/inbound/initiate"

type PickerSnapshot = ReceiptInitiateDraft

export function ReceiptInitiateGoodsPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(loadReceiptDraft)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSnapshot, setPickerSnapshot] = useState<PickerSnapshot | null>(null)
  const [pickerWarehouse, setPickerWarehouse] = useState(draft.warehouseName)
  const [category, setCategory] = useState("全部")
  const [qrTarget, setQrTarget] = useState<IssuanceCandidate | null>(null)
  const [signOpen, setSignOpen] = useState(false)
  const [success, setSuccess] = useState<{ id: string; code: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  /** 该货主名下全部在库库存（跨仓库），用于去掉仓库列后仍能选货 */
  const ownerCandidates = useMemo(
    () => mobileIssuanceCandidates.filter((item) => item.ownerId === draft.ownerId),
    [draft.ownerId],
  )

  const warehouses = useMemo(
    () => [...new Set(ownerCandidates.map((item) => item.warehouseName))],
    [ownerCandidates],
  )

  /** 一张仓单只允许一个仓库：已有货物时锁定仓库 */
  const lockedWarehouse = draft.warehouseName || ""
  const effectiveWarehouse = lockedWarehouse || pickerWarehouse || warehouses[0] || ""

  const pickerCandidates = useMemo(
    () =>
      ownerCandidates.filter(
        (item) => item.warehouseName === effectiveWarehouse,
      ),
    [ownerCandidates, effectiveWarehouse],
  )

  const categories = useMemo(
    () => ["全部", ...new Set(pickerCandidates.map((item) => item.category))],
    [pickerCandidates],
  )

  const visibleCandidates = useMemo(
    () =>
      category === "全部"
        ? pickerCandidates
        : pickerCandidates.filter((item) => item.category === category),
    [pickerCandidates, category],
  )

  const goodsLines = useMemo(
    () => buildFifoGoodsLines(pickerCandidates),
    [pickerCandidates],
  )
  const visibleGoodsLines = useMemo(
    () =>
      category === "全部"
        ? goodsLines
        : goodsLines.filter((line) => line.category === category),
    [goodsLines, category],
  )

  const fifoLine = useMemo(() => {
    const stored = visibleGoodsLines.find((line) => line.key === draft.fifoGoodsKey)
    if (stored) return stored
    return visibleGoodsLines.length === 1 ? visibleGoodsLines[0] : undefined
  }, [visibleGoodsLines, draft.fifoGoodsKey])

  const fifoTotalText =
    draft.fifoTotal || (fifoLine ? String(fifoLine.totalAvailable) : "")
  const fifoTotalNumber = Number(fifoTotalText)
  const fifoExceeds = Boolean(
    fifoLine && fifoTotalNumber > fifoLine.totalAvailable + 1e-9,
  )
  const fifoPlan = useMemo(
    () =>
      draft.deductMode === "FIFO" && fifoLine
        ? buildFifoPlan(pickerCandidates, fifoLine.key, fifoTotalNumber)
        : [],
    [draft.deductMode, fifoLine, pickerCandidates, fifoTotalNumber],
  )
  const fifoTotalSelected = fifoPlanTotal(fifoPlan)

  const customSelected = pickerCandidates.filter((item) =>
    draft.selectedCandidateIds.includes(item.id),
  )

  /** 已添加货物：按货品规格 + 单位汇总展示 */
  const addedGoods = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string
        name: string
        unit: string
        quantity: number
        lots: Array<{ candidate: IssuanceCandidate; quantity: number }>
      }
    >()

    for (const candidate of ownerCandidates) {
      if (!draft.selectedCandidateIds.includes(candidate.id)) continue
      const key = `${candidate.goodsName}|${candidate.unit}`
      const quantity = Number(
        draft.allocations[candidate.id] ?? candidate.remainQuantity,
      )
      const existing = map.get(key)
      if (existing) {
        existing.quantity = Number((existing.quantity + quantity).toFixed(4))
        existing.lots.push({ candidate, quantity })
        continue
      }
      map.set(key, {
        key,
        name: candidate.goodsName,
        unit: candidate.unit,
        quantity,
        lots: [{ candidate, quantity }],
      })
    }

    return [...map.values()]
  }, [ownerCandidates, draft.selectedCandidateIds, draft.allocations])

  const patch = (value: Partial<ReceiptInitiateDraft>) =>
    setDraft((prev) => ({ ...prev, ...value }))

  const openPicker = () => {
    if (!draft.ownerId) {
      showToast("请先选择货主")
      return
    }
    setPickerSnapshot(draft)
    setPickerWarehouse(draft.warehouseName || warehouses[0] || "")
    setCategory("全部")
    setPickerOpen(true)
  }

  const closePicker = () => {
    if (pickerSnapshot) setDraft(pickerSnapshot)
    setPickerOpen(false)
  }

  const pickWarehouse = (warehouse: string) => {
    if (warehouse === effectiveWarehouse) return
    if (lockedWarehouse && warehouse !== lockedWarehouse) {
      showToast("一张仓单只能选择一个仓库，请先移除已添加货物")
      return
    }
    setPickerWarehouse(warehouse)
    patch({
      warehouseName: "",
      deductMode: "FIFO",
      fifoGoodsKey: "",
      fifoTotal: "",
      selectedCandidateIds: [],
      allocations: {},
    })
  }

  const changePickerCategory = (next: string) => {
    setCategory(next)
    if (draft.deductMode === "FIFO") {
      patch({ fifoGoodsKey: "", fifoTotal: "" })
    }
  }

  const switchMode = (mode: ReceiptDeductMode) => {
    if (mode === draft.deductMode) return
    const firstLine = visibleGoodsLines[0]
    patch({
      deductMode: mode,
      selectedCandidateIds: [],
      allocations: {},
      ...(mode === "FIFO" && firstLine && visibleGoodsLines.length === 1
        ? {
            fifoGoodsKey: firstLine.key,
            fifoTotal: String(firstLine.totalAvailable),
          }
        : {}),
    })
  }

  const pickFifoLine = (key: string) => {
    const line = goodsLines.find((item) => item.key === key)
    patch({
      fifoGoodsKey: key,
      fifoTotal: line ? String(line.totalAvailable) : "",
      selectedCandidateIds: [],
      allocations: {},
    })
  }

  const toggleCandidate = (id: string) => {
    setDraft((prev) => {
      const exists = prev.selectedCandidateIds.includes(id)
      if (!exists && prev.selectedCandidateIds.length >= RECEIPT_MAX_GOODS) {
        showToast(`仓单开立最大允许 ${RECEIPT_MAX_GOODS} 组货物`)
        return prev
      }
      const candidate = pickerCandidates.find((item) => item.id === id)
      return {
        ...prev,
        selectedCandidateIds: exists
          ? prev.selectedCandidateIds.filter((item) => item !== id)
          : [...prev.selectedCandidateIds, id],
        allocations: exists
          ? Object.fromEntries(
              Object.entries(prev.allocations).filter(([key]) => key !== id),
            )
          : {
              ...prev.allocations,
              [id]: prev.allocations[id] ?? String(candidate?.remainQuantity ?? ""),
            },
      }
    })
  }

  const setAllocation = (id: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      allocations: { ...prev.allocations, [id]: value },
    }))
  }

  const allocationOf = (candidate: IssuanceCandidate) =>
    draft.allocations[candidate.id] ?? String(candidate.remainQuantity)

  const confirmPicker = () => {
    if (!effectiveWarehouse) {
      showToast("请选择仓库")
      return
    }
    if (draft.deductMode === "FIFO") {
      if (!fifoLine) {
        showToast("请选择开立货品")
        return
      }
      if (!fifoTotalNumber || fifoTotalNumber <= 0) {
        showToast("请输入大于 0 的总开立数量")
        return
      }
      if (fifoExceeds) {
        showToast(
          `总开立数量不得超过 ${formatReceiptQuantity(fifoLine.totalAvailable)}${fifoLine.unit}`,
        )
        return
      }
      if (fifoPlan.length === 0) {
        showToast("没有可圈选的批次")
        return
      }
      // 先入先出只替换当前货品规格，已添加的其他货品保留
      const keptIds = draft.selectedCandidateIds.filter((id) => {
        const candidate = ownerCandidates.find((item) => item.id === id)
        return candidate
          ? candidateGoodsKey(candidate) !== fifoLine.key
          : false
      })
      const planIds = fifoPlan.map((item) => item.candidate.id)
      const next: ReceiptInitiateDraft = {
        ...draft,
        warehouseName: effectiveWarehouse,
        fifoGoodsKey: fifoLine.key,
        fifoTotal: fifoTotalText,
        selectedCandidateIds: [...keptIds, ...planIds],
        allocations: {
          ...Object.fromEntries(
            Object.entries(draft.allocations).filter(([id]) =>
              keptIds.includes(id),
            ),
          ),
          ...Object.fromEntries(
            fifoPlan.map((item) => [item.candidate.id, String(item.quantity)]),
          ),
        },
      }
      setDraft(next)
      saveReceiptDraft(next)
      setPickerOpen(false)
      return
    }

    if (draft.selectedCandidateIds.length === 0) {
      showToast("请至少勾选一组在库货物")
      return
    }
    for (const candidate of customSelected) {
      const quantity = Number(
        draft.allocations[candidate.id] ?? candidate.remainQuantity,
      )
      if (!quantity || quantity <= 0 || quantity > candidate.remainQuantity) {
        showToast("开立数量须大于 0 且不超过该批次可用数量")
        return
      }
    }
    const next = { ...draft, warehouseName: effectiveWarehouse }
    setDraft(next)
    saveReceiptDraft(next)
    setPickerOpen(false)
  }

  const scanFromPage = () => {
    if (ownerCandidates.length === 0) {
      showToast("该货主暂无可开立的在库库存")
      return
    }
    const preferred =
      ownerCandidates.find(
        (item) =>
          item.warehouseName === effectiveWarehouse &&
          !draft.selectedCandidateIds.includes(item.id),
      ) ??
      ownerCandidates.find(
        (item) => !draft.selectedCandidateIds.includes(item.id),
      )
    if (!preferred) {
      showToast("没有更多可选的在库批次")
      return
    }
    if (lockedWarehouse && preferred.warehouseName !== lockedWarehouse) {
      showToast("一张仓单只能选择一个仓库，请先移除已添加货物")
      return
    }
    const next = {
      ...draft,
      warehouseName: preferred.warehouseName,
      deductMode: "CUSTOM" as const,
      selectedCandidateIds: [...draft.selectedCandidateIds, preferred.id],
      allocations: {
        ...draft.allocations,
        [preferred.id]:
          draft.allocations[preferred.id] ?? String(preferred.remainQuantity),
      },
    }
    setDraft(next)
    saveReceiptDraft(next)
    showToast(`扫码识别成功：${preferred.goodsName}（已加入仓单）`)
  }

  const removeGoodsGroup = (key: string) => {
    const ids = new Set(
      addedGoods
        .find((item) => item.key === key)
        ?.lots.map((lot) => lot.candidate.id) ?? [],
    )
    const selectedCandidateIds = draft.selectedCandidateIds.filter(
      (id) => !ids.has(id),
    )
    const allocations = Object.fromEntries(
      Object.entries(draft.allocations).filter(([id]) => !ids.has(id)),
    )
    const empty = selectedCandidateIds.length === 0
    const next: ReceiptInitiateDraft = {
      ...draft,
      selectedCandidateIds,
      allocations,
      ...(empty
        ? {
            warehouseName: "",
            deductMode: "FIFO" as const,
            fifoGoodsKey: "",
            fifoTotal: "",
          }
        : {}),
    }
    setDraft(next)
    saveReceiptDraft(next)
  }

  const submit = () => {
    if (addedGoods.length === 0) {
      showToast("请先添加货物")
      return
    }
    if (!draft.warehouseName) {
      showToast("请选择开立仓库")
      return
    }
    setSignOpen(true)
  }

  const finishSign = () => {
    setSignOpen(false)
    const code = generateReceiptCode()
    const receipt = buildReceiptFromDraft(draft, mobileIssuanceCandidates, code)
    persistCreatedReceipt(receipt)
    clearReceiptDraft()
    setSuccess({ id: receipt.id, code: receipt.code })
  }

  const goBack = () => {
    saveReceiptDraft(draft)
    navigate(RECEIPT_H5_INITIATE_ROUTE, { replace: true })
  }

  if (success) {
    return (
      <MobileShell>
        <NavBar title="仓单开立" backTo={RECEIPT_H5_LIST_ROUTE} />
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#FBF3E3] to-[#F2F3F7] px-6 pb-16">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#FBF0D9]">
            <CheckCircle2 className="size-9 text-[#E0A23C]" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-[#232D39]">
            仓单开立成功
          </h2>
          <p className="mt-1 text-center text-xs leading-relaxed text-[#232D39]/55">
            实名双因子签署已完成，仓单已固化防伪哈希并存证归档
          </p>

          <div className="mt-4 w-full rounded-xl border border-[#232D39]/10 bg-white px-4 py-3 text-center">
            <p className="text-[11px] text-[#232D39]/45">数字仓单编号</p>
            <p className="mt-1 text-sm font-bold text-[#232D39]">{success.code}</p>
          </div>

          <div className="mt-5 w-full space-y-2">
            <button
              type="button"
              onClick={() => navigate(RECEIPT_H5_DETAIL_ROUTE(success.id))}
              className="h-11 w-full rounded-lg bg-[#E0A23C] text-sm font-medium text-white active:bg-[#CE8F2C]"
            >
              查看仓单详情
            </button>
            <button
              type="button"
              onClick={() => navigate(RECEIPT_H5_LIST_ROUTE)}
              className="h-11 w-full rounded-lg border border-[#232D39]/20 bg-white text-sm font-medium text-[#232D39] active:bg-gray-50"
            >
              返回仓单管理
            </button>
          </div>
        </div>
      </MobileShell>
    )
  }

  if (!draft.ownerId) {
    return (
      <MobileShell>
        <NavBar title="仓单开立" backTo={RECEIPT_H5_LIST_ROUTE} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[#edf2f8] px-8 pb-20 text-center">
          <p className="text-sm font-medium text-[#232D39]">开立信息已失效</p>
          <p className="text-xs leading-relaxed text-[#232D39]/50">
            请先选择货主，再添加要开立的在库货物
          </p>
          <button
            type="button"
            onClick={() => navigate(RECEIPT_H5_INITIATE_ROUTE, { replace: true })}
            className="mt-2 rounded-lg bg-[#E0A23C] px-5 py-2.5 text-sm font-medium text-white active:bg-[#CE8F2C]"
          >
            返回上一步
          </button>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#FBF3E3] via-[#FDF9F0] to-[#F2F3F7]">
        <PrototypeAnnotationTarget annotationIds={["receipt-h5-initiate-page"]}>
          <NavBar title="仓单开立" onBack={goBack} />
        </PrototypeAnnotationTarget>

        <div className="shrink-0 px-4">
          <ReceiptStepBar current={1} theme="gold" />
        </div>

        <PrototypeAnnotationTarget
          annotationIds={["receipt-h5-initiate-goods"]}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-[#232D39]">货物明细</h2>
              <div className="flex items-center gap-1 text-xs text-[#232D39]/45">
                <span>没有我想选的？</span>
                <button
                  type="button"
                  onClick={() => navigate(INBOUND_INITIATE_ROUTE)}
                  className="font-medium text-[#C98A1E]"
                >
                  去入库货物
                </button>
              </div>
            </div>

            {pickerOpen ? (
              <PickerContent
                draft={draft}
                warehouses={warehouses}
                effectiveWarehouse={effectiveWarehouse}
                lockedWarehouse={lockedWarehouse}
                categories={categories}
                category={category}
                visibleCandidates={visibleCandidates}
                visibleGoodsLines={visibleGoodsLines}
                fifoLine={fifoLine}
                fifoTotalText={fifoTotalText}
                fifoExceeds={fifoExceeds}
                fifoPlan={fifoPlan}
                fifoTotalSelected={fifoTotalSelected}
                allocationOf={allocationOf}
                onPickWarehouse={pickWarehouse}
                onChangeCategory={changePickerCategory}
                onSwitchMode={switchMode}
                onPickFifoLine={pickFifoLine}
                onSetFifoTotal={(value) =>
                  patch({ fifoTotal: value.replace(/[^\d.]/g, "") })
                }
                onToggleCandidate={toggleCandidate}
                onSetAllocation={setAllocation}
                onOpenQr={setQrTarget}
              />
            ) : addedGoods.length === 0 ? (
              <div className="flex flex-col items-center pt-16 text-center">
                <div className="relative mb-4 flex size-32 items-center justify-center rounded-full bg-white/70 shadow-xs">
                  <div className="absolute inset-4 rounded-full bg-white/80" />
                  <PackageOpen className="relative size-16 text-[#C9CEDA]" />
                </div>
                <p className="text-sm text-[#232D39]/45">暂未添加货物</p>
                <button
                  type="button"
                  onClick={openPicker}
                  className="mt-5 inline-flex items-center gap-1 rounded-md bg-[#E0A23C] px-5 py-2 text-sm font-medium text-white active:bg-[#CE8F2C]"
                >
                  <Plus className="size-4" />
                  添加货物
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-xs shadow-xs">
                  <span className="text-[#232D39]/55">
                    开立仓库：
                    <span className="font-medium text-[#232D39]">
                      {draft.warehouseName}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={openPicker}
                    className="font-medium text-[#C98A1E]"
                  >
                    添加/编辑
                  </button>
                </div>

                {addedGoods.map((group) => (
                  <section
                    key={group.key}
                    className="rounded-xl bg-white p-3.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#232D39]">
                          {group.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#232D39]/45">
                          {group.lots.length} 个批次 · 仓库 {draft.warehouseName}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-[#232D39]">
                        {formatReceiptQuantity(group.quantity)}
                        {group.unit}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 rounded-lg bg-[#232D39]/4 px-3 py-2 text-[11px] text-[#232D39]/55">
                      {group.lots.map((lot) => (
                        <div
                          key={lot.candidate.id}
                          className="flex items-start justify-between gap-2"
                        >
                          <span className="min-w-0 truncate">
                            {lot.candidate.houseName}-{lot.candidate.zoneName}-
                            {lot.candidate.position || "--"}
                          </span>
                          <span className="shrink-0 text-[#232D39]">
                            {formatReceiptQuantity(lot.quantity)}
                            {lot.candidate.unit}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeGoodsGroup(group.key)}
                        className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#232D39]/45 active:text-rose-500"
                      >
                        <Trash2 className="size-3" />
                        移除
                      </button>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </PrototypeAnnotationTarget>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(35,45,57,0.06)]">
          {pickerOpen ? (
            <>
              <button
                type="button"
                onClick={closePicker}
                className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#E0A23C] text-sm font-medium text-[#C98A1E] active:bg-[#FBF4E6]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmPicker}
                className="flex h-11 flex-[1.3] items-center justify-center rounded-lg bg-[#E0A23C] text-sm font-medium text-white active:bg-[#CE8F2C]"
              >
                确认添加
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={scanFromPage}
                aria-label="扫码添加货物"
                className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#E0A23C] text-[#C98A1E] active:bg-[#FBF4E6]"
              >
                <ScanLine className="size-5" />
              </button>
              <button
                type="button"
                onClick={goBack}
                className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#E0A23C] text-sm font-medium text-[#C98A1E] active:bg-[#FBF4E6]"
              >
                上一步
              </button>
              <button
                type="button"
                disabled={addedGoods.length === 0}
                onClick={submit}
                className={cn(
                  "flex h-11 flex-[1.3] items-center justify-center rounded-lg text-sm font-medium text-white",
                  addedGoods.length === 0
                    ? "bg-[#D9D9D9]"
                    : "bg-[#E0A23C] active:bg-[#CE8F2C]",
                )}
              >
                提交
              </button>
            </>
          )}
        </div>

        <ReceiptSheet
          open={Boolean(qrTarget)}
          title="货物二维码"
          description="现场扫码可快速定位该批货物"
          onClose={() => setQrTarget(null)}
        >
          {qrTarget ? (
            <div className="flex flex-col items-center">
              <ReceiptQrBox value={qrTarget.qrcodeId} size={150} />
              <p className="mt-2 text-sm font-semibold text-[#232D39]">
                {qrTarget.qrcodeId}
              </p>
              <div className="mt-3 w-full space-y-1.5 rounded-lg bg-[#232D39]/5 px-3 py-2.5 text-xs text-[#232D39]/65">
                <p>货品：{qrTarget.goodsName}</p>
                <p>
                  位置：{qrTarget.warehouseName}-{qrTarget.houseName}-
                  {qrTarget.zoneName}-{qrTarget.position || "--"}
                </p>
                <p>
                  可用数量：{formatReceiptQuantity(qrTarget.remainQuantity)}
                  {qrTarget.unit}
                </p>
              </div>
            </div>
          ) : null}
        </ReceiptSheet>

        <FaceSignatureSheet
          open={signOpen}
          title="仓单开立 · 电子签章"
          description="开立仓单属于货权处置行为，须由货主本人或企业法定代表人/授权经办人完成实名双因子认证。"
          agreementLabel="本人已阅读并同意《电子仓单法律协议》，并对本次开立信息的真实性负责"
          confirmLabel="提交申请"
          theme="gold"
          annotationIds={[
            "receipt-h5-initiate-confirm",
            "receipt-h5-initiate-sign",
          ]}
          onClose={() => setSignOpen(false)}
          onConfirm={finishSign}
        />

        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-center text-xs text-white">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}

/* ------------------------------------------------------------------ */
/* 添加货物：仓库 + 先入先出 / 自定义                                    */
/* ------------------------------------------------------------------ */

type PickerContentProps = {
  draft: ReceiptInitiateDraft
  warehouses: string[]
  effectiveWarehouse: string
  lockedWarehouse: string
  categories: string[]
  category: string
  visibleCandidates: IssuanceCandidate[]
  visibleGoodsLines: ReturnType<typeof buildFifoGoodsLines>
  fifoLine: ReturnType<typeof buildFifoGoodsLines>[number] | undefined
  fifoTotalText: string
  fifoExceeds: boolean
  fifoPlan: ReturnType<typeof buildFifoPlan>
  fifoTotalSelected: number
  allocationOf: (candidate: IssuanceCandidate) => string
  onPickWarehouse: (warehouse: string) => void
  onChangeCategory: (category: string) => void
  onSwitchMode: (mode: ReceiptDeductMode) => void
  onPickFifoLine: (key: string) => void
  onSetFifoTotal: (value: string) => void
  onToggleCandidate: (id: string) => void
  onSetAllocation: (id: string, value: string) => void
  onOpenQr: (candidate: IssuanceCandidate) => void
}

function PickerContent({
  draft,
  warehouses,
  effectiveWarehouse,
  lockedWarehouse,
  categories,
  category,
  visibleCandidates,
  visibleGoodsLines,
  fifoLine,
  fifoTotalText,
  fifoExceeds,
  fifoPlan,
  fifoTotalSelected,
  allocationOf,
  onPickWarehouse,
  onChangeCategory,
  onSwitchMode,
  onPickFifoLine,
  onSetFifoTotal,
  onToggleCandidate,
  onSetAllocation,
  onOpenQr,
}: PickerContentProps) {
  return (
    <div className="space-y-2.5">
      <section className="rounded-xl bg-white p-3.5 shadow-xs">
        <h3 className="text-sm font-semibold text-[#232D39]">开立仓库</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {warehouses.map((warehouse) => {
            const active = warehouse === effectiveWarehouse
            return (
              <button
                key={warehouse}
                type="button"
                onClick={() => onPickWarehouse(warehouse)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium",
                  active
                    ? "bg-[#FBF0D9] text-[#C98A1E] ring-1 ring-[#EFD9AE]"
                    : "bg-[#232D39]/5 text-[#232D39]/55",
                )}
              >
                {warehouse}
              </button>
            )
          })}
        </div>
        {lockedWarehouse ? (
          <p className="mt-2 text-[11px] text-[#232D39]/40">
            本仓单已锁定 {lockedWarehouse}，如需换仓请先移除已添加货物
          </p>
        ) : null}
      </section>

      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChangeCategory(item)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium",
              category === item
                ? "bg-[#FBF0D9] text-[#C98A1E] ring-1 ring-[#EFD9AE]"
                : "bg-white text-[#232D39]/55",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex rounded-xl bg-white p-1 shadow-xs">
        {(
          [
            ["FIFO", "先入先出"],
            ["CUSTOM", "自定义"],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSwitchMode(mode)}
            className={cn(
              "flex-1 rounded-lg py-2 text-xs font-medium transition-colors",
              draft.deductMode === mode
                ? "bg-[#FBF0D9] text-[#C98A1E] ring-1 ring-[#EFD9AE]"
                : "text-[#232D39]/55",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {draft.deductMode === "FIFO" ? (
        <>
          <section className="rounded-xl bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#232D39]">开立货品</h3>
              <span className="text-[11px] text-[#232D39]/45">
                {visibleGoodsLines.length} 种规格
              </span>
            </div>

            {visibleGoodsLines.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#232D39]/45">
                当前仓库下没有可开立的在库库存
              </p>
            ) : (
              <div className="mt-2.5 space-y-2">
                {visibleGoodsLines.map((line) => {
                  const active = fifoLine?.key === line.key
                  return (
                    <button
                      key={line.key}
                      type="button"
                      onClick={() => onPickFifoLine(line.key)}
                      className={cn(
                        "flex w-full items-start justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        active
                          ? "border-[#E6C98F] bg-[#FBF4E6]"
                          : "border-[#232D39]/8 bg-white active:bg-[#232D39]/4",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium text-[#232D39]">
                          {line.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#232D39]/50">
                          可开立 {formatReceiptQuantity(line.totalAvailable)}
                          {line.unit} · {line.batchCount} 个批次
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#232D39]/40">
                          最早入库 {line.earliestInboundAt}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                          active
                            ? "border-[#E0A23C] bg-[#E0A23C] text-white"
                            : "border-[#232D39]/25",
                        )}
                      >
                        {active ? <Check className="size-2.5" /> : null}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {fifoLine ? (
            <>
              <section className="rounded-xl bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#232D39]">
                    总开立数量
                  </h3>
                  <button
                    type="button"
                    onClick={() => onSetFifoTotal(String(fifoLine.totalAvailable))}
                    className="rounded-full bg-[#FBF4E6] px-2.5 py-1 text-[11px] font-medium text-[#C98A1E] active:bg-[#F7EAD1]"
                  >
                    全部开立
                  </button>
                </div>

                <div
                  className={cn(
                    "mt-2.5 flex items-center gap-2 rounded-lg px-3 py-2.5",
                    fifoExceeds ? "bg-rose-50" : "bg-[#232D39]/4",
                  )}
                >
                  <input
                    inputMode="decimal"
                    value={fifoTotalText}
                    onChange={(event) => onSetFifoTotal(event.target.value)}
                    placeholder="请输入总开立数量"
                    className={cn(
                      "min-w-0 flex-1 bg-transparent text-right text-base font-semibold outline-none",
                      fifoExceeds ? "text-rose-600" : "text-[#232D39]",
                    )}
                  />
                  <span className="shrink-0 text-xs text-[#232D39]/55">
                    {fifoLine.unit}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-[#232D39]/45">
                    可开立总量 {formatReceiptQuantity(fifoLine.totalAvailable)}
                    {fifoLine.unit}
                  </span>
                  {fifoExceeds ? (
                    <span className="font-medium text-rose-600">
                      超出可开立总量
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-[#232D39]/45">
                  系统按入库时间从早到晚自动圈选批次，最后一批不足时按部分数量开立。
                </p>
              </section>

              <section className="rounded-xl bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#232D39]">
                    圈选结果
                  </h3>
                  <span className="text-[11px] text-[#232D39]/45">
                    {fifoPlan.length} 个批次 · 合计{" "}
                    {formatReceiptQuantity(fifoTotalSelected)}
                    {fifoLine.unit}
                  </span>
                </div>

                {fifoPlan.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#232D39]/40">
                    请输入大于 0 的总开立数量
                  </p>
                ) : (
                  <div className="mt-2.5 space-y-2">
                    {fifoPlan.map((item, index) => {
                      const partial =
                        item.quantity < item.candidate.remainQuantity
                      return (
                        <div
                          key={item.candidate.id}
                          className="rounded-lg bg-[#232D39]/4 px-3 py-2.5 text-[11px]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="min-w-0 text-[#232D39]">
                              <span className="mr-1 text-[#232D39]/40">
                                {index + 1}.
                              </span>
                              {item.candidate.warehouseName}-
                              {item.candidate.houseName}-
                              {item.candidate.zoneName}-
                              {item.candidate.position || "--"}
                            </span>
                            <span className="shrink-0 font-semibold text-[#232D39]">
                              {formatReceiptQuantity(item.quantity)}
                              {item.candidate.unit}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[#232D39]/45">
                            <span>入库 {item.candidate.inboundAt}</span>
                            <span>
                              批内可用{" "}
                              {formatReceiptQuantity(
                                item.candidate.remainQuantity,
                              )}
                              {item.candidate.unit}
                            </span>
                          </div>
                          {partial ? (
                            <span className="mt-1 inline-flex rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                              部分开立
                            </span>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-[#232D39]/15 bg-white/60 px-4 py-8 text-center text-xs text-[#232D39]/45">
              请先选择开立货品，再录入总开立数量
            </div>
          )}
        </>
      ) : visibleCandidates.length === 0 ? (
        <div className="rounded-xl bg-white py-14 text-center text-xs text-[#232D39]/45">
          当前仓库下没有可开立的在库库存
        </div>
      ) : (
        visibleCandidates.map((candidate) => {
          const active = draft.selectedCandidateIds.includes(candidate.id)
          return (
            <div
              key={candidate.id}
              className={cn(
                "relative rounded-xl border bg-white shadow-xs transition-colors",
                active ? "border-[#E6C98F] bg-[#FBF4E6]" : "border-[#232D39]/10",
              )}
            >
              <button
                type="button"
                onClick={() => onToggleCandidate(candidate.id)}
                className="w-full p-3 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 pr-6">
                    <p className="truncate text-sm font-medium text-[#232D39]">
                      {candidate.goodsName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                      {candidate.warehouseName}-{candidate.houseName}(
                      {candidate.houseAudit})-{candidate.zoneName}-
                      {candidate.position || "--"}
                    </p>
                  </div>
                  <span className="shrink-0 pr-7 text-sm font-semibold text-[#232D39]">
                    {formatReceiptQuantity(candidate.remainQuantity)}
                    {candidate.unit}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-[#232D39]/45">
                  入库时间：{candidate.inboundAt}
                </div>
              </button>

              <div className="flex items-center justify-between px-3 pb-2 text-[11px]">
                <span className="text-[#232D39]/40">
                  可用 {formatReceiptQuantity(candidate.remainQuantity)}
                  {candidate.unit}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenQr(candidate)}
                  className="inline-flex items-center gap-0.5 font-medium text-[#C98A1E]"
                >
                  <QrCode className="size-3.5" />
                  查看二维码
                </button>
              </div>

              {active ? (
                <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-xs">
                  <span className="shrink-0 text-[11px] text-[#232D39]/55">
                    本次开立数量
                  </span>
                  <input
                    inputMode="decimal"
                    value={allocationOf(candidate)}
                    onChange={(event) =>
                      onSetAllocation(
                        candidate.id,
                        event.target.value.replace(/[^\d.]/g, ""),
                      )
                    }
                    className="min-w-0 flex-1 bg-transparent text-right text-sm font-medium text-[#232D39] outline-none"
                  />
                  <span className="shrink-0 text-[11px] text-[#232D39]/55">
                    {candidate.unit}
                  </span>
                </div>
              ) : null}

              <span
                className={cn(
                  "absolute right-0 top-0 flex size-7 items-center justify-center rounded-bl-lg rounded-tr-xl",
                  active
                    ? "bg-[#E0A23C] text-white"
                    : "bg-[#232D39]/5 text-[#232D39]/25",
                )}
              >
                <Check className="size-4" />
              </span>
            </div>
          )
        })
      )}

      <p className="px-1 text-[11px] text-[#232D39]/40">
        {draft.deductMode === "FIFO"
          ? `已圈选 ${fifoPlan.length} 组 · 合计 ${formatReceiptQuantity(fifoTotalSelected)}${
              fifoLine?.unit ?? ""
            }`
          : `已选 ${draft.selectedCandidateIds.length} 组`}
      </p>
    </div>
  )
}
