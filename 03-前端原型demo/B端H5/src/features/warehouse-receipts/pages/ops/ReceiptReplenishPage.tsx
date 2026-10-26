import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Check, PackagePlus } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { formatReceiptQuantity } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { FaceSignatureSheet } from "../../components/FaceSignatureSheet"
import { ReceiptOpsHeader } from "../../components/ReceiptOpsHeader"
import { getMobileReceiptById, mobileAvailableStock } from "../../mock/warehouse-receipts.mock"
import { backToReceiptDetail } from "../../lib/ops-utils"
import { cn } from "@/lib/utils"

export function ReceiptReplenishPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const receipt = useMemo(() => getMobileReceiptById(id), [id])

  const stock = useMemo(
    () =>
      receipt
        ? mobileAvailableStock.filter(
            (item) =>
              item.ownerName === receipt.owner.name &&
              item.warehouseName === receipt.warehouseName,
          )
        : [],
    [receipt],
  )

  const [selected, setSelected] = useState<string[]>([])
  const [quantities, setQuantities] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      mobileAvailableStock.map((item) => [item.id, String(item.availableQuantity)]),
    ),
  )
  const [remark, setRemark] = useState("")
  const [signOpen, setSignOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!receipt) {
    return (
      <MobileShell>
        <NavBar title="仓单补货" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到该仓单
        </div>
      </MobileShell>
    )
  }

  const toggle = (stockId: string) =>
    setSelected((prev) =>
      prev.includes(stockId)
        ? prev.filter((item) => item !== stockId)
        : [...prev, stockId],
    )

  const submit = () => {
    if (selected.length === 0) {
      showToast("请至少勾选一批同仓可用库存")
      return
    }
    for (const stockId of selected) {
      const lot = stock.find((item) => item.id === stockId)
      const value = Number(quantities[stockId])
      if (!lot || !value || value <= 0 || value > lot.availableQuantity) {
        showToast("补货数量须大于 0 且不超过该批次可用数量")
        return
      }
    }
    setSignOpen(true)
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget
          annotationIds={["receipt-h5-ops-replenish"]}
          className="flex min-h-0 flex-1 flex-col"
        >
          <NavBar title="仓单补货" onBack={() => navigate(-1)} />

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-28 pt-3">
            <ReceiptOpsHeader
              receipt={receipt}
              hint="仅可追加「同一货主 + 同一仓库 + 存货中 + 可用数量大于 0」的未占用普通库存。"
            />

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#232D39]">
                  <PackagePlus className="size-4 text-blue-600" />
                  可选普通库存
                </h3>
                <span className="text-[11px] text-[#232D39]/45">
                  {stock.length} 个批次
                </span>
              </div>

              {stock.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#232D39]/45">
                  当前货主在同一仓库下暂无未占用的可用库存
                </p>
              ) : (
                <div className="mt-2.5 space-y-2">
                  {stock.map((item) => {
                    const active = selected.includes(item.id)
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "rounded-lg border p-3 transition-colors",
                          active ? "border-blue-300 bg-blue-50/40" : "border-[#232D39]/8",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(item.id)}
                          className="flex w-full items-start justify-between gap-2 text-left"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-medium text-[#232D39]">
                              {item.goodsName}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-[#232D39]/50">
                              {item.warehouseName}-{item.houseName}-{item.zoneName}-
                              {item.position || "--"}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-[#232D39]/45">
                              入库：{item.inboundAt} · 条码 {item.barcode}
                            </span>
                          </span>
                          <span className="flex shrink-0 flex-col items-end gap-1.5">
                            <span className="text-xs font-semibold text-[#232D39]">
                              可用 {formatReceiptQuantity(item.availableQuantity)}
                              {item.unit}
                            </span>
                            <span
                              className={cn(
                                "flex size-5 items-center justify-center rounded-full border",
                                active
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-[#232D39]/20",
                              )}
                            >
                              {active ? <Check className="size-3" /> : null}
                            </span>
                          </span>
                        </button>

                        {active ? (
                          <div className="mt-2.5 flex items-center gap-2 border-t border-[#232D39]/8 pt-2.5">
                            <span className="text-[11px] text-[#232D39]/55">
                              本次补货数量
                            </span>
                            <input
                              inputMode="decimal"
                              value={quantities[item.id] ?? ""}
                              onChange={(event) =>
                                setQuantities((prev) => ({
                                  ...prev,
                                  [item.id]: event.target.value,
                                }))
                              }
                              className="min-w-0 flex-1 bg-transparent text-right text-sm text-[#232D39] outline-none"
                            />
                            <span className="text-[11px] text-[#232D39]/55">
                              {item.unit}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
              <h3 className="text-sm font-semibold text-[#232D39]">补货说明</h3>
              <div className="mt-2 rounded-lg bg-[#232D39]/4 px-3 py-2">
                <textarea
                  value={remark}
                  maxLength={140}
                  onChange={(event) => setRemark(event.target.value)}
                  placeholder="补充资产追加原因（选填，最多 140 字）"
                  className="min-h-[56px] w-full resize-none bg-transparent text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                />
                <p className="text-right text-[11px] text-[#232D39]/30">
                  {remark.length}/140
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
              提交补货申请
            </button>
          </div>
        </PrototypeAnnotationTarget>

        <FaceSignatureSheet
          open={signOpen}
          title="仓单补货 · 电子签章"
          description="补货会扩大仓单资产包，须由货主或经办人完成人脸活体识别与短信验证码校验。"
          agreementLabel="本人确认追加库存真实可用，且未在其他业务中被占用"
          onClose={() => setSignOpen(false)}
          onConfirm={() => {
            setSignOpen(false)
            backToReceiptDetail(
              navigate,
              receipt.id,
              "仓单补货申请已提交，等待审批；通过后批次自动并入本仓单",
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
