import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
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
} from "../../domain/constants"
import {
  loadReceiptDraft,
  saveReceiptDraft,
} from "../../lib/receipt-initiate-session"
import {
  mobileIssuanceCandidates,
  RECEIPT_OWNER_OPTIONS,
} from "../../mock/warehouse-receipts.mock"

const INITIATE_STEPS = ["货主主体", "圈选货品", "协议与认证", "完成凭证"] as const

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
    const isEnterprise = type === "ENTERPRISE"
    setDraft((prev) => ({
      ...prev,
      ownerType: type,
      ownerId: isEnterprise ? "owner-fuyang" : "owner-yuanyuan",
      ownerName: isEnterprise ? "阜阳市大数据资产运营有限公司" : "张园园",
      ownerIdentifier: isEnterprise ? "91341202MA2U0JHJ3F" : "138****0001",
      idCardNo: isEnterprise ? "" : "341202199001011234",
      warehouseName: "生鲜仓库",
      deductMode: "FIFO",
      fifoGoodsKey: "",
      fifoTotal: "",
      selectedCandidateIds: [],
      allocations: {},
      handledBy: isEnterprise ? "王建国" : "",
      handledMobile: isEnterprise ? "13800138001" : "",
      handledByNo: isEnterprise ? "341202198501011234" : "",
    }))
  }

  const pickOwner = (ownerId: string) => {
    const owner = RECEIPT_OWNER_OPTIONS.find((item) => item.id === ownerId)
    if (!owner) return
    const isEnterprise = owner.type === "ENTERPRISE"
    setDraft((prev) => ({
      ...prev,
      ownerId: owner.id,
      ownerType: owner.type,
      ownerName: owner.name,
      ownerIdentifier: owner.identifier,
      idCardNo: owner.idCardNo,
      warehouseName: "生鲜仓库",
      deductMode: "FIFO",
      fifoGoodsKey: "",
      fifoTotal: "",
      selectedCandidateIds: [],
      allocations: {},
      handledBy: isEnterprise ? (prev.handledBy || (owner.id === "owner-fuyang" ? "王建国" : "李明德")) : "",
      handledMobile: isEnterprise ? (prev.handledMobile || (owner.id === "owner-fuyang" ? "13800138001" : "13912345678")) : "",
      handledByNo: isEnterprise ? (prev.handledByNo || (owner.id === "owner-fuyang" ? "341202198501011234" : "320214198205051234")) : "",
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
      {/* 统一为全站标准底色 bg-[#edf2f8] */}
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        {/* 顶部导航 */}
        <PrototypeAnnotationTarget annotationIds={["receipt-initiate-page"]}>
          <NavBar title="仓单开立" backTo="/m/tasks" />
        </PrototypeAnnotationTarget>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
          {/* 4 步步骤条：对齐经典蓝 theme="blue" */}
          <ReceiptStepBar current={0} steps={INITIATE_STEPS} theme="blue" />

          <PrototypeAnnotationTarget annotationIds={["receipt-initiate-owner"]}>
            <section className="rounded-lg border border-[#232D39]/8 bg-white p-4 shadow-xs">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#232D39]">
                <UserRound className="size-5 text-blue-600" />
                货主主体信息
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
                          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                            active
                              ? "bg-blue-600 text-white shadow-2xs"
                              : "bg-[#232D39]/5 text-[#232D39]/65 active:bg-[#232D39]/10"
                          }`}
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
                  <div className="flex min-w-0 items-center gap-1">
                    <span
                      className={`truncate text-sm ${
                        draft.ownerName
                          ? "font-medium text-[#232D39]"
                          : "text-[#232D39]/30"
                      }`}
                    >
                      {draft.ownerName || "请选择货主"}
                    </span>
                    <span className="text-xs text-blue-600">修改</span>
                  </div>
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
              <section className="mt-3 rounded-lg border border-[#232D39]/8 bg-white p-4 shadow-xs">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#232D39]">
                  <Users className="size-5 text-blue-600" />
                  经办人信息（企业办理人）
                </h3>
                <div className="mt-3 divide-y divide-[#232D39]/6">
                  <InputRow
                    label="经办人姓名"
                    value={draft.handledBy}
                    placeholder="请填写真实姓名"
                    onChange={(value) => patch({ handledBy: value })}
                  />
                  <InputRow
                    label="经办人手机号"
                    value={draft.handledMobile}
                    placeholder="请输入 11 位手机号（接收验证码）"
                    maxLength={11}
                    inputMode="numeric"
                    onChange={(value) =>
                      patch({ handledMobile: value.replace(/\D/g, "") })
                    }
                  />
                  <InputRow
                    label="经办人身份证号"
                    value={draft.handledByNo}
                    placeholder="请输入 18 位二代身份证号码"
                    maxLength={18}
                    onChange={(value) =>
                      patch({ handledByNo: value.replace(/\s/g, "") })
                    }
                  />
                </div>
              </section>
            ) : null}

            {draft.ownerId && candidateWarehouses.length > 0 ? (
              <p className="mt-3 flex items-center gap-1 px-1 text-[11px] text-[#232D39]/50">
                <Warehouse className="size-3.5 text-blue-600" />
                该货主在 {new Set(candidateWarehouses.map((item) => item.warehouseName)).size}{" "}
                个仓库有可开立的在库合规库存，点击下一步进入货品圈选
              </p>
            ) : null}
          </PrototypeAnnotationTarget>
        </div>

        {/* 底部吸底主按钮：统一经典蓝 blue-600 */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(35,45,57,0.06)]">
          <button
            type="button"
            onClick={goNext}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 text-base font-semibold text-white shadow-md active:bg-blue-700"
          >
            下一步：圈选货品
          </button>
        </div>

        {/* 货主选择 Sheet：对齐经典蓝 theme="blue" */}
        <ReceiptSelectSheet
          open={ownerSheetOpen}
          title={`选择${draft.ownerType === "ENTERPRISE" ? "企业" : "个人"}货主`}
          description="货主标识与资质由机构档案中心自动带出"
          options={ownerOptions.map((owner) => ({
            id: owner.id,
            label: owner.name,
            description: `标识：${owner.identifier}`,
          }))}
          selectedId={draft.ownerId}
          onClose={() => setOwnerSheetOpen(false)}
          onSelect={(option) => pickOwner(option.id)}
          theme="blue"
        />

        {/* 轻提示 Toast */}
        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-center text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 text-sm font-medium text-[#232D39]">
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
      <span className="min-w-0 truncate text-sm font-medium text-[#232D39]">{value}</span>
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
