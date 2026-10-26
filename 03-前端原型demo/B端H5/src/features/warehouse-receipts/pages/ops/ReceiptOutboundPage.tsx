import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertTriangle, Camera, Check, ImagePlus, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { formatReceiptQuantity } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { FaceSignatureSheet } from "../../components/FaceSignatureSheet"
import { ReceiptOpsHeader } from "../../components/ReceiptOpsHeader"
import { ReceiptStepBar } from "../../components/ReceiptStepBar"
import { getMobileReceiptById } from "../../mock/warehouse-receipts.mock"
import { backToReceiptDetail, todayDateTimeLocal, toDateTimeText } from "../../lib/ops-utils"
import { cn } from "@/lib/utils"

type Step = 0 | 1
type Mode = "ALL" | "PARTIAL"

const OUTBOUND_BLOCK_TEXT =
  "仓单提货仅支持部分提取，若您需要提取仓单内所有货物，请发起仓单注销流程！"

export function ReceiptOutboundPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const receipt = useMemo(() => getMobileReceiptById(id), [id])

  const flatLots = useMemo(
    () =>
      (receipt?.goodsGroups ?? []).flatMap((group) =>
        group.lots.map((lot) => ({ lot, group })),
      ),
    [receipt],
  )

  const [step, setStep] = useState<Step>(0)
  const [selected, setSelected] = useState<string[]>([])
  const [mode, setMode] = useState<Record<string, Mode>>({})
  const [quantities, setQuantities] = useState<Record<string, string>>({})
  const [blockOpen, setBlockOpen] = useState(false)

  const [pickerType, setPickerType] = useState<"PERSON" | "ENTERPRISE">("PERSON")
  const [pickerName, setPickerName] = useState("")
  const [pickerId, setPickerId] = useState("")
  const [pickerPhone, setPickerPhone] = useState("")
  const [plate, setPlate] = useState("")
  const [outboundAt, setOutboundAt] = useState(todayDateTimeLocal())
  const [remark, setRemark] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [signOpen, setSignOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!receipt) {
    return (
      <MobileShell>
        <NavBar title="仓单出库" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到该仓单
        </div>
      </MobileShell>
    )
  }

  const toggleLot = (lotId: string) => {
    const exists = selected.includes(lotId)
    if (!exists && selected.length + 1 >= flatLots.length) {
      setBlockOpen(true)
      return
    }
    setSelected((prev) =>
      exists ? prev.filter((item) => item !== lotId) : [...prev, lotId],
    )
    setMode((prev) => ({ ...prev, [lotId]: prev[lotId] ?? "ALL" }))
  }

  const selectAll = () => setBlockOpen(true)

  const goNext = () => {
    if (selected.length === 0) {
      showToast("请至少勾选一组出库货物")
      return
    }
    if (selected.length >= flatLots.length) {
      setBlockOpen(true)
      return
    }
    for (const lotId of selected) {
      if (mode[lotId] === "PARTIAL") {
        const lot = flatLots.find((item) => item.lot.id === lotId)
        const value = Number(quantities[lotId])
        if (!lot || !value || value <= 0 || value > lot.lot.quantity) {
          showToast("部分出库数量须大于 0 且不超过该批次在单数量")
          return
        }
      }
    }
    setStep(1)
  }

  const addPhoto = () => {
    if (photos.length >= 10) {
      showToast("最多上传 10 张现场照片")
      return
    }
    setPhotos((prev) => [...prev, `出库现场照片-${prev.length + 1}.jpg`])
  }

  const submit = () => {
    if (!pickerName.trim() || pickerName.trim().length > 30) {
      showToast("请输入 1~30 个字符的提货人姓名")
      return
    }
    if (pickerType === "PERSON" && !/^\d{17}[\dXx]$/.test(pickerId)) {
      showToast("请输入正确的 18 位提货人身份证号")
      return
    }
    if (!/^1\d{10}$/.test(pickerPhone)) {
      showToast("请输入正确的 11 位提货人电话")
      return
    }
    if (!outboundAt) {
      showToast("请选择出库日期")
      return
    }
    if (photos.length === 0) {
      showToast("请至少上传 1 张现场照片")
      return
    }
    setSignOpen(true)
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget
          annotationIds={["receipt-h5-ops-outbound"]}
          className="flex min-h-0 flex-1 flex-col"
        >
          <NavBar
            title="仓单出库"
            onBack={() => (step === 0 ? navigate(-1) : setStep(0))}
            right={
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-medium text-blue-600"
              >
                全选
              </button>
            }
          />

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-28 pt-3">
            <ReceiptStepBar current={step} steps={["选择货物", "提货信息"]} />
            <ReceiptOpsHeader
              receipt={receipt}
              hint={
                step === 0
                  ? "仓单出库严禁全部提货，必须至少保留一组货物；全部提取请改为发起仓单注销。"
                  : "提交后进入出库审批流，审批通过将联动生成提货单并核减仓单批次数量。"
              }
            />

            {step === 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-xs shadow-xs">
                  <span className="text-[#232D39]/55">
                    已选{" "}
                    <span className="font-semibold text-blue-600">
                      {selected.length}
                    </span>{" "}
                    / {flatLots.length} 组
                  </span>
                  <span className="text-[11px] text-[#232D39]/40">
                    至少保留 1 组
                  </span>
                </div>

                {flatLots.map(({ lot, group }) => {
                  const active = selected.includes(lot.id)
                  const lotMode = mode[lot.id] ?? "ALL"
                  return (
                    <div
                      key={lot.id}
                      className={cn(
                        "rounded-xl border bg-white p-3 shadow-xs transition-colors",
                        active ? "border-blue-300" : "border-[#232D39]/10",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleLot(lot.id)}
                        className="flex w-full items-start justify-between gap-2 text-left"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#232D39]">
                            {group.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                            {lot.warehouseName}-{lot.houseName}({lot.houseAudit})-
                            {lot.zoneName}-{lot.position || "--"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#232D39]/45">
                            入库：{lot.inboundAt} · 条码 {lot.barcode}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="text-sm font-semibold text-[#232D39]">
                            {formatReceiptQuantity(lot.quantity)}
                            {lot.unit}
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
                        </div>
                      </button>

                      {active ? (
                        <div className="mt-2.5 space-y-2 border-t border-[#232D39]/6 pt-2.5">
                          <div className="flex gap-2">
                            {(
                              [
                                ["ALL", "全部出库"],
                                ["PARTIAL", "部分出库"],
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
                                本次出库数量
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
            ) : (
              <div className="space-y-2.5">
                <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
                  <h3 className="text-sm font-semibold text-[#232D39]">提货人信息</h3>

                  <div className="mt-2.5 flex gap-2">
                    {(
                      [
                        ["PERSON", "个人"],
                        ["ENTERPRISE", "企业"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPickerType(value)}
                        className={cn(
                          "rounded-full px-4 py-1.5 text-xs font-medium",
                          pickerType === value
                            ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                            : "bg-[#232D39]/5 text-[#232D39]/55",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2.5 space-y-2">
                    <FormRow label={pickerType === "PERSON" ? "提货人姓名" : "企业名称"}>
                      <input
                        value={pickerName}
                        maxLength={30}
                        onChange={(event) => setPickerName(event.target.value)}
                        placeholder="请填写"
                        className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                      />
                    </FormRow>
                    {pickerType === "PERSON" ? (
                      <FormRow label="身份证号">
                        <input
                          value={pickerId}
                          maxLength={18}
                          onChange={(event) =>
                            setPickerId(event.target.value.replace(/\s/g, ""))
                          }
                          placeholder="请输入 18 位身份证号"
                          className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                        />
                      </FormRow>
                    ) : null}
                    <FormRow label="联系电话">
                      <input
                        value={pickerPhone}
                        maxLength={11}
                        inputMode="numeric"
                        onChange={(event) =>
                          setPickerPhone(event.target.value.replace(/\D/g, ""))
                        }
                        placeholder="请输入 11 位手机号"
                        className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                      />
                    </FormRow>
                    <FormRow label="车牌号">
                      <input
                        value={plate}
                        onChange={(event) => setPlate(event.target.value)}
                        placeholder="选填，如 皖K·88888"
                        className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                      />
                    </FormRow>
                  </div>
                </section>

                <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
                  <h3 className="text-sm font-semibold text-[#232D39]">出库信息</h3>
                  <div className="mt-2.5 space-y-2">
                    <FormRow label="出库日期">
                      <input
                        type="datetime-local"
                        value={outboundAt}
                        max={todayDateTimeLocal()}
                        onChange={(event) => setOutboundAt(event.target.value)}
                        className="bg-transparent text-right text-sm text-[#232D39] outline-none"
                      />
                    </FormRow>

                    <div className="rounded-lg bg-[#232D39]/4 px-3 py-2">
                      <textarea
                        value={remark}
                        maxLength={140}
                        onChange={(event) => setRemark(event.target.value)}
                        placeholder="备注（选填，最多 140 字）"
                        className="min-h-[56px] w-full resize-none bg-transparent text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                      />
                      <p className="text-right text-[11px] text-[#232D39]/30">
                        {remark.length}/140
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#232D39]/55">
                          <span className="mr-0.5 text-[#EF3E3E]">*</span>
                          现场照片（{photos.length}/10）
                        </span>
                        <button
                          type="button"
                          onClick={addPhoto}
                          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600 active:bg-blue-100"
                        >
                          <ImagePlus className="size-3.5" />
                          添加照片
                        </button>
                      </div>
                      {photos.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {photos.map((photo, index) => (
                            <span
                              key={photo}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#232D39]/5 px-2 py-1 text-[11px] text-[#232D39]/65"
                            >
                              <Camera className="size-3" />
                              {photo}
                              <button
                                type="button"
                                onClick={() =>
                                  setPhotos((prev) =>
                                    prev.filter((_, idx) => idx !== index),
                                  )
                                }
                                aria-label="移除照片"
                              >
                                <X className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1.5 text-[11px] text-[#232D39]/35">
                          需上传装车、货位与车牌等现场照片，最多 10 张
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <div className="rounded-xl bg-[#232D39]/4 px-3 py-2.5 text-[11px] leading-relaxed text-[#232D39]/55">
                  将出库 {selected.length} 组货物，提交后进入审批；审批通过自动生成提货单，出库数量
                  {toDateTimeText(outboundAt)} 生效。
                </div>
              </div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 flex gap-2 border-t border-[#232D39]/8 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#232D39]/20 text-sm font-medium text-[#232D39] active:bg-gray-50"
              >
                上一步
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => (step === 0 ? goNext() : submit())}
              className="flex h-11 flex-[1.6] items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
            >
              {step === 0 ? "下一步" : "提交申请"}
            </button>
          </div>
        </PrototypeAnnotationTarget>

        <FaceSignatureSheet
          open={signOpen}
          title="仓单出库 · 电子签章"
          description="出库涉及实物提货与货权核减，须由经办人完成人脸活体识别与短信验证码校验。"
          agreementLabel="本人确认提货信息真实有效，并已核对出库批次与数量"
          onClose={() => setSignOpen(false)}
          onConfirm={() => {
            setSignOpen(false)
            backToReceiptDetail(
              navigate,
              receipt.id,
              "仓单出库申请已提交，等待审批；审批通过后生成提货单",
            )
          }}
        />

        {blockOpen ? (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/45 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
                <p className="text-center text-sm leading-relaxed text-[#232D39]">
                  {OUTBOUND_BLOCK_TEXT}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBlockOpen(false)
                  setSelected([])
                }}
                className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white active:bg-blue-700"
              >
                我知道了
              </button>
            </div>
          </div>
        ) : null}

        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-center text-xs text-white">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}

function FormRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg bg-[#232D39]/4 px-3 py-2.5">
      <span className="shrink-0 text-xs text-[#232D39]/55">{label}</span>
      <span className="min-w-0 flex-1 text-right">{children}</span>
    </label>
  )
}
