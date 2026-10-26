import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronRight,
  UserRound,
  Users,
  Warehouse,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { ReceiptSelectSheet } from "../../components/ReceiptSheet"
import { ReceiptStepBar } from "../../components/ReceiptStepBar"
import {
  RECEIPT_H5_INITIATE_GOODS_ROUTE,
  RECEIPT_H5_LIST_ROUTE,
} from "../../domain/constants"
import {
  loadReceiptDraft,
  saveReceiptDraft,
} from "../../lib/receipt-initiate-session"
import {
  mobileIssuanceCandidates,
  RECEIPT_OWNER_OPTIONS,
} from "../../mock/warehouse-receipts.mock"
import { cn } from "@/lib/utils"

const GOLD_BUTTON =
  "flex h-12 w-full items-center justify-center rounded-lg bg-[#E0A23C] text-base font-medium text-white active:bg-[#CE8F2C]"

export function ReceiptInitiateOwnerPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(loadReceiptDraft)
  const [ownerSheetOpen, setOwnerSheetOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const ownerOptions = useMemo(
    () =>
      RECEIPT_OWNER_OPTIONS.filter((owner) => owner.type === draft.ownerType),
    [draft.ownerType],
  )

  const switchOwnerType = (type: "ENTERPRISE" | "PERSON") => {
    if (type === draft.ownerType) return
    setDraft((prev) => ({
      ...prev,
      ownerType: type,
      ownerId: "",
      ownerName: "",
      ownerIdentifier: "",
      idCardNo: "",
      warehouseName: "",
      deductMode: "FIFO",
      fifoGoodsKey: "",
      fifoTotal: "",
      selectedCandidateIds: [],
      allocations: {},
      handledBy: "",
      handledMobile: "",
      handledByNo: "",
    }))
  }

  const pickOwner = (ownerId: string) => {
    const owner = RECEIPT_OWNER_OPTIONS.find((item) => item.id === ownerId)
    if (!owner) return
    setDraft((prev) => ({
      ...prev,
      ownerId: owner.id,
      ownerType: owner.type,
      ownerName: owner.name,
      ownerIdentifier: owner.identifier,
      idCardNo: owner.idCardNo,
      warehouseName: "",
      deductMode: "FIFO",
      fifoGoodsKey: "",
      fifoTotal: "",
      selectedCandidateIds: [],
      allocations: {},
    }))
  }

  const patch = (value: Partial<typeof draft>) =>
    setDraft((prev) => ({ ...prev, ...value }))

  const goNext = () => {
    if (!draft.ownerId) {
      showToast("请选择货主")
      return
    }
    if (draft.ownerType === "ENTERPRISE") {
      if (!draft.handledBy.trim()) {
        showToast("请输入经办人姓名")
        return
      }
      if (!/^1\d{10}$/.test(draft.handledMobile)) {
        showToast("请输入正确的 11 位经办人手机号")
        return
      }
      if (!/^\d{17}[\dXx]$/.test(draft.handledByNo)) {
        showToast("请输入正确的 18 位经办人身份证号")
        return
      }
    }
    saveReceiptDraft(draft)
    navigate(RECEIPT_H5_INITIATE_GOODS_ROUTE)
  }

  const candidateWarehouses = mobileIssuanceCandidates.filter(
    (item) => item.ownerId === draft.ownerId,
  )

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#FBF3E3] via-[#FDF9F0] to-[#F2F3F7]">
        <PrototypeAnnotationTarget annotationIds={["receipt-h5-initiate-page"]}>
          <NavBar title="仓单开立" backTo={RECEIPT_H5_LIST_ROUTE} />
        </PrototypeAnnotationTarget>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
          <ReceiptStepBar current={0} theme="gold" />

          <PrototypeAnnotationTarget annotationIds={["receipt-h5-initiate-owner"]}>
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#232D39]">
                <UserRound className="size-5 text-[#E0A23C]" />
                货主信息
              </h3>

              <div className="mt-3 divide-y divide-[#232D39]/6">
                <div className="flex items-center justify-between gap-3 py-3">
                  <FieldLabel>货主类型</FieldLabel>
                  <div className="flex gap-2">
                    {(
                      [
                        ["ENTERPRISE", "企业"],
                        ["PERSON", "个人"],
                      ] as const
                    ).map(([value, label]) => {
                      const active = draft.ownerType === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => switchOwnerType(value)}
                          className={cn(
                            "min-w-[68px] rounded-md px-4 py-1.5 text-sm",
                            active
                              ? "bg-[#FBF0D9] font-medium text-[#C98A1E] ring-1 ring-[#EFD9AE]"
                              : "bg-[#F2F3F5] text-[#232D39]/55",
                          )}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOwnerSheetOpen(true)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left"
                >
                  <FieldLabel>货主名称</FieldLabel>
                  <span className="flex min-w-0 items-center gap-1">
                    <span
                      className={cn(
                        "truncate text-sm",
                        draft.ownerName
                          ? "font-medium text-[#232D39]"
                          : "text-[#232D39]/30",
                      )}
                    >
                      {draft.ownerName || "请选择货主"}
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-[#232D39]/30" />
                  </span>
                </button>

                <ReadonlyRow
                  label="货主标识"
                  value={draft.ownerIdentifier || "--"}
                />

                {draft.ownerType === "PERSON" ? (
                  <ReadonlyRow
                    label="身份证号"
                    value={draft.idCardNo || "--"}
                  />
                ) : null}
              </div>
            </section>

            {draft.ownerType === "ENTERPRISE" ? (
              <section className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#232D39]">
                  <Users className="size-5 text-[#E0A23C]" />
                  经办人信息
                </h3>
                <div className="mt-3 divide-y divide-[#232D39]/6">
                  <InputRow
                    label="经办人姓名"
                    value={draft.handledBy}
                    placeholder="请填写"
                    onChange={(value) => patch({ handledBy: value })}
                  />
                  <InputRow
                    label="经办人手机号"
                    value={draft.handledMobile}
                    placeholder="请输入 11 位手机号"
                    maxLength={11}
                    inputMode="numeric"
                    onChange={(value) =>
                      patch({ handledMobile: value.replace(/\D/g, "") })
                    }
                  />
                  <InputRow
                    label="经办人身份证号"
                    value={draft.handledByNo}
                    placeholder="请输入 18 位身份证号"
                    maxLength={18}
                    onChange={(value) =>
                      patch({ handledByNo: value.replace(/\s/g, "") })
                    }
                  />
                </div>
              </section>
            ) : null}

            {draft.ownerId && candidateWarehouses.length > 0 ? (
              <p className="mt-3 flex items-center gap-1 px-1 text-[11px] text-[#232D39]/45">
                <Warehouse className="size-3.5" />
                该货主在 {new Set(candidateWarehouses.map((item) => item.warehouseName)).size}{" "}
                个仓库有可开立的在库库存，下一步选择货品
              </p>
            ) : null}
          </PrototypeAnnotationTarget>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(35,45,57,0.06)]">
          <button type="button" onClick={goNext} className={GOLD_BUTTON}>
            下一步
          </button>
        </div>

        <ReceiptSelectSheet
          open={ownerSheetOpen}
          title={`选择${draft.ownerType === "ENTERPRISE" ? "企业" : "个人"}货主`}
          description="货主标识由档案自动带出"
          options={ownerOptions.map((owner) => ({
            id: owner.id,
            label: owner.name,
            description: `货主标识：${owner.identifier}`,
          }))}
          selectedId={draft.ownerId}
          onClose={() => setOwnerSheetOpen(false)}
          onSelect={(option) => pickOwner(option.id)}
          theme="gold"
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 text-sm text-[#232D39]">
      <span className="mr-0.5 text-[#EF3E3E]">*</span>
      {children}
    </span>
  )
}

function ReadonlyRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <FieldLabel>{label}</FieldLabel>
      <span className="min-w-0 truncate text-sm text-[#232D39]">{value}</span>
    </div>
  )
}

function InputRow({
  label,
  value,
  placeholder,
  maxLength,
  inputMode,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  maxLength?: number
  inputMode?: "numeric" | "text"
  onChange: (value: string) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-3">
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-right text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
      />
    </label>
  )
}
