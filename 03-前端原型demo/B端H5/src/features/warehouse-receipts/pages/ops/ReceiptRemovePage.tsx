import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Check, PackageMinus } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { formatReceiptQuantity } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { FaceSignatureSheet } from "../../components/FaceSignatureSheet"
import { ReceiptOpsHeader } from "../../components/ReceiptOpsHeader"
import { getMobileReceiptById } from "../../mock/warehouse-receipts.mock"
import { backToReceiptDetail } from "../../lib/ops-utils"
import { cn } from "@/lib/utils"

type Mode = "ALL" | "PARTIAL"

export function ReceiptRemovePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const receipt = useMemo(() => getMobileReceiptById(id), [id])

  const lots = useMemo(
    () =>
      (receipt?.goodsGroups ?? []).flatMap((group) =>
        group.lots.map((lot) => ({ lot, group })),
      ),
    [receipt],
  )

  const [selected, setSelected] = useState<string[]>([])
  const [mode, setMode] = useState<Record<string, Mode>>({})
  const [quantities, setQuantities] = useState<Record<string, string>>({})
  const [reason, setReason] = useState("")
  const [signOpen, setSignOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!receipt) {
    return (
      <MobileShell>
        <NavBar title="仓单移除" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到该仓单
        </div>
      </MobileShell>
    )
  }

  const toggle = (lotId: string) => {
    setSelected((prev) =>
      prev.includes(lotId)
        ? prev.filter((item) => item !== lotId)
        : [...prev, lotId],
    )
    setMode((prev) => ({ ...prev, [lotId]: prev[lotId] ?? "ALL" }))
  }

  const submit = () => {
    if (selected.length === 0) {
      showToast("请至少勾选一个拟移除批次")
      return
    }
    for (const lotId of selected) {
      if (mode[lotId] === "PARTIAL") {
        const item = lots.find((entry) => entry.lot.id === lotId)
        const value = Number(quantities[lotId])
        if (!item || !value || value <= 0 || value > item.lot.quantity) {
          showToast("部分移除数量须大于 0 且不超过该批次在单数量")
          return
        }
      }
    }
    setSignOpen(true)
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget
          annotationIds={["receipt-h5-ops-remove"]}
          className="flex min-h-0 flex-1 flex-col"
        >
          <NavBar title="仓单移除" onBack={() => navigate(-1)} />

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-28 pt-3">
            <ReceiptOpsHeader
              receipt={receipt}
              hint="仓单移除只解绑仓单关系，货物仍在库并恢复为【存货中】可用库存，不发生实体出库。"
            />

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#232D39]">
                <PackageMinus className="size-4 text-blue-600" />
                拟移除货物批次
              </h3>

              <div className="mt-2.5 space-y-2">
                {lots.map(({ lot, group }) => {
                  const active = selected.includes(lot.id)
                  const lotMode = mode[lot.id] ?? "ALL"
                  return (
                    <div
                      key={lot.id}
                      className={cn(
                        "rounded-lg border p-3 transition-colors",
                        active ? "border-blue-300 bg-blue-50/40" : "border-[#232D39]/8",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(lot.id)}
                        className="flex w-full items-start justify-between gap-2 text-left"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-[#232D39]">
                            {group.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-[#232D39]/50">
                            {lot.warehouseName}-{lot.houseName}-{lot.zoneName}-
                            {lot.position || "--"}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-[#232D39]/45">
                            在单数量：{formatReceiptQuantity(lot.quantity)}
                            {lot.unit}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                            active
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-[#232D39]/20",
                          )}
                        >
                          {active ? <Check className="size-3" /> : null}
                        </span>
                      </button>

                      {active ? (
                        <div className="mt-2.5 space-y-2 border-t border-[#232D39]/8 pt-2.5">
                          <div className="flex gap-2">
                            {(
                              [
                                ["ALL", "整批移除"],
                                ["PARTIAL", "部分数量移除"],
                              ] as const
                            ).map(([value, label]) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() =>
                                  setMode((prev) => ({ ...prev, [lot.id]: value }))
                                }
                                className={cn(
                                  "rounded-full px-3 py-1 text-[11px] font-medium",
                                  lotMode === value
                                    ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                                    : "bg-[#232D39]/5 text-[#232D39]/55",
                                )}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                          {lotMode === "PARTIAL" ? (
                            <div className="flex items-center gap-2 rounded-lg bg-[#232D39]/4 px-3 py-2">
                              <span className="text-[11px] text-[#232D39]/55">
                                本次移除数量
                              </span>
                              <input
                                inputMode="decimal"
                                value={quantities[lot.id] ?? ""}
                                onChange={(event) =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [lot.id]: event.target.value,
                                  }))
                                }
                                placeholder={`不超过 ${formatReceiptQuantity(lot.quantity)}`}
                                className="min-w-0 flex-1 bg-transparent text-right text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                              />
                              <span className="text-[11px] text-[#232D39]/55">
                                {lot.unit}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg bg-[#232D39]/4 px-3 py-2.5 text-xs">
                <span className="text-[#232D39]/55">解绑后状态</span>
                <span className="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                  存货中（普通可用库存）
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-[#232D39]/40">
                移除不改变货物物理位置，也不生成提货单
              </p>
            </section>

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <h3 className="text-sm font-semibold text-[#232D39]">移除原因</h3>
              <div className="mt-2 rounded-lg bg-[#232D39]/4 px-3 py-2">
                <textarea
                  value={reason}
                  maxLength={140}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="补充解绑剔除说明（选填，最多 140 字）"
                  className="min-h-[56px] w-full resize-none bg-transparent text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                />
                <p className="text-right text-[11px] text-[#232D39]/30">
                  {reason.length}/140
                </p>
              </div>
            </section>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 border-t border-[#232D39]/8 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={submit}
              className="h-11 w-full rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
            >
              提交移除申请
            </button>
          </div>
        </PrototypeAnnotationTarget>

        <FaceSignatureSheet
          open={signOpen}
          title="仓单移除 · 电子签章"
          description="移除会减少仓单资产包并释放库存，须由货主或经办人完成人脸活体识别与短信验证码校验。"
          agreementLabel="本人确认移除批次与数量无误，并知晓移除后货物恢复为普通库存"
          onClose={() => setSignOpen(false)}
          onConfirm={() => {
            setSignOpen(false)
            backToReceiptDetail(
              navigate,
              receipt.id,
              "仓单移除申请已提交，等待审批；通过后货物恢复为【存货中】",
            )
          }}
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
