import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Check,
  PackageOpen,
  Plus,
  QrCode,
  Trash2,
  Warehouse,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { IssuanceCandidate } from "@prototype/shared/warehouse-receipts/warehouse-receipt-seed"
import { formatReceiptQuantity } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { ReceiptQrBox } from "../../components/ReceiptQrBox"
import { ReceiptSheet } from "../../components/ReceiptSheet"
import { ReceiptStepBar } from "../../components/ReceiptStepBar"
import {
  RECEIPT_H5_INITIATE_CONFIRM_ROUTE,
  RECEIPT_H5_INITIATE_ROUTE,
} from "../../domain/constants"
import {
  loadReceiptDraft,
  saveReceiptDraft,
  type ReceiptInitiateDraft,
} from "../../lib/receipt-initiate-session"
import {
  buildFifoGoodsLines,
  buildFifoPlan,
  fifoPlanTotal,
} from "../../lib/receipt-fifo"
import { mobileIssuanceCandidates } from "../../mock/warehouse-receipts.mock"
import { cn } from "@/lib/utils"

const INITIATE_STEPS = ["货主主体", "圈选货品", "协议与认证", "完成凭证"] as const

type PickerSnapshot = ReceiptInitiateDraft

export function ReceiptInitiateGoodsPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(loadReceiptDraft)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSnapshot, setPickerSnapshot] = useState<PickerSnapshot | null>(null)
  const [pickerWarehouse, setPickerWarehouse] = useState(draft.warehouseName || "生鲜仓库")
  const [qrTarget, setQrTarget] = useState<IssuanceCandidate | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const patch = (value: Partial<typeof draft>) =>
    setDraft((prev) => ({ ...prev, ...value }))

  const ownerCandidates = useMemo(
    () =>
      mobileIssuanceCandidates.filter((item) => item.ownerId === draft.ownerId),
    [draft.ownerId],
  )

  const warehouseOptions = useMemo(
    () => Array.from(new Set(ownerCandidates.map((item) => item.warehouseName))),
    [ownerCandidates],
  )

  const effectiveWarehouse = pickerWarehouse || warehouseOptions[0] || "生鲜仓库"

  const activeCandidates = useMemo(
    () =>
      ownerCandidates.filter(
        (item) => item.warehouseName === (draft.warehouseName || effectiveWarehouse),
      ),
    [ownerCandidates, draft.warehouseName, effectiveWarehouse],
  )

  const fifoLine = useMemo(
    () =>
      buildFifoGoodsLines(activeCandidates).find(
        (line) => line.key === draft.fifoGoodsKey,
      ),
    [activeCandidates, draft.fifoGoodsKey],
  )

  const fifoPlan = useMemo(
    () =>
      buildFifoPlan(
        activeCandidates,
        draft.fifoGoodsKey,
        Number(draft.fifoTotal) || 0,
      ),
    [activeCandidates, draft.fifoGoodsKey, draft.fifoTotal],
  )

  const fifoTotalSelected = useMemo(
    () => fifoPlanTotal(fifoPlan),
    [fifoPlan],
  )

  const customSelectedCandidates = useMemo(
    () =>
      activeCandidates.filter((item) =>
        draft.selectedCandidateIds.includes(item.id),
      ),
    [activeCandidates, draft.selectedCandidateIds],
  )

  const openPicker = () => {
    const initialWarehouse = draft.warehouseName || warehouseOptions[0] || "生鲜仓库"
    setPickerWarehouse(initialWarehouse)
    setPickerSnapshot(JSON.parse(JSON.stringify(draft)))
    setPickerOpen(true)
  }

  const cancelPicker = () => {
    if (pickerSnapshot) setDraft(pickerSnapshot)
    setPickerOpen(false)
  }

  const confirmPicker = () => {
    if (draft.deductMode === "FIFO") {
      if (!draft.fifoGoodsKey) {
        showToast("请选择一种货物")
        return
      }
      const num = Number(draft.fifoTotal)
      if (!num || num <= 0) {
        showToast("请输入大于 0 的拟开立总数量")
        return
      }
      if (fifoLine && num > fifoLine.totalAvailable) {
        showToast(`开立数量不可大于当前可用库存总和 (${fifoLine.totalAvailable})`)
        return
      }
    } else {
      if (draft.selectedCandidateIds.length === 0) {
        showToast("请至少勾选一个在库垛位批次")
        return
      }
      for (const id of draft.selectedCandidateIds) {
        const candidate = activeCandidates.find((item) => item.id === id)
        const val = Number(draft.allocations[id] ?? candidate?.remainQuantity ?? 0)
        if (!val || val <= 0) {
          showToast(`已选货品【${candidate?.goodsName}】的开立数量必须大于 0`)
          return
        }
        if (candidate && val > candidate.remainQuantity) {
          showToast(`垛位【${candidate.zoneName}】开立数量不能大于在库可用量`)
          return
        }
      }
    }

    patch({ warehouseName: effectiveWarehouse })
    setPickerOpen(false)
  }

  const toggleCandidate = (candidate: IssuanceCandidate) => {
    setDraft((prev) => {
      const exists = prev.selectedCandidateIds.includes(candidate.id)
      const nextIds = exists
        ? prev.selectedCandidateIds.filter((item) => item !== candidate.id)
        : [...prev.selectedCandidateIds, candidate.id]
      const nextAlloc = { ...prev.allocations }
      if (!exists && nextAlloc[candidate.id] === undefined) {
        nextAlloc[candidate.id] = String(candidate.remainQuantity)
      }
      if (exists) {
        delete nextAlloc[candidate.id]
      }
      return {
        ...prev,
        selectedCandidateIds: nextIds,
        allocations: nextAlloc,
      }
    })
  }

  const setCandidateAllocation = (candidateId: string, value: string) => {
    patch({
      allocations: {
        ...draft.allocations,
        [candidateId]: value,
      },
    })
  }

  const removeCustomCandidate = (candidateId: string) => {
    patch({
      selectedCandidateIds: draft.selectedCandidateIds.filter(
        (id) => id !== candidateId,
      ),
      allocations: Object.fromEntries(
        Object.entries(draft.allocations).filter(([k]) => k !== candidateId),
      ),
    })
  }

  const candidateCount =
    draft.deductMode === "FIFO"
      ? fifoPlan.length
      : draft.selectedCandidateIds.length

  const goNextToConfirm = () => {
    if (candidateCount === 0) {
      showToast("请先圈选拟开立的在库货物")
      return
    }
    saveReceiptDraft(draft)
    navigate(RECEIPT_H5_INITIATE_CONFIRM_ROUTE)
  }

  // 快速一键推荐圈选（对齐经典蓝体系）
  const handleQuickAutoFill = () => {
    const lines = buildFifoGoodsLines(activeCandidates)
    if (lines.length > 0) {
      const firstLine = lines[0]
      const targetQty = String(firstLine.totalAvailable)
      patch({
        warehouseName: effectiveWarehouse,
        deductMode: "FIFO",
        fifoGoodsKey: firstLine.key,
        fifoTotal: targetQty,
      })
      showToast(`已按先进先出 (FIFO) 自动圈选 ${firstLine.name} 共 ${targetQty} ${firstLine.unit}`)
    } else {
      showToast("当前仓库暂无可用库存")
    }
  }

  return (
    <MobileShell>
      {/* 统一为全站标准底色 bg-[#edf2f8] */}
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        {/* 顶部导航 */}
        <PrototypeAnnotationTarget annotationIds={["receipt-initiate-page"]}>
          <NavBar title="仓单开立" backTo={RECEIPT_H5_INITIATE_ROUTE} />
        </PrototypeAnnotationTarget>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
          {/* 4 步步骤条：当前第 2 步，对齐经典蓝 theme="blue" */}
          <ReceiptStepBar current={1} steps={INITIATE_STEPS} theme="blue" />

          <PrototypeAnnotationTarget annotationIds={["receipt-initiate-goods"]}>
            <section className="rounded-lg border border-[#232D39]/8 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#232D39]/6 pb-3">
                <span className="text-sm font-semibold text-[#232D39]">
                  {draft.ownerName || "未指定货主"}
                </span>
                <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                  已圈选 {candidateCount} 组货位
                </span>
              </div>

              {draft.warehouseName ? (
                <div className="mt-3 flex items-center justify-between text-xs text-[#232D39]/65">
                  <span className="flex items-center gap-1">
                    <Warehouse className="size-3.5 text-blue-600" />
                    开立仓库：{draft.warehouseName}
                  </span>
                  <span className="text-[11px] text-[#232D39]/45">
                    扣减模式：{draft.deductMode === "FIFO" ? "先进先出" : "自定义垛位"}
                  </span>
                </div>
              ) : null}

              {candidateCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-inner mb-3">
                    <PackageOpen className="size-7" />
                  </div>
                  <p className="text-sm font-semibold text-[#232D39]">
                    暂未圈选任何货物
                  </p>
                  <p className="mt-1 text-xs text-[#232D39]/45">
                    从在库合规库存中圈选大类、品类、规格与垛位批次
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={openPicker}
                      className="flex items-center gap-1.5 rounded-xl border border-blue-600 bg-white px-4 py-2.5 text-xs font-semibold text-blue-600 shadow-2xs active:bg-blue-50"
                    >
                      <Plus className="size-4" />
                      手动圈选货物
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickAutoFill}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs active:bg-blue-700"
                    >
                      一键快速配平 (FIFO)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-2.5">
                  {draft.deductMode === "FIFO" ? (
                    <div className="space-y-2">
                      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-[#232D39]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-950">{fifoLine?.name}</span>
                          <span className="font-semibold text-blue-600">
                            合计 {formatReceiptQuantity(fifoTotalSelected)} {fifoLine?.unit}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-[#232D39]/50">
                          按入库时间由先到后自动匹配扣减，共占用 {fifoPlan.length} 笔入库批次
                        </p>
                      </div>

                      <div className="divide-y divide-[#232D39]/6 rounded-xl border border-[#232D39]/8 bg-white">
                        {fifoPlan.map((item, index) => (
                          <div
                            key={item.candidate.id}
                            className="flex items-center justify-between p-3 text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-medium text-[#232D39] truncate">
                                {index + 1}. {item.candidate.warehouseName}-
                                {item.candidate.houseName}({item.candidate.houseAudit})-
                                {item.candidate.zoneName}-{item.candidate.position || "--"}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#232D39]/45">
                                <span>入库时间：{item.candidate.inboundAt}</span>
                                <button
                                  type="button"
                                  onClick={() => setQrTarget(item.candidate)}
                                  className="inline-flex items-center gap-0.5 text-blue-600 active:underline"
                                >
                                  <QrCode className="size-3" />
                                  查看二维码
                                </button>
                              </div>
                            </div>
                            <span className="shrink-0 font-semibold text-[#232D39]">
                              {formatReceiptQuantity(item.quantity)}{" "}
                              {item.candidate.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#232D39]/6 rounded-xl border border-[#232D39]/8 bg-white">
                      {customSelectedCandidates.map((cand, index) => (
                        <div
                          key={cand.id}
                          className="flex items-start justify-between p-3 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-semibold text-[#232D39] truncate">
                              {index + 1}. {cand.goodsName}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                              {cand.warehouseName}-{cand.houseName}({cand.houseAudit})-
                              {cand.zoneName}-{cand.position || "--"}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-[#232D39]/45">
                              <span>
                                可用 {formatReceiptQuantity(cand.remainQuantity)} {cand.unit} · 本次开立：
                                <span className="font-semibold text-blue-600">
                                  {draft.allocations[cand.id] ?? cand.remainQuantity} {cand.unit}
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setQrTarget(cand)}
                                className="inline-flex items-center gap-0.5 text-blue-600 active:underline"
                              >
                                <QrCode className="size-3" />
                                码
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomCandidate(cand.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                            aria-label="删除该货位"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={openPicker}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 active:bg-blue-100"
                    >
                      重新调整圈选
                    </button>
                  </div>
                </div>
              )}
            </section>
          </PrototypeAnnotationTarget>
        </div>

        {/* 底部吸底主按钮：统一经典蓝 blue-600 */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(35,45,57,0.06)]">
          <button
            type="button"
            disabled={candidateCount === 0}
            onClick={goNextToConfirm}
            className={cn(
              "flex h-11 w-full items-center justify-center rounded-lg text-base font-semibold text-white shadow-md transition-all",
              candidateCount > 0
                ? "bg-blue-600 active:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed",
            )}
          >
            下一步：确认并签章
          </button>
        </div>

        {/* 货品圈选 Sheet 弹窗：对齐经典蓝 */}
        <ReceiptSheet
          open={pickerOpen}
          title="圈选可开立货物"
          description={`仅显示【${draft.ownerName}】名下合规入库可用库存`}
          onClose={cancelPicker}
          footer={
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelPicker}
                className="flex h-11 flex-1 items-center justify-center rounded-xl border border-gray-200 text-sm font-medium text-gray-600 active:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmPicker}
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-xs active:bg-blue-700"
              >
                确认已选
              </button>
            </div>
          }
        >
          <div className="space-y-3 pb-3">
            {/* 仓库选择 */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600">所属仓库</span>
              <div className="flex gap-1.5">
                {warehouseOptions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      setPickerWarehouse(w)
                      patch({
                        warehouseName: w,
                        selectedCandidateIds: [],
                        allocations: {},
                      })
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold",
                      effectiveWarehouse === w
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* 扣减模式切换 */}
            <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => patch({ deductMode: "FIFO" })}
                className={cn(
                  "flex-1 py-1.5 rounded-lg transition-all",
                  draft.deductMode === "FIFO"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-gray-500",
                )}
              >
                先进先出 (FIFO) 自动配平
              </button>
              <button
                type="button"
                onClick={() => patch({ deductMode: "CUSTOM" })}
                className={cn(
                  "flex-1 py-1.5 rounded-lg transition-all",
                  draft.deductMode === "CUSTOM"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-gray-500",
                )}
              >
                自定义精准垛位勾选
              </button>
            </div>

            {/* 自定义勾选列表或 FIFO 选择 */}
            {draft.deductMode === "FIFO" ? (
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-gray-700">
                    选择货品品类
                  </span>
                  <div className="space-y-2">
                    {buildFifoGoodsLines(activeCandidates).map((line) => {
                      const active = draft.fifoGoodsKey === line.key
                      return (
                        <div
                          key={line.key}
                          onClick={() => patch({ fifoGoodsKey: line.key })}
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-3 text-xs transition-all cursor-pointer",
                            active
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-gray-200 bg-white",
                          )}
                        >
                          <div>
                            <p className="font-semibold text-slate-800">
                              {line.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-500">
                              在库可用总量：{formatReceiptQuantity(line.totalAvailable)}{" "}
                              {line.unit} · {line.batchCount} 笔入库
                            </p>
                          </div>
                          <span
                            className={cn(
                              "flex size-5 items-center justify-center rounded-full border",
                              active
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-300",
                            )}
                          >
                            {active ? <Check className="size-3" /> : null}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {draft.fifoGoodsKey ? (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700">拟开立数量</span>
                      <span className="text-gray-400">单位：{fifoLine?.unit}</span>
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={draft.fifoTotal}
                      onChange={(e) =>
                        patch({ fifoTotal: e.target.value.replace(/[^\d.]/g, "") })
                      }
                      placeholder={`请输入开立数量 (最大 ${fifoLine?.totalAvailable})`}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-2 pt-1 max-h-80 overflow-y-auto">
                {activeCandidates.map((candidate) => {
                  const isSelected = draft.selectedCandidateIds.includes(candidate.id)
                  return (
                    <div
                      key={candidate.id}
                      className={cn(
                        "rounded-xl border p-3 text-xs transition-all",
                        isSelected
                          ? "border-blue-500 bg-blue-50/40"
                          : "border-gray-200 bg-white",
                      )}
                    >
                      <div
                        onClick={() => toggleCandidate(candidate)}
                        className="flex items-start justify-between cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {candidate.goodsName}
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-500">
                            {candidate.houseName}-{candidate.zoneName}-
                            {candidate.position || "--"}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                            <span>入库时间：{candidate.inboundAt}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setQrTarget(candidate)
                              }}
                              className="text-blue-600 underline"
                            >
                              查看二维码
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {formatReceiptQuantity(candidate.remainQuantity)}{" "}
                            {candidate.unit}
                          </span>
                          <span
                            className={cn(
                              "flex size-5 items-center justify-center rounded-md border",
                              isSelected
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-300",
                            )}
                          >
                            {isSelected ? <Check className="size-3" /> : null}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="mt-2.5 flex items-center gap-2 border-t border-gray-100 pt-2">
                          <span className="shrink-0 text-gray-500">本次开立:</span>
                          <input
                            inputMode="decimal"
                            value={draft.allocations[candidate.id] ?? candidate.remainQuantity}
                            onChange={(e) =>
                              setCandidateAllocation(
                                candidate.id,
                                e.target.value.replace(/[^\d.]/g, ""),
                              )
                            }
                            className="min-w-0 flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-right font-semibold text-slate-800 outline-none focus:border-blue-500"
                          />
                          <span className="shrink-0 text-gray-500">
                            {candidate.unit}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </ReceiptSheet>

        {/* 二维码展示弹窗：受控打开，页面底部不再有任何裸露二维码 */}
        <ReceiptSheet
          open={Boolean(qrTarget)}
          title={`物位核验二维码 · ${qrTarget?.goodsName || ""}`}
          description={`${qrTarget?.warehouseName}-${qrTarget?.zoneName}-${qrTarget?.position || "--"}`}
          onClose={() => setQrTarget(null)}
          footer={
            <button
              type="button"
              onClick={() => setQrTarget(null)}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white active:bg-blue-700"
            >
              关闭
            </button>
          }
        >
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ReceiptQrBox
              value={`WRL-GOODS:${qrTarget?.id || ""}`}
              size={180}
              className="shadow-sm border border-gray-200"
            />
            <p className="mt-3 text-xs font-semibold text-[#232D39]">
              现场物联扫码核验二维码
            </p>
            <p className="mt-1 text-[11px] text-[#232D39]/50">
              条码标识: {qrTarget?.qrcodeId || qrTarget?.id}
            </p>
          </div>
        </ReceiptSheet>

        {/* Toast */}
        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-center text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
