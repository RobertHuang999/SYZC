import { useEffect, useRef, useState } from "react"
import { Building2, Camera, CalendarDays, Package } from "lucide-react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { MobileDownSelectSheet } from "../components/MobileDownSelectSheet"
import { MobileStoreroomMultiSheet } from "../components/MobileStoreroomMultiSheet"
import { NativeFormRow } from "../components/NativeFormRow"
import { NativeInfoCard } from "../components/NativeInfoCard"
import { NativeInboundStepBar } from "../components/NativeInboundStepBar"
import { RelatedOrderSheet } from "../components/RelatedOrderSheet"
import {
  INBOUND_TYPE_OPTIONS,
  inboundTypeNameToCode,
} from "../domain/inbound-type-options"
import type { ManualInboundType, OwnerType } from "../domain/form-types"
import { RELATED_ORDER_DIALOG_TITLE } from "../domain/form-constants"
import {
  INBOUND_INITIATE_GOODS_ROUTE,
  INBOUND_INITIATE_RESUME_STATE,
  TASKS_ROUTE,
} from "../domain/constants"
import {
  FORM_WAREHOUSES,
  FORM_STOREROOMS,
  filterOwnerSearchRecords,
  getRelatedOrdersByType,
} from "../mock/inbound-form.mock"
import {
  createInitialFormState,
  formHasDirtyFields,
} from "../lib/inbound-form-utils"
import {
  hasSignificantBasicChange,
  clearInboundInitiateSession,
  loadInboundInitiateForm,
  loadInboundInitiateSnapshot,
  saveInboundInitiateForm,
  saveInboundInitiateSnapshot,
} from "../lib/inbound-initiate-session"
import { validateInboundBasicStep } from "../lib/validate-inbound-basic"
import { INBOUND_FORM_MESSAGES } from "@prototype/shared/inbound/form-messages"
import { getStagingRegByNo } from "@prototype/shared/inbound/inbound-staging.mock"
import {
  formFromFormalInbound,
  formFromStagingRegRow,
} from "@/features/inbound-staging-reg/lib/staging-form-utils"
import { InboundStagingSwitchSheet } from "@/features/inbound-staging-reg/components/InboundStagingSwitchSheet"
import {
  INBOUND_STAGING_FORM_ROUTE,
  INBOUND_STAGING_FORM_RESUME,
} from "@/features/inbound-staging-reg/domain/constants"
import {
  clearInboundStagingSession,
  saveInboundStagingForm,
  saveStagingEditId,
} from "@/features/inbound-staging-reg/lib/inbound-staging-session"

export function InboundInitiatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const sourceRegId = searchParams.get("sourceRegId")
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(createInitialFormState)
  const [relatedOpen, setRelatedOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  const [warehouseOpen, setWarehouseOpen] = useState(false)
  const [storeroomOpen, setStoreroomOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [ownerDropdown, setOwnerDropdown] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [stagingSwitchOpen, setStagingSwitchOpen] = useState(false)

  useEffect(() => {
    const resume = (
      location.state as { resumeInboundDraft?: boolean } | null
    )?.resumeInboundDraft
    if (resume) {
      const saved = loadInboundInitiateForm()
      if (saved) setForm(saved)
      return
    }
    clearInboundInitiateSession()
    setForm(createInitialFormState())
  }, [location.key, location.state])

  const patch = (p: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...p }))

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  useEffect(() => {
    if (!sourceRegId) return
    const reg = getStagingRegByNo(sourceRegId)
    if (!reg) return
    if (reg.status !== "待补全") {
      showToast(`登记单 ${sourceRegId} 已非待补全，无法预填`)
      return
    }
    const prefill = formFromStagingRegRow(reg)
    setForm(prefill)
    saveInboundInitiateForm(prefill)
    showToast(`已加载暂存 ${sourceRegId} 预填`)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅 sourceRegId 变化时预填
  }, [sourceRegId])

  const typeCode = inboundTypeNameToCode(form.inboundType)
  const isNormal = typeCode === "NORMAL"
  const needRelated = typeCode !== "NORMAL" && typeCode !== null
  const manualWarehouse =
    typeCode === "NORMAL" ||
    typeCode === "MORTGAGE" ||
    typeCode === "PLEDGE" ||
    typeCode === "SUPERVISION_SERVICE"

  const ownerCandidates = filterOwnerSearchRecords(form.ownerType, form.ownerName)
  const warehouseName = FORM_WAREHOUSES.find((w) => w.id === form.warehouseId)?.name
  const storeroomLabel =
    form.storeroomIds.length === 0
      ? ""
      : form.storeroomIds
          .map((id) => FORM_STOREROOMS.find((r) => r.id === id)?.name)
          .filter(Boolean)
          .join("、")

  const setOwnerType = (value: OwnerType) => {
    patch({
      ownerType: value,
      ownerName: "",
      ownerIdentifier: "",
      contactPhone: "",
      idCardNo: "",
    })
    setOwnerDropdown(false)
  }

  const toggleStoreroom = (roomIds: string[]) => {
    const tags = new Set(
      roomIds
        .map((id) => FORM_STOREROOMS.find((r) => r.id === id)?.auditTag)
        .filter(Boolean)
    )
    if (tags.size > 1) {
      showToast("入库库房须同为需审核或免审（R06）")
      return
    }
    patch({ storeroomIds: roomIds })
  }

  const goNext = () => {
    const err = validateInboundBasicStep(form)
    if (err) {
      showToast(err)
      return
    }
    const snapshot = loadInboundInitiateSnapshot()
    let nextForm = { ...form }
    if (hasSignificantBasicChange(form, snapshot)) {
      nextForm = { ...nextForm, goodsLines: [] }
    }
    saveInboundInitiateForm(nextForm)
    saveInboundInitiateSnapshot(nextForm)
    const goodsPath = sourceRegId
      ? `${INBOUND_INITIATE_GOODS_ROUTE}?sourceRegId=${encodeURIComponent(sourceRegId)}`
      : INBOUND_INITIATE_GOODS_ROUTE
    navigate(goodsPath, { state: INBOUND_INITIATE_RESUME_STATE })
  }

  const handleBack = () => {
    if (formHasDirtyFields(form)) {
      setLeaveOpen(true)
      return
    }
    navigate(TASKS_ROUTE)
  }

  const relatedTitle =
    form.inboundType === "抵押入库" || form.inboundType === "质押入库"
      ? RELATED_ORDER_DIALOG_TITLE[form.inboundType]
      : "选择关联单"

  const datetimeLocalValue = form.inboundDate.slice(0, 16).replace(" ", "T")

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-blue-50/80 to-[#F2F3F7]">
        <PrototypeAnnotationTarget annotationIds={["inbound-h5-initiate"]}>
          <NavBar title="入库单填写" onBack={handleBack} />
        </PrototypeAnnotationTarget>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
          <NativeInboundStepBar current={0} />

          {sourceRegId ? (
            <div className="mb-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
              暂存转正预填 · {sourceRegId}（P10：提交成功回写登记单【已转正式】）
            </div>
          ) : (
            <button
              type="button"
              className="mb-3 w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
              onClick={() => setStagingSwitchOpen(true)}
            >
              切换为【入库暂存登记】通道（P09 现场极速备忘）
            </button>
          )}

          <NativeInfoCard
            title="货主信息"
            icon={<Building2 className="size-5" />}
          >
            <NativeFormRow label="货主类型" required>
              <div className="flex gap-6">
                {(
                  [
                    { value: "企业货主" as const, label: "企业" },
                    { value: "个人货主" as const, label: "个人" },
                  ] as const
                ).map(({ value, label }) => {
                  const active = form.ownerType === value
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`flex h-[26px] w-14 items-center justify-center rounded-md text-sm ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "bg-[#232D39]/5 text-[#232D39]/60"
                      }`}
                      onClick={() => setOwnerType(value)}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </NativeFormRow>

            <div className="relative border-b border-[#232D39]/10 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex shrink-0 text-sm text-[#232D39]">
                  <span className="mr-0.5 text-[#EF3E3E]">*</span>
                  货主名称
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                  <input
                    className="min-w-0 flex-1 bg-transparent text-right text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                    placeholder="请填写"
                    value={form.ownerName}
                    onChange={(e) => {
                      patch({ ownerName: e.target.value })
                      setOwnerDropdown(true)
                    }}
                    onFocus={() => setOwnerDropdown(true)}
                  />
                  {form.ownerType === "企业货主" ? (
                    <button
                      type="button"
                      className="shrink-0"
                      onClick={() => showToast("演示：证照 OCR 识别占位")}
                    >
                      <Camera className="size-[18px] text-[#232D39]/70" />
                    </button>
                  ) : null}
                </div>
              </div>
              {ownerDropdown && ownerCandidates.length > 0 && form.ownerName ? (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-lg bg-white shadow-lg">
                  {ownerCandidates.slice(0, 6).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className="block w-full border-b border-[#232D39]/10 px-4 py-3 text-left text-sm last:border-0"
                      onClick={() => {
                        patch({
                          ownerName: o.name,
                          ownerIdentifier: o.identifierMasked,
                          contactPhone: o.contactPhone ?? "",
                          idCardNo: o.idCardNo ?? "",
                        })
                        setOwnerDropdown(false)
                      }}
                    >
                      {o.name}{" "}
                      <span className="text-[#232D39]/50">{o.identifierMasked}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {form.ownerType === "个人货主" ? (
              <>
                <NativeFormRow label="货主标识" required>
                  <input
                    maxLength={11}
                    className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                    placeholder="请填写手机号"
                    value={form.ownerIdentifier}
                    onChange={(e) => patch({ ownerIdentifier: e.target.value })}
                  />
                </NativeFormRow>
                <NativeFormRow label="身份证号" required>
                  <input
                    maxLength={18}
                    className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                    placeholder="请输入身份证号"
                    value={form.idCardNo}
                    onChange={(e) => patch({ idCardNo: e.target.value })}
                  />
                </NativeFormRow>
              </>
            ) : null}

            {form.ownerType === "企业货主" ? (
              <>
                <NativeFormRow label="货主标识" required>
                  <input
                    className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                    placeholder="请输入公司统一社会信用代码"
                    value={form.ownerIdentifier}
                    onChange={(e) => patch({ ownerIdentifier: e.target.value })}
                  />
                </NativeFormRow>
                <NativeFormRow label="联系电话" required>
                  <input
                    maxLength={11}
                    className="w-full bg-transparent text-right text-sm outline-none placeholder:text-[#232D39]/30"
                    placeholder="请填写"
                    value={form.contactPhone}
                    onChange={(e) => patch({ contactPhone: e.target.value })}
                  />
                </NativeFormRow>
              </>
            ) : null}
          </NativeInfoCard>

          <NativeInfoCard title="入库信息" icon={<Package className="size-5" />}>
            <NativeFormRow
              label="入库日期"
              required
              onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
            >
              <span className="text-[#232D39]">{form.inboundDate || "请选择"}</span>
              <CalendarDays className="size-4 text-[#232D39]/50" />
            </NativeFormRow>
            <input
              ref={dateInputRef}
              type="datetime-local"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              value={datetimeLocalValue}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return
                patch({ inboundDate: v.replace("T", " ") + ":00" })
              }}
            />

            <NativeFormRow
              label="入库类型"
              required
              showChevron
              onClick={() => setTypeOpen(true)}
            >
              <span
                className={
                  form.inboundType ? "text-[#232D39]" : "text-[#232D39]/30"
                }
              >
                {form.inboundType || "请选择"}
              </span>
            </NativeFormRow>

            {!isNormal && form.inboundType ? (
              <>
                <NativeFormRow
                  label="关联单号"
                  required
                  className={needRelated ? "" : "opacity-60"}
                >
                  {needRelated ? (
                    <button
                      type="button"
                      className="text-sm text-blue-600"
                      onClick={() => setRelatedOpen(true)}
                    >
                      {form.relatedOrderNo || "选择单号"}
                    </button>
                  ) : (
                    <span className="text-sm text-[#232D39]/30">请先选择关联单号</span>
                  )}
                </NativeFormRow>
                <div className="mb-3 rounded-lg bg-[#232D39]/5 p-2">
                  <p className="text-xs text-[#232D39]/30">
                    可选择单据进行关联，单据中的货物将自动填充
                  </p>
                </div>
              </>
            ) : null}

            {form.inboundType && (manualWarehouse || typeCode === "CD") ? (
              <>
                <NativeFormRow
                  label="入库仓库"
                  required
                  showChevron={manualWarehouse}
                  onClick={manualWarehouse ? () => setWarehouseOpen(true) : undefined}
                  className={!isNormal && form.inboundType ? "border-t border-[#232D39]/10" : ""}
                >
                  <span
                    className={
                      warehouseName ? "text-[#232D39]" : "text-[#232D39]/30"
                    }
                  >
                    {typeCode === "CD" && !form.relatedOrderNo
                      ? "请先选择关联单号"
                      : warehouseName || "请选择"}
                  </span>
                </NativeFormRow>
                <NativeFormRow
                  label="入库库房"
                  required
                  showChevron={manualWarehouse}
                  onClick={manualWarehouse ? () => setStoreroomOpen(true) : undefined}
                >
                  <span
                    className={
                      storeroomLabel ? "text-[#232D39]" : "text-[#232D39]/30"
                    }
                  >
                    {storeroomLabel || "请选择"}
                  </span>
                </NativeFormRow>
              </>
            ) : null}

            <div className="relative mt-3 rounded-lg bg-[#232D39]/5 p-3">
              <textarea
                className="min-h-[60px] w-full resize-none bg-transparent text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                placeholder="备注"
                maxLength={140}
                value={form.remark}
                onChange={(e) => patch({ remark: e.target.value })}
              />
              <p className="text-right text-xs text-[#232D39]/30">
                {form.remark.length}/140
              </p>
            </div>
          </NativeInfoCard>

          <button
            type="button"
            className="mt-4 flex h-[52px] w-full items-center justify-center rounded-lg bg-blue-600 text-base font-medium text-white active:bg-blue-700"
            onClick={goNext}
          >
            下一步
          </button>
        </div>
      </div>

      <MobileDownSelectSheet
        open={typeOpen}
        title="选择入库类型"
        options={INBOUND_TYPE_OPTIONS.map((t) => ({ id: t.id, label: t.name }))}
        selectedId={INBOUND_TYPE_OPTIONS.find((t) => t.name === form.inboundType)?.id}
        onClose={() => setTypeOpen(false)}
        onSelect={(opt) => {
          const item = INBOUND_TYPE_OPTIONS.find((t) => t.id === opt.id)
          if (!item) return
          patch({
            inboundType: item.name as ManualInboundType,
            relatedOrderNo: "",
            relatedOrderLabel: "",
            warehouseId: "",
            storeroomIds: [],
          })
        }}
      />

      <MobileDownSelectSheet
        open={warehouseOpen}
        title="选择入库仓库"
        options={FORM_WAREHOUSES.map((w) => ({ id: w.id, label: w.name }))}
        selectedId={form.warehouseId}
        onClose={() => setWarehouseOpen(false)}
        onSelect={(opt) => patch({ warehouseId: opt.id, storeroomIds: [] })}
      />

      <MobileStoreroomMultiSheet
        open={storeroomOpen}
        title="选择库房"
        rooms={FORM_STOREROOMS.filter((r) => r.warehouseId === form.warehouseId)}
        selectedIds={form.storeroomIds}
        onClose={() => setStoreroomOpen(false)}
        onConfirm={toggleStoreroom}
      />

      <RelatedOrderSheet
        open={relatedOpen}
        title={relatedTitle}
        rows={getRelatedOrdersByType(form.inboundType)}
        onClose={() => setRelatedOpen(false)}
        onSelect={(row) => {
          patch({
            relatedOrderNo: row.orderNo,
            relatedOrderLabel: row.orderNo,
            ownerName: row.ownerName,
            ownerIdentifier: row.ownerIdentifierMasked,
            warehouseId: FORM_WAREHOUSES[0]?.id ?? "",
          })
          setRelatedOpen(false)
        }}
      />

      <InboundStagingSwitchSheet
        open={stagingSwitchOpen}
        onClose={() => setStagingSwitchOpen(false)}
        onNavigateBlank={() => {
          setStagingSwitchOpen(false)
          clearInboundStagingSession()
          navigate(INBOUND_STAGING_FORM_ROUTE)
        }}
        onNavigateWithCopy={() => {
          setStagingSwitchOpen(false)
          saveStagingEditId(null)
          saveInboundStagingForm(formFromFormalInbound(form))
          navigate(INBOUND_STAGING_FORM_ROUTE, { state: INBOUND_STAGING_FORM_RESUME })
        }}
      />

      {leaveOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-4">
            <p className="font-medium">确认离开</p>
            <p className="mt-2 text-sm text-gray-600">{INBOUND_FORM_MESSAGES.leaveConfirm}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border py-2 text-sm"
                onClick={() => setLeaveOpen(false)}
              >
                继续编辑
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white"
                onClick={() => {
                  clearInboundInitiateSession()
                  navigate(TASKS_ROUTE)
                }}
              >
                离开
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  )
}
